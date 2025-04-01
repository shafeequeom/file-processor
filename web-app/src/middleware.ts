import { NextRequest } from 'next/server';
import { updateSession } from './util/supabase/middleware';

export async function middleware(req: NextRequest) {

    // Apply Supabase session logic to all protected routes
    return await updateSession(req);
}

export const config = {
    matcher: ["/dashboard/:path*", "/api/:path*"],
};
