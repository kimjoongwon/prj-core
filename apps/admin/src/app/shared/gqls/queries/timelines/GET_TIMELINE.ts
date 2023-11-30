import { gql } from '@__generated__';

export const GET_TIMELINE = gql(`
  query GetTimeline($id: String!){
    timeline(id: $id) {
      date
    }
  }
`);
