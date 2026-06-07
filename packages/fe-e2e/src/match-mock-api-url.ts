import type { MockApiMatcher } from "./mock-api-matcher";

function escapeRegExp(value: string) {
	return value.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
}

function matchGlob(pattern: string, href: string) {
	const source = pattern.split("*").map(escapeRegExp).join(".*");

	return new RegExp(`^${source}$`).test(href);
}

export function matchMockApiUrl(matcher: MockApiMatcher, url: URL): boolean {
	if (typeof matcher === "function") {
		return matcher(url);
	}

	if (matcher instanceof RegExp) {
		return matcher.test(url.href);
	}

	if (matcher.includes("*")) {
		return matchGlob(matcher, url.href);
	}

	if (matcher.startsWith("http://") || matcher.startsWith("https://")) {
		return url.href === matcher;
	}

	if (matcher.startsWith("/")) {
		return url.pathname === matcher || `${url.pathname}${url.search}` === matcher;
	}

	return url.href.endsWith(matcher) || url.pathname.endsWith(matcher);
}
