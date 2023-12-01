import { gql } from '@__generated__';

export const UPDATE_TIMELINEITEM = gql(`
  mutation UpdateTimelineItem($updateTimelineItemInput: UpdateTimelineItemInput!) {
    updateTimelineItem(updateTimelineItemInput: $updateTimelineItemInput) {
      id
    }
  }
`);
