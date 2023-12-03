import { gql } from '@__generated__';

export const GET_TIMELINE_FORM = gql(`
  query GetTimelineForm($timelineId: String!, $sessionId: String!) {
    timelineForm(timelineId: $timelineId, sessionId: $sessionId) {
      name
      sessionId
      date
      session {
        name
        dates
        tenantId
      }
      timelineItems {
        id
        title
        startDateTime
        endDateTime
        maxCapacity
        minCapacity
        address
        description
      }
    }
  }
`);
