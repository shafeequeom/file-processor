import { errorResponse, successResponse } from '@/util/apiResponse';
import { supabase } from '@/util/supabase';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { data, error } = await supabase.rpc('get_aggregated_stats');

        if (error) throw error;

        return successResponse('Stats fetched successfully', data);
    } catch (error: any) {
        return errorResponse(error.message || 'Failed to fetch stats');
    }
}