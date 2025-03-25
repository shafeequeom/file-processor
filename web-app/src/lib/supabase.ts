import fs from 'fs';
import { v4 as uuid } from 'uuid';
import type { File } from 'formidable';
import { supabase } from '@/util/supabase'

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
