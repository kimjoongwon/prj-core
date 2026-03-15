# Asset Service 기획서

> 생성일: 2026-03-15
> 타입: service
> 위치: packages/be-service/src/asset.service/index.ts

## 역할

현재 선택된 Space 범위 안에서 에셋 목록/상세/이동/삭제를 처리합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `AssetsRepository` | 에셋 조회/이동/삭제 |
| `FoldersRepository` | 대상 폴더 검증 |
| `SpaceContext` | 현재 요청 Space 식별 |

## 메서드

| 메서드 | 설명 |
|--------|------|
| `getAssets` | 현재 Space의 에셋 목록과 totalCount 반환 |
| `getAssetById` | 현재 Space 소유 에셋 상세 조회 |
| `moveAsset` | 현재 Space 내부 폴더 이동 |
| `deleteAsset` | 현재 Space 소유 에셋 삭제 |

## 비즈니스 규칙

- `X-Space-ID`가 없으면 요청을 거부합니다.
- 목록/상세는 현재 선택된 Space의 활성 에셋만 노출합니다.
- 폴더 이동은 현재 Space 안의 활성 폴더로만 허용합니다.
- 동일 폴더 재이동 요청은 `400`으로 거부합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | admin assets 목록/상세 복구를 위한 AssetService 신규 추가 | codex |
