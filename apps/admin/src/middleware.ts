import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`

  const token = request.cookies.get('accessToken');
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hello-from-middleware1', 'hello');
  requestHeaders.set('authorization', 'Bearer ' + token?.value);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  return response;
}
