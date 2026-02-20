# runs/summary route spec

## Goal

Provide a lightweight status payload for the macOS menu bar launcher so it can render quick health and activity indicators without opening the full Studio page.

## Endpoint

- Method: `GET`
- Path: `/api/runs/summary`
- Runtime: Node.js

## Response

- `totalRuns`: total number of runs tracked by `runManager`
- `runningRuns`: number of runs currently marked as `running`
- `failedRuns`: number of runs currently marked as `failed`
- `activeSubagentCalls`: number of subagent calls that are currently running
- `updatedAt`: server timestamp in milliseconds

## Notes

- This route is intentionally flat and does not stream.
- The count for active subagent calls is derived from the latest event state per `runId:callId`.

## Change Log

| Date | Change | Author |
| --- | --- | --- |
| 2026-02-20 | Initial creation | opencode |
