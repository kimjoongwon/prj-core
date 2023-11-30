import { gql } from '@__generated__';

export const CREATE_TIMELINE = gql(`
  mutation CreateTimeline($createTimelineInput: CreateTimelineInput!) {
    createTimeline(createTimelineInput: $createTimelineInput) {
      date
    }
  }
`);
