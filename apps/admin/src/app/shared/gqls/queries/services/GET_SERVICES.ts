import { gql } from '@__generated__';

export const GET_SERVICES = gql(`
  query GetServices(
    $skip: Int
    $take: Int
    $sortingKey: String
    $sortingValue: String
  ) {
    services(
      skip: $skip
      take: $take
      sortingKey: $sortingKey
      sortingValue: $sortingValue
    ) {
      nodes {
        id
        createdAt
        name
      }
    }
  }
`);
