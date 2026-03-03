# widget 배럴 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/index.ts

## 역할

`@cocrepo/ui` widget 컴포넌트의 배럴 export를 관리합니다.

## 동작

- 공용으로 노출할 widget만 선택적으로 re-export 합니다.
- layout과 이름 충돌이 나는 `Section` widget export는 제외합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | layout `Section` 이름 충돌 방지를 위해 `Section` widget 배럴 export 제거 | codex |
| 2026-03-03 | `_client.tsx` 페이지 헤더 표준화를 위해 `PageHeader` widget 배럴 export 추가 | codex |
