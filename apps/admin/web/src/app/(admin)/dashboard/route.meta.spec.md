# dashboard route meta 기획서

> 생성일: 2026-04-07
> 타입: route-meta
> 위치: apps/admin/web/src/app/(admin)/dashboard/route.meta.ts

## 역할

대시보드 페이지의 page access와 top-level menu meta를 함께 선언합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| page | dashboard page access catalog |
| navItem | top-level menu catalog |

## 규칙

- `page.order` 는 generated page access catalog 정렬 기준입니다.
- `navItem.order` 로 top-level 메뉴 순서를 고정합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | dashboard route meta 시범 도입 | codex |
| 2026-04-07 | dashboard route meta 전면 이행 | codex |
