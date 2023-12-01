import { gql } from '@__generated__';

export const GET_TIMELINE_ITEM = gql(`
  query GetTimelineItem($id: String!){
    timelineItem(id: $id) {
      id
    }
  }
`);
