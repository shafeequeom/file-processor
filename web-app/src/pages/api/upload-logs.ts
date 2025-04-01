import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { v4 as uuid } from 'uuid';
import { uploadToSupabase } from '@/lib/supabase';
import { logQueue } from '@/lib/queue';
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers';

// Ensure formidable can parse
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, message: 'Method Not Allowed' });
    }

    try {
        // 1. Create Supabase server client using headers/cookies
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return req.cookies ? Object.entries(req.cookies).map(([name, value]) => ({ name, value })) : [];
                    },
                    setAll() { }, // Not needed here, but required by type
                },
            }
        );

        // 2. Get user session
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return res.status(401).json({ status: false, message: 'Unauthorized user' });
        }

        // 3. Parse file
        const form = formidable({
            multiples: false,
            uploadDir: '/tmp',
            keepExtensions: true,
            filename: (_name, _ext, part) => `${uuid()}.log`,
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

        // 4. Upload to Supabase
        const fileId = uuid();
        const upload = await uploadToSupabase(file, fileId);

        if (!upload) {
            return res.status(500).json({ status: false, message: 'Upload failed' });
        }

        // 5. Add job to queue with userId

        const fileSizeInBytes = file.size; // Get file size
        const priority = Math.max(1, 10000 - fileSizeInBytes);
        const payload = {
            filePath: upload.filePath,
            fileId: upload.fileId,
            userId: user.id
        };

        const job = await logQueue.add("process-log", payload, {
            priority,
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
        });

        return res.status(200).json({
            status: true,
            data: { jobId: job.id },
            message: 'File uploaded successfully',
        });
    } catch (err: any) {
        console.error("❌ Upload handler error:", err);
        return res.status(500).json({ status: false, message: err.message || 'Unexpected error' });
    }
}
