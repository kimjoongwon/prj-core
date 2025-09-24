module.exports = {
  store: {
    mode: "tags-split",
    input: "https://stg.cocdev.co.kr/api-json",
    output: {
      target: "src/apis.ts",
      schemas: "src/model",
      baseUrl: "https://stg.cocdev.co.kr",
      client: "react-query",
      override: {
        mutator: {
          path: "./src/libs/customAxios.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useInfinite: false,
          useSuspenseQuery: true,
          useSuspenseInfiniteQuery: true,
        },
      },
    },
  },
};
