import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Clone the request headers and set a new header `x-hello-from-middleware1`

  const token = request.cookies.get('accessToken');
  console.log('-------------middleware----------', token?.name);
  console.log('-------------middleware----------', token?.value);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hello-from-middleware1', 'hello');
  // console.log('token', token?.value);
  requestHeaders.set('authorization', 'bearer ' + token?.value);
  // You can also set request headers in NextResponse.next
  console.log(requestHeaders.values());
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  });
  response.headers.set('authorization', 'bearer ' + token?.value);
  // Set a new response header `x-hello-from-middleware2`
  response.headers.set('x-hello-from-middleware2', 'hello');
  return response;
}
