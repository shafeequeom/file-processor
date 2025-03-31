import { NextRequest } from 'next/server';
import { logQueue } from '@/lib/queue';
import { errorResponse, successResponse } from '@/util/apiResponse';
import { pub } from '@/lib/redis';

export const dynamic = 'force-dynamic'; // avoid caching, always fetch fresh queue data

export async function GET(req: NextRequest) {
    try {
        const counts = await logQueue.getJobCounts();

        await pub.publish('job-events', JSON.stringify({ message: "hello" }))

        return successResponse('Queue status fetched successfully', counts);
    } catch (error: any) {
        return errorResponse('Failed to fetch queue status', error.message);
    }
}
