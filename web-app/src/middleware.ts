import { NextRequest } from 'next/server'
import { updateSession } from './util/supabase/middleware';


export async function middleware(req: NextRequest) {
    const supabase = updateSession(req);
    return supabase;
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
