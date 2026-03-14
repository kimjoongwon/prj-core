# spaces.controller 기획서

> 생성일: 2026-03-11
> 타입: controller
> 위치: apps/core/api/src/module/spaces/spaces.controller.ts

## 역할

Space aggregate root API를 노출합니다. Ground detail은 `/spaces/:spaceId/ground` nested route로 처리합니다.

## 공개 경로 메모

- 유지: `GET /`, `GET /:spaceId/ground`, `POST /`, `PATCH /:spaceId/ground`, `DELETE /:spaceId`
- 제거: frontend 런타임 미사용 `GET /:spaceId`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | 공간 CRUD E2E cleanup을 위해 `DELETE /:spaceId` 소프트 삭제 endpoint를 복구 | codex |
| 2026-03-14 | Biome lint organizeImports/format cleanup reflected | codex |
| 2026-03-11 | Space root controller 신규 생성 | codex |
| 2026-03-12 | 공간 목록 응답 메타 조립을 SpaceFacade로 이관 | codex |
| 2026-03-13 | controller boundary 조합을 `SpaceFacade`로 이관 | codex |
| 2026-03-13 | admin/idp/web 및 fe-ui 런타임 미사용 상세 endpoint를 제거 | codex |
