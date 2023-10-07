import { gql } from '@__generated__';

export const GET_WORKSPACE = gql(`#graphql
  query GetWorkspace($cuid: String!) {
    workspace(cuid: $cuid) {
      name
    }
  }
`);
