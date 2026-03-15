# Assets Controller 기획서

> 생성일: 2026-03-15
> 타입: controller
> 위치: `apps/core/api/src/module/assets/assets.controller.ts`

## 역할

Asset 목록/상세/이동/삭제 API를 노출하고 controller boundary 조합은 `AssetFacade`에 위임합니다.

## 의존성

| 주입 대상 | 타입 | 설명 |
|-----------|------|------|
| assetFacade | AssetFacade | Asset 목록/상세/이동/삭제 boundary |

## 엔드포인트

| Method | 경로 | Operation ID | 설명 |
|--------|------|-------------|------|
| GET | `/` | `getAssets` | 에셋 목록 조회 (`data + meta`) |
| GET | `/:assetId` | `getAssetById` | 에셋 상세 조회 |
| PATCH | `/:assetId/move` | `moveAsset` | 에셋 폴더 이동 |
| DELETE | `/:assetId` | `removeAsset` | 에셋 삭제 |

## 비즈니스 메모

- 목록 메타 계산은 `AssetFacade`가 담당합니다.
- 조회는 `VIEW` 이상, 변경은 `MANAGE` 이상 권한을 요구합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | admin assets 경로 404 복구를 위한 AssetsController 신규 추가 | codex |
