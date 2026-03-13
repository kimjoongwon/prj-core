# Core Client Helper 기획서

> 위치: `packages/fe-api/src/core/client.ts`

## 역할

- core API용 axios mutator와 설정 helper를 `@cocrepo/api/core/client`로 노출합니다.

## 공개 계약

- `customInstance`, `AXIOS_INSTANCE`, `setApiPersistStore`, `setLoginRedirectUrl`를 제공합니다.
- runtime hook/model import와 분리된 가벼운 진입점이어야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | core axios helper 전용 subpath entry 추가 | codex |
