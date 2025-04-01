import { Readable } from 'node:stream'; // works in most setups
import { supabase } from '../Utils/supabase';


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
        .createSignedUrl(path, 60); // signed URL valid for 60s

    if (error || !data?.signedUrl) {
        return null;
    }

    // Use native fetch to stream the file
    const res = await fetch(data.signedUrl);
    if (!res.ok || !res.body) {
        return null;
    }

    // Convert web stream to Node.js Readable
    return Readable.fromWeb(res.body as any);

}