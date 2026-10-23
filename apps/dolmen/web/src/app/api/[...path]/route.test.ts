// @vitest-environment node
import type { NextRequest } from "next/server";
import { afterEach, expect, it, vi } from "vitest";
import { POST } from "./route";

afterEach(() => vi.unstubAllGlobals());
it("평가 요청의 abort signal을 upstream fetch까지 전달한다", async () => {
	const controller = new AbortController();
	const request = new Request("http://localhost/dolmen/api/evaluations/judge", {
		method: "POST",
		body: "{}",
		signal: controller.signal,
	}) as NextRequest;
	const fetchApi = vi
		.fn()
		.mockResolvedValue(Response.json({ status: "skipped" }));
	vi.stubGlobal("fetch", fetchApi);
	await POST(request, {
		params: Promise.resolve({ path: ["evaluations", "judge"] }),
	});
	const upstreamOptions = fetchApi.mock.calls[0]?.[1] as RequestInit;
	expect(upstreamOptions.signal).toBe(request.signal);
	controller.abort();
	expect(upstreamOptions.signal?.aborted).toBe(true);
});
