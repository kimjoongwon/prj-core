// NODE_ENV를 기반으로 한 통합 Orval 설정 파일
// 환경별로 다른 API URL을 사용하되, 나머지 설정은 동일하게 유지

const http = require("http");

const environments = {
  development: "http://localhost:3006/api-json", // development 별칭
  staging: "https://stg.cocdev.co.kr/api-json", // staging 별칭
  production: "https://cocdev.co.kr/api-json", // production 별칭
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
 * 사용할 API URL 결정
 * - localhost가 실행 중이면 localhost 사용
 * - 아니면 staging 서버 사용
 */
async function getApiUrl() {
  const env = process.env.NODE_ENV || "development";

  // production 환경은 항상 production URL 사용
  if (env === "production") {
    return environments.production;
  }

  // development 환경에서 localhost 체크
  const localhostUrl = environments.development;
  const isLocalRunning = await isServerRunning(localhostUrl);

  if (isLocalRunning) {
    console.log(`✅ localhost:3006 서버가 실행 중입니다.`);
    return localhostUrl;
  }

  console.log(`⚠️  localhost:3006 서버가 실행되지 않았습니다.`);
  console.log(`🔄 Fallback: staging 서버를 사용합니다.`);
  return environments.staging;
}

// 비동기 설정 래퍼
async function createConfig() {
  const apiUrl = await getApiUrl();

  console.log(`🚀 Orval 설정 로드됨 - API URL: ${apiUrl}`);

  return {
    store: {
      // OpenAPI 태그별로 파일 분할하여 생성
      mode: "tags-split",

      // 환경에 따른 OpenAPI 스펙 URL
      input: {
        target: apiUrl,
        validation: false, // Swagger 스키마 검증 비활성화
      },

      output: {
        // 생성된 API 클라이언트 코드의 출력 위치
        target: "src/apis.ts",

        // 타입 스키마 모델들의 출력 디렉토리
        schemas: "src/model",

        // React Query를 사용한 클라이언트 생성
        client: "react-query",

        override: {
          // 커스텀 Axios 인스턴스 사용 설정
          mutator: {
            // 커스텀 Axios 설정 파일 경로
            path: "./src/libs/customAxios.ts",
            // 사용할 Axios 인스턴스 함수명
            name: "customInstance",
          },

          // React Query 훅 생성 옵션
          query: {
            // 기본 useQuery 훅 생성 활성화
            useQuery: true,

            // 무한 스크롤용 useInfiniteQuery 비활성화
            useInfinite: false,

            // Suspense 지원 useQuery 훅 생성 활성화
            useSuspenseQuery: true,

            // Suspense 지원 무한 쿼리 훅 생성 활성화
            useSuspenseInfiniteQuery: true,

            // 서버 컴포넌트용 prefetch 함수 생성 활성화
            usePrefetch: true,
          },
        },
      },
    },
  };
}

// orval은 Promise를 반환하는 설정 함수를 지원합니다
module.exports = createConfig();
