import { errorResponse, notFoundResponse, successResponse } from '@/util/apiResponse';
import { supabase } from '@/util/supabase';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
    const { jobId } = params;

    if (!jobId) {
        return errorResponse('Job ID is required');
    }

    const { data, error } = await supabase
        .from('log_stats')
        .select('*')
        .eq('job_id', jobId)
        .single();

    if (error) {
        console.error('❌ Failed to fetch stats:', error.message);
        return notFoundResponse("File not found");
    }

    return successResponse('Stats fetched successfully', data);
}
