module.exports = {
  store: {
    mode: 'tags-split',
    input: 'https://wallyops.com/api-json',
    output: {
      target: 'src/apis.ts',
      schemas: 'src/model',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/libs/customAxios.ts',
          name: 'customInstance',
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
