# BatchDeleteAssetsDto DTO 기획서

> 생성일: 2026-02-26
> 타입: dto
> 위치: packages/be-dto/src/asset/batch-delete-assets.dto.ts

## 역할

에셋을 일괄 소프트 삭제할 때 사용하는 요청 DTO입니다.

## 필드

| 필드 | 타입 | 제약조건 | 설명 |
|------|------|----------|------|
| assetIds | string[] | required, UUID 배열 | 삭제할 에셋 ID 목록 |

## 구현 체크리스트

- [x] batch-delete-assets.dto.ts
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | be-dto-builder |
