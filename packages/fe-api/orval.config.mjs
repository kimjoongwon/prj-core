// NODE_ENV를 기반으로 한 통합 Orval 설정 파일
// 환경별로 다른 API URL을 사용하되, 나머지 설정은 동일하게 유지

import * as http from "node:http";

const apiSpecEnvironments = {
	development: "http://localhost:3006/api-json",
	local: "http://localhost:3006/api-json",
	stg: "https://stg.onjitda.com/api-json",
	staging: "https://stg.onjitda.com/api-json",
	prod: "https://onjitda.com/api-json",
	production: "https://onjitda.com/api-json",
};

// 발급자(idp-api) 스펙 — 인증(auth)·OIDC 클라이언트/세션·IDP 관리 태그의 원천.
const idpApiSpecEnvironments = {
	development: "http://localhost:3007/api-json",
	local: "http://localhost:3007/api-json",
	stg: "https://stg.onjitda.com/api-json",
	staging: "https://stg.onjitda.com/api-json",
	prod: "https://idp.onjitda.com/api-json",
	production: "https://idp.onjitda.com/api-json",
};

/**
 * localhost 서버가 실행 중인지 확인
 * @param {string} url - 체크할 URL
 * @param {number} timeout - 타임아웃 (ms)
 * @returns {Promise<boolean>}
 */
async function isServerRunning(url, timeout = 2000) {
	return new Promise((resolve) => {
		const urlObj = new URL(url);
		const options = {
			hostname: urlObj.hostname,
			port: urlObj.port,
			path: urlObj.pathname,
			method: "HEAD",
			timeout: timeout,
		};

		const req = http.request(options, (res) => {
			resolve(res.statusCode >= 200 && res.statusCode < 500);
		});

		req.on("error", () => resolve(false));
		req.on("timeout", () => {
			req.destroy();
			resolve(false);
		});

		req.end();
	});
}

/**
 * 환경 맵에서 API URL을 결정
 * - 명시적 환경 지정 시 해당 URL 사용
 * - localhost가 실행 중이면 localhost 사용
 * - 아니면 staging 서버로 fallback
 *
 * @param {Record<string, string>} envMap - 환경별 URL 매핑
 * @param {string} label - 로깅용 라벨 (예: "Server", "IDP")
 */
async function resolveApiUrl(envMap, label, explicitUrlEnvName = "CORE_API_INTERNAL_URL") {
	const orvalEnv = process.env.ORVAL_ENV;
	const explicitUrl = process.env[explicitUrlEnvName];

	// 명시적 환경 지정 시 바로 해당 URL 사용
	if (orvalEnv) {
		const url = envMap[orvalEnv];
		if (!url) {
			throw new Error(`알 수 없는 ORVAL_ENV: ${orvalEnv} (local|stg|prod)`);
		}
		console.log(`🎯 [${label}] ORVAL_ENV=${orvalEnv} → ${url}`);
		return url;
	}

	if (explicitUrl) {
		const apiJsonUrl = `${explicitUrl.replace(/\/$/, "")}/api-json`;
		console.log(`🎯 [${label}] runtime env → ${apiJsonUrl}`);
		return apiJsonUrl;
	}

	// ORVAL_ENV 미지정: localhost 자동 감지
	const localhostUrl = envMap.development;
	const isLocalRunning = await isServerRunning(localhostUrl);

	if (isLocalRunning) {
		console.log(
			`✅ [${label}] ${new URL(localhostUrl).host} 서버가 실행 중입니다.`,
		);
		return localhostUrl;
	}

	console.log(
		`⚠️  [${label}] ${new URL(localhostUrl).host} 서버가 실행되지 않았습니다.`,
	);
	console.log(`🔄 [${label}] Fallback: staging 서버를 사용합니다.`);
	return envMap.staging;
}

/** Swagger spec URL 결정 */
async function getApiUrl() {
	return resolveApiUrl(apiSpecEnvironments, "Swagger");
}

/** IDP(발급자) Swagger spec URL 결정 */
async function getIdpApiUrl() {
	return resolveApiUrl(idpApiSpecEnvironments, "IDP", "IDP_API_INTERNAL_URL");
}

