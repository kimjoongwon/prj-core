module.exports = {
  store: {
    input: 'http://localhost:3005/api-json',
    output: {
      target: 'src/apis.ts',
      schemas: 'src/model',
      baseUrl: 'http://localhost:3004/api',
      client: 'react-query',
      mock: true,
    },
  },
};
