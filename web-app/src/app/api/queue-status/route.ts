import { NextRequest } from 'next/server';
import { logQueue } from '@/lib/queue';
import { errorResponse, successResponse } from '@/util/apiResponse';
import { rateLimiter } from '@/lib/rateLimiter';

export const dynamic = 'force-dynamic'; // avoid caching, always fetch fresh queue data

export async function GET(req: NextRequest) {

    const ip = req.headers.get('x-forwarded-for')?.toString() || '127.0.0.1';

    try {
        await rateLimiter.consume(ip);
    } catch {
        return errorResponse("Too many requests", null, 429);
    }

    try {
        const counts = await logQueue.getJobCounts();

        return successResponse('Queue status fetched successfully', counts);
    } catch (error: any) {
        return errorResponse('Failed to fetch queue status', error.message);
    }
}
