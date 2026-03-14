# tasks.controller 기획서

> 생성일: 2026-03-11
> 타입: controller
> 위치: apps/core/api/src/module/tasks/tasks.controller.ts

## 역할

Task aggregate root API를 노출합니다. Exercise detail은 `/tasks/:taskId/exercise` nested route로 처리합니다.

## 공개 경로 메모

- 유지: `GET /`, `GET /:taskId/exercise`, `GET /:taskId/routines`, `POST /`, `PATCH /:taskId/exercise`, `DELETE /:taskId`
- 제거: frontend 런타임 미사용 `GET /:taskId`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-11 | Task root controller 신규 생성 | codex |
| 2026-03-12 | TasksController에서 서비스 메서드 이름 정합성 정리 (`findTasks`로 통일) 및 API 컨트랙트 정합성 반영 | codex |
| 2026-03-12 | Task 목록 응답 메타 조립을 TaskFacade로 이관 | codex |
| 2026-03-13 | controller boundary 조합을 `TaskFacade`로 이관 | codex |
| 2026-03-13 | admin/idp/web 및 fe-ui 런타임 미사용 `getTaskById` endpoint를 제거 | codex |
