export interface JobInterface {
    jobId: string;
    fileId: string;
    status: string;
    message?: string;
    stats?: Record<string, number>;
    ipAddresses?: string[];
    errors?: Array<{
        level: string;
        message: string;
        ip?: string;
    }>;
}