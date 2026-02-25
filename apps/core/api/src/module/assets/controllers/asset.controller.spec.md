# Asset Controller 기획서

> 생성일: 2026-02-22
> 타입: controller
> 위치: apps/server/src/module/assets/controllers/asset.controller.ts

## 역할

에셋(Asset) REST API 엔드포인트를 제공합니다. 요청 검증, 인증/인가, 서비스 호출을 담당합니다.

## 베이스 경로

`/api/v1/assets`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | `/` | AssetQueryDto | Asset[] | 에셋 목록 조회 |
| GET | `/:assetId` | - | Asset | 에셋 상세 조회 |
| POST | `/` | CreateAssetDto | Asset | 에셋 생성 |
| PATCH | `/:assetId` | UpdateAssetDto | Asset | 에셋 수정 |
| PATCH | `/:assetId/move` | MoveAssetDto | Asset | 폴더 이동 |
| DELETE | `/:assetId` | - | 204 | 에셋 삭제 |
| POST | `/batch-delete` | BatchDeleteDto | 204 | 일괄 삭제 |
| GET | `/:assetId/derivatives` | - | Derivative[] | 파생 리소스 목록 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET / | 필수 | VIEW |
| GET /:assetId | 필수 | VIEW |
| POST / | 필수 | MANAGE |
| PATCH /:assetId | 필수 | MANAGE |
| PATCH /:assetId/move | 필수 | MANAGE |
| DELETE /:assetId | 필수 | MANAGE |
| POST /batch-delete | 필수 | MANAGE |
| GET /:assetId/derivatives | 필수 | VIEW |

## 요청 예시

### 에셋 목록 조회

```http
GET /api/v1/assets?folderId=uuid&kind=IMAGE&search=logo&skip=0&take=20
Authorization: Bearer {token}
X-Space-ID: {spaceId}
```

### 에셋 생성

```http
POST /api/v1/assets
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "folderId": "uuid",
  "kind": "IMAGE",
  "originalName": "logo.png",
  "storageKey": "uploads/2024/logo.png",
  "mimeType": "image/png",
  "extension": "png",
  "sizeBytes": 245678,
  "checksum": "sha256:abc123..."
}
```

### 폴더 이동

```http
PATCH /api/v1/assets/uuid/move
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "targetFolderId": "uuid"
}
```

### 일괄 삭제

```http
POST /api/v1/assets/batch-delete
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "assetIds": ["uuid1", "uuid2", "uuid3"]
}
```

## 응답 예시

### 에셋 목록

```json
{
  "httpStatus": 200,
  "message": "에셋 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "folderId": "uuid",
      "kind": "IMAGE",
      "status": "READY",
      "originalName": "logo.png",
      "mimeType": "image/png",
      "sizeBytes": 245678,
      "createdAt": "2024-02-22T10:00:00Z"
    }
  ],
  "meta": {
    "total": 125,
    "skip": 0,
    "take": 20
  }
}
```

### 에셋 상세

```json
{
  "httpStatus": 200,
  "message": "에셋 상세 조회 성공",
  "data": {
    "id": "uuid",
    "folderId": "uuid",
    "kind": "IMAGE",
    "status": "READY",
    "originalName": "logo.png",
    "mimeType": "image/png",
    "sizeBytes": 245678,
    "image": {
      "width": 1920,
      "height": 1080,
      "colorSpace": "sRGB"
    },
    "createdAt": "2024-02-22T10:00:00Z"
  }
}
```

## 구현 체크리스트

- [ ] asset.controller.ts
- [ ] DTO 검증
- [ ] Swagger 데코레이터
- [ ] E2E 테스트 (Jest + Supertest)

## 테스트 케이스

> 구현 도구: Jest + Supertest

### 테스트 커버리지

| 엔드포인트 | Happy Path | Error Path | Edge Case | 합계 |
|-----------|:----------:|:----------:|:---------:|:----:|
| GET / | 1 | 1 | 1 | 3 |
| GET /:assetId | 1 | 2 | 0 | 3 |
| POST / | 1 | 2 | 0 | 3 |
| PATCH /:assetId | 1 | 1 | 0 | 2 |
| DELETE /:assetId | 1 | 1 | 0 | 2 |
| POST /batch-delete | 1 | 1 | 1 | 3 |

### [TC-001] GET / - 정상 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID 헤더 |
| **When** | GET /api/v1/assets 요청 |
| **Then** | 200, 에셋 목록 반환 |

### [TC-002] GET / - 권한 없음

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID 헤더 (다른 Space) |
| **When** | GET /api/v1/assets 요청 |
| **Then** | 403, 권한 없음 |

### [TC-003] POST / - 정상 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID, 유효한 DTO |
| **When** | POST /api/v1/assets 요청 |
| **Then** | 201, 생성된 에셋 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `apps/server/src/module/assets/asset.service.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
