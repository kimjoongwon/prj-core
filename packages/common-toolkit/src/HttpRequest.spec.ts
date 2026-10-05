import { describe, expect, it } from "vitest";
import { resolveHttpClientIp, resolveHttpUserAgent } from "./HttpRequest";

describe("HttpRequest", () => {
	describe("resolveHttpClientIp", () => {
		it("Given x-forwarded-for 문자열 When 여러 IP가 있으면 Then 첫 IP를 반환해야 함", () => {
			const request = {
				headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" },
				ip: "127.0.0.1",
			};

			expect(resolveHttpClientIp(request)).toBe("203.0.113.1");
		});

		it("Given x-forwarded-for 배열 When 값이 있으면 Then 첫 배열 항목의 첫 IP를 반환해야 함", () => {
			const request = {
				headers: { "x-forwarded-for": ["203.0.113.2, 10.0.0.2"] },
				ip: "127.0.0.1",
			};

			expect(resolveHttpClientIp(request)).toBe("203.0.113.2");
		});

		it("Given forwarded header가 없을 때 When ip가 있으면 Then request ip를 반환해야 함", () => {
			const request = {
				headers: {},
				ip: "198.51.100.10",
				socket: { remoteAddress: "10.0.0.3" },
			};

			expect(resolveHttpClientIp(request)).toBe("198.51.100.10");
		});

		it("Given forwarded와 ip가 없을 때 When socket remoteAddress가 있으면 Then socket 값을 반환해야 함", () => {
			const request = {
				headers: {},
				socket: { remoteAddress: "10.0.0.4" },
			};

			expect(resolveHttpClientIp(request)).toBe("10.0.0.4");
		});

		it("Given IP 출처가 없을 때 When 조회하면 Then unknown을 반환해야 함", () => {
			expect(resolveHttpClientIp({ headers: {} })).toBe("unknown");
		});
	});

	describe("resolveHttpUserAgent", () => {
		it("Given user-agent 문자열 When 조회하면 Then 문자열을 반환해야 함", () => {
			const request = { headers: { "user-agent": "Mozilla/5.0" } };

			expect(resolveHttpUserAgent(request)).toBe("Mozilla/5.0");
		});

		it("Given user-agent 배열 When 조회하면 Then 첫 값을 반환해야 함", () => {
			const request = { headers: { "user-agent": ["Agent-A", "Agent-B"] } };

			expect(resolveHttpUserAgent(request)).toBe("Agent-A");
		});

		it("Given user-agent가 없을 때 When 조회하면 Then unknown을 반환해야 함", () => {
			expect(resolveHttpUserAgent({ headers: {} })).toBe("unknown");
		});
	});
});
