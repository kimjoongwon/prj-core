import { gql } from '@__generated__';

export const GET_WORKSPACES = gql(`
  query GetWorkspace($take: Int, $skip: Int) {
    workspaces(take: $take, skip: $skip) {
      nodes {
        name
        owner {
          email
        }
      }
      pageInfo {
        totalCount
      }
    }
  }
`);
