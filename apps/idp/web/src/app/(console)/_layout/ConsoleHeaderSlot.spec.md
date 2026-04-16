# ConsoleHeaderSlot ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: apps/idp/web/src/app/(console)/_layout/ConsoleHeaderSlot.tsx

## 역할

IDP 콘솔 헤더에서 현재 섹션, Space selector, 현재 tenant role 상태를 함께 노출합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| ConsoleHeaderSlot | 공개 계약 요소 |

## 규칙

- `verify-token.hasFullAccess`를 읽어 헤더 `userInfo.role`을 `FULL_ACCESS` 또는 `SPACE_SCOPED`로 표시합니다.
- `HeaderSpaceSelector`는 `useSetCurrentSpace()`를 호출해 Space를 바꾸고, 성공 시 PersistStore를 갱신한 뒤 새로고침합니다.
- 로그아웃 시 `persistStore.clearSpace()`를 먼저 호출해 이전 선택 Space를 남기지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | IDP 헤더에 current-space selector와 current tenant FULL_ACCESS 상태 표시를 추가 | codex |
| 2026-03-26 | 누락된 sidecar spec 신규 생성 | codex |
