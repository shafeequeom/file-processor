import { Job } from 'bullmq';
import readline from 'readline';
import { downloadLogFileStream, insertStatsToSupabase } from '../Service/supabase';
import { parseFile } from '../Utils/parser';
import { publishJobEvent, } from '../Utils/redis';

export const processLogJob = async (job: Job) => {

    const { filePath, fileId, userId } = job.data;
    const jobId = String(job.id);

    console.log(`📥 Processing log file: ${filePath}`);

    await publishJobEvent({
        jobId: jobId,
        status: 'started',
        fileId: fileId,
        message: 'Processing started',
    });

    const supabaseStream = await downloadLogFileStream(filePath);
    if (!supabaseStream) {
        await publishJobEvent({
            jobId: jobId,
            status: 'failed',
            fileId: fileId,
            message: 'Failed to download file',
        });
        throw new Error(`Failed to download file: ${filePath}`);
    }

    const rl = readline.createInterface({
        input: supabaseStream,
        crlfDelay: Infinity
    });

    const statsData = await parseFile(rl);

    if (!statsData) {
        await publishJobEvent({
            jobId: jobId,
            status: 'failed',
            fileId: fileId,
            message: 'Failed to parse file',
        });
        throw new Error(`Failed to parse file: ${filePath}`);
    }

    await publishJobEvent({
        jobId: jobId,
        status: 'inprogress',
        fileId: fileId,
    });
    // Store parsed results in Supabase
    const stats = Object.fromEntries(statsData.stats)
    await insertStatsToSupabase({
        jobId: jobId,
        fileId,
        stats: stats,
        ipAddresses: Array.from(statsData.ipAddresses),
        errors: statsData.errors,
        userId: userId,
    });

    await publishJobEvent({
        jobId: jobId,
        status: 'completed',
        fileId: fileId,
        message: 'File processed successfully',
        stats: stats,
        ipAddresses: Array.from(statsData.ipAddresses),
        errors: statsData.errors,
    });

    console.log(`✅ Processed file: ${filePath}`);
};
