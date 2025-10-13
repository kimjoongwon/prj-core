/**
 * 환경 정보를 나타내는 타입
 */
export interface EnvironmentInfo {
	/** 환경 이름 */
	name: string;
	/** 환경 색상 (HeroUI 컬러 스킴) */
	color: "success" | "warning" | "danger" | "primary" | "secondary" | "default";
}

/**
 * 현재 환경 정보를 반환합니다.
 *
 * @returns 환경 정보 객체
 *
 * @example
 * ```typescript
 * const env = getCurrentEnvironment();
 * console.log(env.name); // '개발', '스테이징', '운영'
 * console.log(env.color); // 'success', 'warning', 'danger'
 * ```
 */
export function getCurrentEnvironment(): EnvironmentInfo {
	const hostname = window.location.hostname;
	const port = window.location.port;

	// 로컬 개발 환경
	if (hostname === "localhost" || hostname === "127.0.0.1" || port === "5173") {
		return { name: "개발", color: "success" };
	}

	// 스테이징 환경 (예: staging.example.com)
	if (hostname.includes("staging") || hostname.includes("stg")) {
		return { name: "스테이징", color: "warning" };
	}

	// 운영 환경
	return { name: "운영", color: "danger" };
}

/**
 * 현재 환경이 개발 환경인지 확인합니다.
 *
 * @returns 개발 환경 여부
 */
export function isDevelopment(): boolean {
	const env = getCurrentEnvironment();
	return env.name === "개발";
}

/**
 * 현재 환경이 스테이징 환경인지 확인합니다.
 *
 * @returns 스테이징 환경 여부
 */
export function isStaging(): boolean {
	const env = getCurrentEnvironment();
	return env.name === "스테이징";
}

/**
 * 현재 환경이 운영 환경인지 확인합니다.
 *
 * @returns 운영 환경 여부
 */
export function isProduction(): boolean {
	const env = getCurrentEnvironment();
	return env.name === "운영";
}

/**
 * 환경별 설정값을 반환합니다.
 *
 * @param configs 환경별 설정 객체
 * @returns 현재 환경에 해당하는 설정값
 *
 * @example
 * ```typescript
 * const apiUrl = getConfigByEnvironment({
 *   개발: 'http://localhost:3000',
 *   스테이징: 'https://staging-api.example.com',
 *   운영: 'https://api.example.com'
 * });
 * ```
 */
export function getConfigByEnvironment<T>(configs: Record<string, T>): T {
	const env = getCurrentEnvironment();
	return configs[env.name] || configs.운영; // 기본값으로 운영 환경 설정 사용
}
