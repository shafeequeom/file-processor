export interface JobUpdate {
    job_id: string;
    file_id: string;
    status: string;
    created_at: string;
    ip_addresses?: string[];
    message?: string;
    errors?: Array<{
        level: string;
        message: string;
        ip?: string;
    }>;
}

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

export interface StatusData {
    totalJobs?: number;
    uniqueIPCount?: number;
    totalErrors?: number;
    totalFailedJobs?: number;
}
