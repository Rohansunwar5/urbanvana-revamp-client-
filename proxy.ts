import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = (process.env.CORS_ORIGINS ?? '*')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const CORS_STATIC = {
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, x-session-id',
  'Access-Control-Max-Age': '86400',
};

function getAllowedOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) return null;
  if (ALLOWED_ORIGINS.includes('*')) return '*';
  return ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : null;
}

export function proxy(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigin = getAllowedOrigin(origin);

  if (request.method === 'OPTIONS') {
    const headers: Record<string, string> = { ...CORS_STATIC };
    if (allowedOrigin) {
      headers['Access-Control-Allow-Origin'] = allowedOrigin;
      headers['Vary'] = 'Origin';
    }
    return new NextResponse(null, { status: 204, headers });
  }

  const response = NextResponse.next();
  if (allowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Vary', 'Origin');
  }
  Object.entries(CORS_STATIC).forEach(([k, v]) => response.headers.set(k, v));
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
