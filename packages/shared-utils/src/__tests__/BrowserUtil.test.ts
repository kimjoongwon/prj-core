import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { navigateTo, reload, getCurrentUrl, getUserAgent } from "../BrowserUtil";

// Mock browser globals
const mockDocument = {
	cookie: "test1=value1; test2=value2; test3=value3",
};

const mockWindow = {
	location: {
		hostname: "example.com",
		href: "https://example.com/path",
		protocol: "https:",
		port: "443",
		pathname: "/path",
		search: "?param=value",
		hash: "#section",
		replace: vi.fn(),
		reload: vi.fn(),
	},
};

const mockNavigator = {
	userAgent:
		"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

const mockLocalStorage = {
	clear: vi.fn(),
};

const mockSessionStorage = {
	clear: vi.fn(),
};

describe("BrowserUtil", () => {
	beforeEach(() => {
		// Reset mocks
		vi.clearAllMocks();

		// Reset window.location properties for each test
		mockWindow.location.href = "https://example.com/path";

		// Setup global mocks
		global.document = mockDocument as any;
		global.window = mockWindow as any;
		global.navigator = mockNavigator as any;
		global.localStorage = mockLocalStorage as any;
		global.sessionStorage = mockSessionStorage as any;
	});

	afterEach(() => {
		// Clean up mocks
		delete (global as any).document;
		delete (global as any).window;
		delete (global as any).navigator;
		delete (global as any).localStorage;
		delete (global as any).sessionStorage;
	});

	describe("navigateTo", () => {
		it("새 URL로 이동해야 한다", () => {
			// Mock the href setter
			let hrefValue = mockWindow.location.href;
			Object.defineProperty(mockWindow.location, "href", {
				get: () => hrefValue,
				set: (value: string) => {
					hrefValue = value;
				},
				configurable: true,
			});

			navigateTo("/new-page");

			expect(hrefValue).toBe("/new-page");
		});

		it("replace 옵션으로 이동해야 한다", () => {
			navigateTo("/new-page", true);

			expect(mockWindow.location.replace).toHaveBeenCalledWith("/new-page");
		});

		it("window가 없으면 경고를 출력해야 한다", () => {
			delete (global as any).window;
			const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			navigateTo("/new-page");

			expect(consoleSpy).toHaveBeenCalledWith(
				"window가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.",
			);

			consoleSpy.mockRestore();
		});
	});

	describe("reload", () => {
		it("페이지를 새로고침해야 한다", () => {
			reload();

			expect(mockWindow.location.reload).toHaveBeenCalledOnce();
		});

		it("window가 없으면 경고를 출력해야 한다", () => {
			delete (global as any).window;
			const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			reload();

			expect(consoleSpy).toHaveBeenCalledWith(
				"window가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.",
			);

			consoleSpy.mockRestore();
		});
	});

	describe("getCurrentUrl", () => {
		it("현재 URL 정보를 반환해야 한다", () => {
			const result = getCurrentUrl();

			expect(result).toEqual({
				href: "https://example.com/path",
				protocol: "https:",
				hostname: "example.com",
				port: "443",
				pathname: "/path",
				search: "?param=value",
				hash: "#section",
			});
		});

		it("window가 없으면 null을 반환해야 한다", () => {
			delete (global as any).window;
			const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			const result = getCurrentUrl();

			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalledWith(
				"window가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.",
			);

			consoleSpy.mockRestore();
		});
	});

	describe("getUserAgent", () => {
		it("사용자 에이전트 정보를 분석해야 한다", () => {
			const result = getUserAgent();

			expect(result).toEqual({
				userAgent: expect.stringContaining("Chrome"),
				isMobile: false,
				isTablet: false,
				isDesktop: true,
				browser: "Chrome",
				os: "macOS",
			});
		});

		it("모바일 사용자 에이전트를 인식해야 한다", () => {
			global.navigator = {
				userAgent:
					"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15",
			} as any;

			const result = getUserAgent();

			expect(result?.isMobile).toBe(true);
			expect(result?.isDesktop).toBe(false);
		});

		it("navigator가 없으면 null을 반환해야 한다", () => {
			delete (global as any).navigator;
			const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

			const result = getUserAgent();

			expect(result).toBeNull();
			expect(consoleSpy).toHaveBeenCalledWith(
				"navigator가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.",
			);

			consoleSpy.mockRestore();
		});
	});
});
