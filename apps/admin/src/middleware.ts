import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const requestHeaders = new Headers(request.headers);

  if (token?.value) {
    requestHeaders.set('Authorization', `Bearer ${token.value}`);
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  return response;
}
