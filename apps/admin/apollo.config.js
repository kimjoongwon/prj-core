module.exports = {
  client: {
    tagName: 'gql',
    includes: ["./src/app/**/*.ts"],
    excludes: ["**/__tests__/**"],
    service: {
      name: 'CoC',
      url: 'http://localhost:3006/graphql',
    },
  },
}
