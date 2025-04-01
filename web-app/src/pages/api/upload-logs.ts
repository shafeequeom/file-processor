import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingForm, Fields, Files, File } from 'formidable';
import { v4 as uuid } from 'uuid';
import { uploadToSupabase } from '@/lib/supabase';
import { logQueue } from '@/lib/queue';
import { createServerClient } from '@supabase/ssr';
import { rateLimiter } from '@/lib/rateLimiter';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ status: false, message: 'Method Not Allowed' });
    }

    const ip = req.headers['x-forwarded-for']?.toString() || req.socket.remoteAddress || '127.0.0.1';

    try {
        await rateLimiter.consume(ip);
    } catch {
        return res.status(429).json({ status: false, message: 'Too many requests' });
    }

    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return req.cookies
                            ? Object.entries(req.cookies)
                                .filter(([, value]) => value !== undefined)
                                .map(([name, value]) => ({ name, value: value as string }))
                            : [];
                    },
                    setAll() { },
                },
            }
        );

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            return res.status(401).json({ status: false, message: 'Unauthorized user' });
        }

        const form = new IncomingForm({
            multiples: false,
            uploadDir: '/tmp',
            keepExtensions: true,
            filename: () => `${uuid()}.log`,
        });


        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const [fields, files] = await new Promise<[Fields, Files]>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve([fields, files]);
                }
            });
        });

        const fileArray = files.file as File[];
        const file = fileArray?.[0];

        if (!file || !file.filepath) {
            return res.status(400).json({ status: false, message: 'No file uploaded' });
        }

        const fileId = uuid();
        const upload = await uploadToSupabase(file, fileId);

        if (!upload) {
            return res.status(500).json({ status: false, message: 'Upload failed' });
        }

        const fileSizeInBytes = file.size;
        const priority = Math.max(1, 10000 - fileSizeInBytes);

        const payload = {
            filePath: upload.filePath,
            fileId: upload.fileId,
            userId: user.id,
        };

        const job = await logQueue.add('process-log', payload, {
            priority,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
        });

        return res.status(200).json({
            status: true,
            data: { jobId: job.id },
            message: 'File uploaded successfully',
        });
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Unexpected error';
        return res.status(500).json({ status: false, message: errorMessage });
    }
}
