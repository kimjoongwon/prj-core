import { gql } from '@__generated__';

export const UPDATE_TIMELINE = gql(`
  mutation UpdateTimeline($updateTimelineInput: UpdateTimelineInput!) {
    updateTimeline(updateTimelineInput: $updateTimelineInput) {
      id
    }
  }
`);
