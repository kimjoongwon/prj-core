# core/timelines index 기획서

> 생성일: 2026-03-29
> 타입: generated-index
> 위치: packages/fe-api/src/core/timelines/index.ts

## 역할

Timeline 도메인 Core API 훅과 타입 배럴입니다.
Program 상세/목록 화면이 `ProgramDto`, `ProgramActivityDto`를 같은 entrypoint에서 소비할 수 있도록 export를 정리합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-29 | Timeline core API 배럴에 `ProgramActivityDto` 재export를 반영하는 sidecar 신규 생성 | codex |
