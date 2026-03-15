# Asset Facade 기획서

> 생성일: 2026-03-15
> 타입: application-service
> 위치: packages/be-facade/src/asset.facade.ts

## 역할

Asset controller 경계에서 목록 메타 계산과 업로드/이동/삭제 위임을 담당합니다.

## 의존성

| 의존성         | 역할                                 |
| -------------- | ------------------------------------ |
| `AssetService` | 에셋 목록/상세/업로드/이동/삭제 수행 |

## 공개 메서드

| 메서드         | 설명                              |
| -------------- | --------------------------------- |
| `getAssets`    | 에셋 목록과 pagination meta 반환  |
| `getAssetById` | 에셋 상세 조회                    |
| `uploadAsset`  | 에셋 업로드 요청을 Service에 위임 |
| `moveAsset`    | 에셋 폴더 이동                    |
| `deleteAsset`  | 에셋 삭제                         |

## 변경 이력

| 일자       | 내용                                                            | 작성자 |
| ---------- | --------------------------------------------------------------- | ------ |
| 2026-03-15 | assets 업로드 최소 흐름을 위해 `uploadAsset` 위임 메서드를 추가 | codex  |
| 2026-03-15 | admin assets API 경계 복구를 위한 AssetFacade 신규 추가         | codex  |
