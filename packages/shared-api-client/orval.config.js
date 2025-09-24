// NODE_ENV를 기반으로 한 통합 Orval 설정 파일
// 환경별로 다른 API URL을 사용하되, 나머지 설정은 동일하게 유지

const environments = {
  development: "http://localhost:3006/api-json", // development 별칭
  staging: "https://stg.cocdev.co.kr/api-json", // staging 별칭
  production: "https://cocdev.co.kr/api-json", // production 별칭
};

// 환경 변수에서 환경을 결정 (기본값: development)
const env = process.env.NODE_ENV || "development";

// 선택된 환경의 API URL 가져오기
const apiUrl = environments[env];

// 환경이 정의되지 않은 경우 에러 처리
if (!apiUrl) {
  console.error(`❌ 지원되지 않는 환경입니다: ${env}`);
  console.error(`✅ 지원 가능한 환경: ${Object.keys(environments).join(", ")}`);
  process.exit(1);
}

console.log(`🚀 Orval 설정 로드됨 - 환경: ${env}, API URL: ${apiUrl}`);

module.exports = {
  store: {
    // OpenAPI 태그별로 파일 분할하여 생성
    mode: "tags-split",

    // 환경에 따른 OpenAPI 스펙 URL
    input: apiUrl,

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
        },
      },
    },
  },
};
