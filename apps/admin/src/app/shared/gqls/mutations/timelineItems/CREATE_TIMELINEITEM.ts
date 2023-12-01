import { gql } from '@__generated__';

export const CREATE_TIMELINEITEM = gql(`
  mutation CreateTimelineItem($createTimelineItemInput: CreateTimelineItemInput!) {
    createTimelineItem(createTimelineItemInput: $createTimelineItemInput) {
      description
      title
    }
  }
`);
