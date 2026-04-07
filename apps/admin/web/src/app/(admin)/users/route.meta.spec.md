# users:list route meta 기획서

> 생성일: 2026-04-07
> 타입: route-meta
> 위치: apps/admin/web/src/app/(admin)/users/route.meta.ts

## 역할

회원 목록 페이지의 page access와 `users` 메뉴 group / `users-list` leaf meta를 함께 선언합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| page | users:list page access catalog |
| navItem | users group 아래 users-list menu leaf catalog |

## 규칙

- `page.order` 는 generated page access catalog 정렬 기준입니다.
- `navItem.parent.order` 와 `navItem.order` 로 sidebar group/leaf 순서를 고정합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-07 | users:list route meta 전면 이행 | codex |
