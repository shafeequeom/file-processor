import { supabase } from '@/util/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { jobId: string } }) {
    const { jobId } = params;

    if (!jobId) {
        return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('log_stats')
        .select('*')
        .eq('job_id', jobId)
        .single();

    if (error) {
        console.error('❌ Failed to fetch stats:', error.message);
        return NextResponse.json({ error: 'Stats not found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
}
