// NODE_ENV를 기반으로 한 통합 Orval 설정 파일
// 환경별로 다른 API URL을 사용하되, 나머지 설정은 동일하게 유지

const http = require("http");

const serverEnvironments = {
  development: "http://localhost:3006/api-json",
  local: "http://localhost:3006/api-json",
  stg: "https://stg.cocdev.co.kr/api-json",
  staging: "https://stg.cocdev.co.kr/api-json",
  prod: "https://cocdev.co.kr/api-json",
  production: "https://cocdev.co.kr/api-json",
};

const idpEnvironments = {
  development: "http://localhost:3007/api-json",
  local: "http://localhost:3007/api-json",
  stg: "https://stg-idp.cocdev.co.kr/api-json",
  staging: "https://stg-idp.cocdev.co.kr/api-json",
  prod: "https://idp.cocdev.co.kr/api-json",
  production: "https://idp.cocdev.co.kr/api-json",
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
async function resolveApiUrl(envMap, label) {
  const orvalEnv = process.env.ORVAL_ENV;

  // 명시적 환경 지정 시 바로 해당 URL 사용
  if (orvalEnv) {
    const url = envMap[orvalEnv];
    if (!url) {
      throw new Error(`알 수 없는 ORVAL_ENV: ${orvalEnv} (local|stg|prod)`);
    }
    console.log(`🎯 [${label}] ORVAL_ENV=${orvalEnv} → ${url}`);
    return url;
  }

  // ORVAL_ENV 미지정: localhost 자동 감지
  const localhostUrl = envMap.development;
  const isLocalRunning = await isServerRunning(localhostUrl);

  if (isLocalRunning) {
    console.log(`✅ [${label}] ${new URL(localhostUrl).host} 서버가 실행 중입니다.`);
    return localhostUrl;
  }

  console.log(`⚠️  [${label}] ${new URL(localhostUrl).host} 서버가 실행되지 않았습니다.`);
  console.log(`🔄 [${label}] Fallback: staging 서버를 사용합니다.`);
  return envMap.staging;
}

/** Server API URL 결정 */
async function getApiUrl() {
  return resolveApiUrl(serverEnvironments, "Server");
}

/** IDP API URL 결정 */
async function getIdpApiUrl() {
  return resolveApiUrl(idpEnvironments, "IDP");
}

/** 공통 React Query 훅 생성 옵션 */
const queryOptions = {
  // 기본 useQuery 훅 생성 활성화
  useQuery: true,

  // 무한 스크롤용 useInfiniteQuery 비활성화
  useInfinite: false,

  // Suspense 전용 훅은 현재 소비처가 없어 생성 비활성화
  useSuspenseQuery: false,

  // Suspense 전용 무한 쿼리 훅도 비활성화
  useSuspenseInfiniteQuery: false,

  // 서버 컴포넌트용 prefetch 함수 생성 활성화
  usePrefetch: true,
};

// 비동기 설정 래퍼
async function createConfig() {
  const [apiUrl, idpApiUrl] = await Promise.all([
    getApiUrl(),
    getIdpApiUrl(),
  ]);

  console.log(`🚀 Orval 설정 로드됨`);
  console.log(`   Server API: ${apiUrl}`);
  console.log(`   IDP API:    ${idpApiUrl}`);

  return {
    // ─── Server API (port 3006) ───
    store: {
      // 환경에 따른 OpenAPI 스펙 URL
      input: {
        target: apiUrl,
        validation: false, // Swagger 스키마 검증 비활성화
      },

      output: {
        // 생성된 API 클라이언트 코드의 출력 위치
        target: "src/core/index.ts",

        // 타입 스키마 모델들의 출력 디렉토리
        schemas: "src/core/model",

        // React Query를 사용한 클라이언트 생성
        client: "react-query",

        // OpenAPI 태그별로 파일 분할하여 직접 생성
        // 후처리 스크립트 없이 생성 결과를 그대로 사용합니다.
        mode: "tags-split",

        override: {
          // 커스텀 Axios 인스턴스 사용 설정
          mutator: {
            // 커스텀 Axios 설정 파일 경로
            path: "./src/libs/customAxios.ts",
            // 사용할 Axios 인스턴스 함수명
            name: "customInstance",
          },

          // React Query 훅 생성 옵션
          query: queryOptions,
        },
      },
    },

    // ─── IDP API (port 3007) ───
    idp: {
      input: {
        target: idpApiUrl,
        validation: false,
      },

      output: {
        target: "src/idp/index.ts",
        schemas: "src/idp/model",
        client: "react-query",
        // OpenAPI 태그별로 파일 분할하여 직접 생성
        // 후처리 스크립트 없이 생성 결과를 그대로 사용합니다.
        mode: "tags-split",

        override: {
          mutator: {
            path: "./src/libs/customIdpAxios.ts",
            name: "customIdpInstance",
          },
          query: queryOptions,
        },
      },
    },
  };
}

// orval은 Promise를 반환하는 설정 함수를 지원합니다
module.exports = createConfig();
