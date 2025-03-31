import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {


    console.log('Middleware triggered for path:', req.nextUrl.pathname);

    const token = req.cookies.get('sb-access-token')?.value;
    if (!token) return NextResponse.redirect(new URL('/login', req.url));
    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
