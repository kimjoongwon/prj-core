import { gql } from '@__generated__';

export const GET_SPACE_FORM = gql(`
  query GetSpaceForm($id: String!) {
    spaceForm(id: $id) {
      name
    }
  }
`);