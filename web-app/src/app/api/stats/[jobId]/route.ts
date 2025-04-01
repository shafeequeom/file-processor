import { rateLimiter } from '@/lib/rateLimiter';
import { errorResponse, notFoundResponse, successResponse } from '@/util/apiResponse';
import { createClient } from '@/util/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const { jobId } = await params;

    if (!jobId) {
        return errorResponse('Job ID is required');
    }

    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';

    try {
        await rateLimiter.consume(ip);
    } catch {
        return errorResponse("Too many requests", null, 429);
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from('log_stats')
        .select('*')
        .eq('job_id', jobId)
        .single();

    if (error) {
        console.error('❌ Failed to fetch stats:', error.message);
        return notFoundResponse("Job not found");
    }

    return successResponse('Stats fetched successfully', data);
}
