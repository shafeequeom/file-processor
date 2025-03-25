import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { uploadToSupabase } from '@/lib/supabase';
import { logQueue } from '@/lib/queue';
import { v4 as uuid } from 'uuid';

export const config = {
    api: {
        bodyParser: false, // Required for formidable to handle stream
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, message: 'Method Not Allowed' });
    }

    const form = formidable({
        multiples: false,
        uploadDir: '/tmp', // or another temp folder
        keepExtensions: true,
        filename: (_name, _ext, part) => `${uuid()}.log`, // optional
    });

    const [fields, files] = await new Promise<[formidable.Fields, formidable.Files]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            else resolve([fields, files]);
        });
    });

    const fileArray = files.file as formidable.File[];

    const file = fileArray[0];

    if (!file || !file.filepath) {
        return res.status(400).json({ status: false, message: 'No file uploaded' });
    }

    const fileId = uuid();
    const upload = await uploadToSupabase(file, fileId);

    if (!upload) {
        return res.status(500).json({ status: false, message: 'Upload failed' });
    }

    const job = await logQueue.add('process-log', {
        filePath: upload.filePath,
        fileId: upload.fileId,
    });

    return res.status(200).json({ status: true, data: { jobId: job.id }, message: 'File uploaded successfully' });
}
