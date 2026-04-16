# scope-kind util 기획서

> 생성일: 2026-04-16
> 타입: util
> 위치: packages/common-constant/src/routing/scope-kind.ts

## 역할

admin/idp 화면 메타의 `scopeKind`를 실제 노출 가능 여부로 해석하는 공용 유틸을 제공합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| `isScopeKindAccessible` | 현재 tenant가 `FULL_ACCESS`인지 여부에 따라 `global-full-access-only` 접근 가능 여부를 계산합니다. |

## 규칙

- `space`, `tenant-user`, `undefined`는 선택된 `x-space-id`가 있다는 전제 아래 노출 가능으로 해석합니다.
- `global-full-access-only`는 현재 tenant role이 `FULL_ACCESS`일 때만 노출 가능합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | current tenant `FULL_ACCESS` 기준 화면 노출 정책 공용 유틸을 신규 추가 | codex |
