import { Job } from 'bullmq';

export const processLogJob = async (job: Job) => {
    const { filePath, fileId } = job.data;

    console.log(`Processing file: ${filePath}, jobId: ${fileId}`);

    // TODO: Stream parse log file, extract keywords/IPs, store in Supabase
    return {
        message: 'Processing complete (placeholder)',
        fileId,
    };
};
