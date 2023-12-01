import { gql } from '@__generated__';

export const DELETE_TIMELINEITEM = gql(`
  mutation DeleteTimelineItem($id: String!) {
    deleteTimelineItem(id: $id) {
      id
    }
  }
`);
