# fe-api Root Index 기획서

> 위치: `packages/fe-api/src/index.ts`

## 역할

- 루트 `@cocrepo/api` 공개 surface를 최소화합니다.
- heavy hook/model barrel 재수출을 금지하고 client helper만 노출합니다.

## 공개 계약

- `@cocrepo/api`는 `core/client`, `idp/client`의 helper만 재수출합니다.
- runtime API 훅과 모델 타입은 subpath import로만 사용합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | 루트 barrel의 API/model 재수출을 제거하고 client helper만 남김 | codex |
