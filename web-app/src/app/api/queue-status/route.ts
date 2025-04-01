import { NextRequest } from 'next/server';
import { logQueue } from '@/lib/queue';
import { errorResponse, successResponse } from '@/util/apiResponse';

export const dynamic = 'force-dynamic'; // avoid caching, always fetch fresh queue data

export async function GET(req: NextRequest) {
    try {
        const counts = await logQueue.getJobCounts();

        return successResponse('Queue status fetched successfully', counts);
    } catch (error: any) {
        return errorResponse('Failed to fetch queue status', error.message);
    }
}
