import { Job } from 'bullmq';
import readline from 'readline';
import config from '../Common/Config/config';
import { downloadLogFileStream, insertStatsToSupabase } from '../Service/supabase';

export const processLogJob = async (job: Job) => {
    const { filePath, fileId } = job.data;

    console.log(`📥 Processing log file: ${filePath}`);

    const supabaseStream = await downloadLogFileStream(filePath);
    if (!supabaseStream) {
        throw new Error(`Failed to download file: ${filePath}`);
    }

    const rl = readline.createInterface({
        input: supabaseStream,
        crlfDelay: Infinity
    });

    const keywords = config.keywords.split(',') || ['ERROR', 'FAIL', 'EXCEPTION'];
    const stats = {
        fileId,
        ipAddresses: new Set<string>(),
        keywordMatches: new Map<string, number>(),
    };

    for await (const line of rl) {
        // Match IP addresses
        const ips = line.match(/\b\d{1,3}(\.\d{1,3}){3}\b/g);
        if (ips) {
            ips.forEach(ip => stats.ipAddresses.add(ip));
        }

        // Count keyword occurrences
        keywords.forEach((keyword: string) => {
            if (line.includes(keyword)) {
                stats.keywordMatches.set(
                    keyword,
                    (stats.keywordMatches.get(keyword) || 0) + 1
                );
            }
        });
    }

    // Store parsed results in Supabase
    await insertStatsToSupabase({
        fileId,
        keywords: Object.fromEntries(stats.keywordMatches),
        ipAddresses: Array.from(stats.ipAddresses),
    });

    console.log(`✅ Processed file: ${filePath}`);
};
