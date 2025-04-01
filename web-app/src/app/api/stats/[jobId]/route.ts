import { errorResponse, notFoundResponse, successResponse } from '@/util/apiResponse';
import { createClient } from '@/util/supabase/server';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, context: { params: { jobId: string } }) {
    const { jobId } = context.params;

    if (!jobId) {
        return errorResponse('Job ID is required');
    }

    const supabase = await createClient(); // Accept token manually


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
