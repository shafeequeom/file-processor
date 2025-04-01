import { rateLimiter } from '@/lib/rateLimiter';
import { errorResponse, successResponse } from '@/util/apiResponse';
import { supabase } from '@/util/supabase/client';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    const ip = req.headers.get('x-forwarded-for')?.toString() || '127.0.0.1';

    try {
        await rateLimiter.consume(ip);
    } catch {
        return errorResponse("Too many requests", null, 429);
    }

    try {
        const { data, error } = await supabase.rpc('get_aggregated_stats');

        if (error) throw error;

        return successResponse('Stats fetched successfully', data);
    } catch (error: any) {
        return errorResponse(error.message || 'Failed to fetch stats');
    }
}