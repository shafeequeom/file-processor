import { Job } from 'bullmq';
import readline from 'readline';
import { downloadLogFileStream, insertStatsToSupabase } from '../Service/supabase';
import { parseFile } from '../Utils/parser';

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

    const statsData = await parseFile(rl);

    // Store parsed results in Supabase
    await insertStatsToSupabase({
        jobId: String(job.id),
        fileId,
        stats: Object.fromEntries(statsData.stats),
        ipAddresses: Array.from(statsData.ipAddresses),
        errors: statsData.errors,
    });

    console.log(`✅ Processed file: ${filePath}`);
};
