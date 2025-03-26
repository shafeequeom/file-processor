import { Job } from 'bullmq';
import readline from 'readline';
import { downloadLogFileStream, insertStatsToSupabase } from '../Service/supabase';
import { parseFile } from '../Utils/parser';

export const processLogJob = async (job: Job) => {

    const { filePath, fileId } = job.data;
    const jobId = String(job.id);


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

    if (!statsData) {
        throw new Error(`Failed to parse file: ${filePath}`);
    }

    // Store parsed results in Supabase
    const stats = Object.fromEntries(statsData.stats)
    await insertStatsToSupabase({
        jobId: jobId,
        fileId,
        stats: stats,
        ipAddresses: Array.from(statsData.ipAddresses),
        errors: statsData.errors,
    });

    console.log(`✅ Processed file: ${filePath}`);
};
