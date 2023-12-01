import { gql } from '@__generated__';

export const GET_TIMELINE_ITEM_FORM = gql(`
  query GetTimelineItemForm($id: String!) {
    timelineItemForm(id: $id) {
      title
      startDateTime
      endDateTime
      maxCapacity
      minCapacity
      description
      address
      timelineId
    }
  }
`);
