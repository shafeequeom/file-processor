import { supabase } from "../Utils/supabase";
import { Readable } from 'stream';


export async function insertStatsToSupabase(payload: {
    fileId: string;
    keywords: Record<string, number>;
    ipAddresses: string[];
}) {
    const { error } = await supabase.from('log_stats').insert({
        file_id: payload.fileId,
        keywords: payload.keywords,
        ip_addresses: payload.ipAddresses,
        created_at: new Date().toISOString(),
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