# asset.service.spec 기획서

> 생성일: 2026-04-26
> 타입: test
> 위치: packages/be-service/__tests__/asset.service.spec.ts

## 역할

`AssetService`의 Space scope 조회, object storage 업로드/다운로드/삭제 흐름, 파일명 정규화 규칙을 검증합니다.

## 검증 범위

- `FULL_ACCESS` 요청은 목록 조회 시 Space 필터 없이 전체 에셋을 repository에 요청합니다.
- 일반 권한 요청은 `SpaceContext.spaceIds`로 에셋 목록 조회 범위를 제한합니다.
- 업로드는 object storage 저장 후 asset metadata를 생성합니다.
- 삭제는 object storage 삭제 성공 후 DB row를 삭제합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-26 | AssetService Space scope 목록 조회 회귀 테스트와 sidecar spec 신규 생성 | codex |
