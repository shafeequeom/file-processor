import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { v4 as uuid } from 'uuid';
import type { File } from 'formidable';


const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadToSupabase(file: File, fileId = uuid()) {
    const filePath = `logs/${fileId}.log`;



    const { error } = await supabase.storage
        .from('log-files')
        .upload(filePath, fs.createReadStream(file.filepath), {
            contentType: 'text/plain',
            duplex: 'half',
        });

    if (error) {
        console.log(error);

        console.error('❌ Supabase upload failed:', error.message);
        return null;
    }

    return { fileId, filePath };
}
