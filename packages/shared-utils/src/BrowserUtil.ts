/**
 * BrowserUtil - 브라우저 관련 유틸리티 함수들
 * 쿠키 관리, 로컬 스토리지, 세션 스토리지, 네비게이션 등의 기능을 제공합니다.
 */

/**
 * 특정 URL로 이동합니다.
 * @param url 이동할 URL
 * @param replace 현재 히스토리를 대체할지 여부 (기본값: false)
 */
export function navigateTo(url: string, replace: boolean = false): void {
	if (typeof window === "undefined") {
		console.warn(
			"window가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.",
		);
		return;
	}

	if (replace) {
		window.location.replace(url);
	} else {
		window.location.href = url;
	}
}

/**
 * 페이지를 새로고침합니다.
 * @param forceReload 캐시를 무시하고 강제로 새로고침할지 여부 (기본값: false)
 */
export function reload(_forceReload: boolean = false): void {
	if (typeof window === "undefined") {
		console.warn(
			"window가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.",
		);
		return;
	}

	window.location.reload();
}

/**
 * 현재 URL의 정보를 반환합니다.
 */
export function getCurrentUrl(): {
	href: string;
	protocol: string;
	hostname: string;
	port: string;
	pathname: string;
	search: string;
	hash: string;
} | null {
	if (typeof window === "undefined") {
		console.warn(
			"window가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.",
		);
		return null;
	}

	const location = window.location;
	return {
		href: location.href,
		protocol: location.protocol,
		hostname: location.hostname,
		port: location.port,
		pathname: location.pathname,
		search: location.search,
		hash: location.hash,
	};
}

/**
 * 사용자 에이전트 정보를 분석합니다.
 */
export function getUserAgent(): {
	userAgent: string;
	isMobile: boolean;
	isTablet: boolean;
	isDesktop: boolean;
	browser: string;
	os: string;
} | null {
	if (typeof navigator === "undefined") {
		console.warn(
			"navigator가 정의되지 않았습니다. 브라우저 환경에서만 사용 가능합니다.",
		);
		return null;
	}

	const userAgent = navigator.userAgent;
	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			userAgent,
		);
	const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(
		userAgent,
	);
	const isDesktop = !isMobile && !isTablet;

	let browser = "Unknown";
	if (userAgent.indexOf("Chrome") > -1) browser = "Chrome";
	else if (userAgent.indexOf("Firefox") > -1) browser = "Firefox";
	else if (userAgent.indexOf("Safari") > -1) browser = "Safari";
	else if (userAgent.indexOf("Edge") > -1) browser = "Edge";

	let os = "Unknown";
	if (userAgent.indexOf("Windows") > -1) os = "Windows";
	else if (userAgent.indexOf("Mac") > -1) os = "macOS";
	else if (userAgent.indexOf("Linux") > -1) os = "Linux";
	else if (userAgent.indexOf("Android") > -1) os = "Android";
	else if (userAgent.indexOf("iOS") > -1) os = "iOS";

	return {
		userAgent,
		isMobile,
		isTablet,
		isDesktop,
		browser,
		os,
	};
}
