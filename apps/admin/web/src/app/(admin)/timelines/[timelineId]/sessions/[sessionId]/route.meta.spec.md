# sessions:detail route meta 기획서

> 생성일: 2026-04-07
> 타입: route-meta
> 위치: apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/route.meta.ts

## 역할

세션 상세 페이지의 page access meta를 선언합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| page | sessions:detail page access catalog |

## 규칙

- `page.order` 는 generated page access catalog 정렬 기준입니다.
- 이 route는 메뉴에 직접 노출되지 않으므로 `navItem` 없이 page access만 선언합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | sessions:detail route meta 전면 이행 | codex |
