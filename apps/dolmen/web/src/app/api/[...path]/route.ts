import type { NextRequest } from "next/server";

/**
 * dolmen-api 프록시 라우트 — 브라우저의 /dolmen/api/* 요청을 같은 클러스터의
 * dolmen-api 서비스로 전달한다(SSE 스트리밍 그대로 통과).
 *
 * next.config rewrites 대신 이 핸들러를 쓰는 이유: standalone 빌드는 rewrites
 * destination을 빌드 시점에 굳어지게 직렬화해 환경별 재빌드가 강제되지만,
 * 이 방식은 요청 시점의 DOLMEN_API_URL 환경변수(차트 extraEnv 주입)를 읽는다.
 */

const DOLMEN_API_URL_DEFAULT = "http://localhost:3012";

function resolveDolmenApiUrl(): string {
	return process.env.DOLMEN_API_URL || DOLMEN_API_URL_DEFAULT;
}

async function forwardToDolmenApi(
	request: NextRequest,
	apiPathSegments: string[],
): Promise<Response> {
	const upstreamUrl = `${resolveDolmenApiUrl()}/api/${apiPathSegments.join("/")}`;
	const hasRequestBody = !["GET", "HEAD"].includes(request.method);

	let upstreamResponse: Response;
	try {
		upstreamResponse = await fetch(upstreamUrl, {
			method: request.method,
			headers: {
				"Content-Type":
					request.headers.get("content-type") ?? "application/json",
			},
			body: hasRequestBody ? await request.text() : undefined,
			cache: "no-store",
		});
	} catch {
		return Response.json(
			{ error: "dolmen-api에 연결할 수 없습니다." },
			{ status: 502 },
		);
	}

	const upstreamContentType = upstreamResponse.headers.get("content-type");
	const proxyResponseHeaders = new Headers();
	if (upstreamContentType) {
		proxyResponseHeaders.set("content-type", upstreamContentType);
	}
	proxyResponseHeaders.set("cache-control", "no-cache");
	if (upstreamContentType?.includes("text/event-stream")) {
		// nginx ingress가 SSE 응답을 버퍼링하지 않도록 업스트림 판정을 그대로 전달
		proxyResponseHeaders.set("x-accel-buffering", "no");
	}

	return new Response(upstreamResponse.body, {
		status: upstreamResponse.status,
		headers: proxyResponseHeaders,
	});
}

export async function GET(
	request: NextRequest,
	routeContext: { params: Promise<{ path: string[] }> },
): Promise<Response> {
	const { path } = await routeContext.params;
	return forwardToDolmenApi(request, path);
}

export async function POST(
	request: NextRequest,
	routeContext: { params: Promise<{ path: string[] }> },
): Promise<Response> {
	const { path } = await routeContext.params;
	return forwardToDolmenApi(request, path);
}