/** 공통 React Query 훅 생성 옵션 */
const queryOptions = {
	// useQuery는 명시하지 않아 GET만 Query, 나머지 HTTP verb는 Mutation으로 생성
	// Orval 8에서는 useQuery: true를 전역 지정하면 POST/PUT/PATCH/DELETE도 Query가 됩니다.

	// 무한 스크롤용 useInfiniteQuery 비활성화
	useInfinite: false,

	// page-level 기본 패턴은 아니지만 예외 route/국소 boundary에서 사용할 suspense 훅도 함께 생성
	useSuspenseQuery: true,

	// 무한 스크롤은 현재 기본 패턴이 아니지만 예외 surface 호환을 위해 생성 허용
	useSuspenseInfiniteQuery: true,

	// SSR 예외 페이지를 위해 prefetch 함수는 유지
	usePrefetch: true,

	// queryFn의 AbortSignal을 요청 options에 실어 보낸다(fetch 생성기 방식).
	// 미지정 시 취소 signal이 mutator까지 전달되지 않는다.
	signal: true,
};

// 비동기 설정 래퍼
async function createConfig() {
	const apiUrl = await getApiUrl();
	const idpApiUrl = await getIdpApiUrl();

	console.log(`🚀 Orval 설정 로드됨`);
	console.log(`   Swagger Spec: ${apiUrl}`);
	console.log(`   IDP Spec: ${idpApiUrl}`);

	return {
		// ─── 통합 API client from unified Swagger spec ───
		store: {
			// 환경에 따른 OpenAPI 스펙 URL
			input: {
				target: apiUrl,
				override: {
					transformer: "./remove-tenant-header.transformer.cjs",
				},
			},

			output: {
				// 생성된 API 클라이언트 코드의 출력 위치
				target: "src/core/index.ts",

				// 타입 스키마 모델들의 출력 디렉토리
				schemas: "src/core/model",

				// React Query를 사용한 클라이언트 생성
				client: "react-query",
				// 네이티브 fetch 기반 생성기 — 응답은 data만 반환한다.
				httpClient: "fetch",

				// OpenAPI 태그별로 파일 분할하여 직접 생성
				// 후처리 스크립트 없이 생성 결과를 그대로 사용합니다.
				mode: "tags-split",

				override: {
					// customFetch가 복원하는 실제 클라이언트 값과 타입을 맞춥니다.
					useBigInt: true,
					useDates: true,
					// 커스텀 fetch 클라이언트 사용 설정
					mutator: {
						// 커스텀 fetch 클라이언트 파일 경로
						path: "./src/libs/customFetch.ts",
						// 사용할 fetch 함수명
						name: "customFetch",
					},
					fetch: {
						// 응답을 {data, status, headers} 래퍼가 아니라 본문만 반환한다.
						includeHttpResponseReturnType: false,
					},

					// React Query 훅 생성 옵션
					query: queryOptions,
				},
			},
			hooks: {
				afterAllFilesWrite: {
					command:
						"node ./scripts/serialize-fetch-bodies.mjs && node ./scripts/merge-runtime-manifest.mjs && pnpm exec biome check --write src/core src/libs/runtimeManifest.ts",
					injectGeneratedDirsAndFiles: false,
				},
			},
		},

		// ─── 발급자(idp-api) client — 인증·OIDC·IDP 관리 태그 ───
		// core-api가 발급자를 내려놓았으므로 auth/oidc-clients/oidc-sessions/
		// interaction/idp-*/security-policy/email-verifications 태그는 여기서
		// 생성한다. fetch 클라이언트는 core와 같은 customFetch — 경로는 전부 앱
		// origin 상대경로로 각 앱의 프록시(rewrite/ingress)가 발급자로 보낸다.
		idp: {
			input: {
				target: idpApiUrl,
				override: {
					transformer: "./remove-tenant-header.transformer.cjs",
				},
			},

			output: {
				target: "src/idp/index.ts",
				schemas: "src/idp/model",
				client: "react-query",
				httpClient: "fetch",
				mode: "tags-split",
				override: {
					useBigInt: true,
					useDates: true,
					mutator: {
						path: "./src/libs/customFetch.ts",
						name: "customFetch",
					},
					fetch: {
						includeHttpResponseReturnType: false,
					},
					query: queryOptions,
				},
			},
			hooks: {
				afterAllFilesWrite: {
					command:
						"node ./scripts/merge-runtime-manifest.mjs && pnpm exec biome check --write src/idp src/libs/runtimeManifest.ts",
					injectGeneratedDirsAndFiles: false,
				},
			},
		},
	};
}

// orval은 Promise를 반환하는 설정 함수를 지원합니다
export default createConfig();
