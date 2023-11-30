import { gql } from '@__generated__';

export const DELETE_TIMELINE = gql(`
  mutation DeleteTimeline($id: String!) {
    deleteTimeline(id: $id) {
      id
    }
  }
`);
