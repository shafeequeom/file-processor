import { supabase } from "../Utils/supabase";
import { Readable } from 'stream';


export async function insertStatsToSupabase(payload: {
    jobId: string;
    fileId: string;
    stats: Record<string, number>;
    ipAddresses: string[];
    errors: Array<{ level: string, message: string, jsonPayload: any, ip: string | null }>;
    userId: string;
}) {
    const { error } = await supabase.from('log_stats').insert({
        job_id: payload.jobId,
        file_id: payload.fileId,
        stats: payload.stats,
        ip_addresses: payload.ipAddresses,
        errors: payload.errors,
        created_at: new Date().toISOString(),
        user_id: payload.userId,
    });

    if (error) {
        console.error('❌ Failed to store stats:', error.message);
        throw error;
    }

    console.log(`📊 Stored stats for fileId: ${payload.fileId}`);
}


export async function downloadLogFileStream(path: string): Promise<Readable | null> {
    const { data, error } = await supabase.storage
        .from('log-files')
        .download(path);

    if (error || !data) {
        console.error('❌ Failed to download file from Supabase:', error?.message);
        return null;
    }
    const buffer = Buffer.from(await data.arrayBuffer());


    return Readable.from(buffer); // convert web stream to Node stream
}