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
| GET | `/` | AssetQueryDto | Asset[] + meta + stats | 에셋 목록 조회 |
| GET | `/:assetId` | - | Asset | 에셋 상세 조회 |
| POST | `/` | CreateAssetDto | Asset | 에셋 생성 |
| PATCH | `/:assetId` | UpdateAssetDto | Asset | 에셋 수정 |
| POST | `/:assetId/restore` | - | Asset | 에셋 복원 |
| POST | `/:assetId/move` | MoveAssetDto | Asset | 폴더 이동 |
| PATCH | `/:assetId/status` | UpdateAssetStatusDto | Asset | 상태 변경 |
| DELETE | `/:assetId` | - | 204 | 에셋 삭제 |
| POST | `/batch-delete` | BatchDeleteAssetsDto | 204 | 일괄 삭제 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET / | 필수 | VIEW |
| GET /:assetId | 필수 | VIEW |
| POST / | 필수 | MANAGE |
| PATCH /:assetId | 필수 | MANAGE |
| POST /:assetId/restore | 필수 | FULL_ACCESS |
| POST /:assetId/move | 필수 | MANAGE |
| PATCH /:assetId/status | 필수 | MANAGE |
| DELETE /:assetId | 필수 | MANAGE |
| POST /batch-delete | 필수 | MANAGE |

## Multi-Tenancy

모든 엔드포인트는 `X-Space-ID` 헤더가 필수입니다.

- 일반 사용자: 자신의 Space 내 에셋만 접근 가능
- FULL_ACCESS 권한: 모든 Space의 에셋 접근 가능 (복원 기능은 FULL_ACCESS만 가능)

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
  "status": "READY",
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
POST /api/v1/assets/uuid/move
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "targetFolderId": "uuid"
}
```

### 상태 변경

```http
PATCH /api/v1/assets/uuid/status
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "status": "READY"
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
    "take": 20,
    "totalPages": 7
  },
  "stats": {
    "total": 125,
    "images": 80,
    "videos": 30,
    "documents": 15,
    "totalSize": 1073741824
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
    "derivatives": [
      {
        "id": "uuid",
        "kind": "THUMBNAIL",
        "storageKey": "thumbnails/uuid_200x200.jpg",
        "width": 200,
        "height": 200
      }
    ],
    "createdAt": "2024-02-22T10:00:00Z"
  }
}
```

## 구현 체크리스트

- [x] asset.controller.ts
- [x] DTO 검증 (BatchDeleteAssetsDto, UpdateAssetStatusDto)
- [x] Swagger 데코레이터 (@ApiTags, @ApiOperation, @ApiAuth, @ApiErrors, @ApiParam, @ApiBody)
- [x] ResponseEntity 래핑 (@ApiResponseEntity, @ResponseMessage)
- [x] Module 등록 (AssetsModule)
- [x] RouterModule 경로 등록 (/api/v1/assets)
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
| POST /:assetId/restore | 1 | 1 | 0 | 2 |
| POST /:assetId/move | 1 | 1 | 0 | 2 |
| PATCH /:assetId/status | 1 | 1 | 0 | 2 |
| POST /batch-delete | 1 | 1 | 1 | 3 |

### [TC-001] GET / - 정상 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID 헤더 |
| **When** | GET /api/v1/assets 요청 |
| **Then** | 200, 에셋 목록 +meta+stats 반환 |

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

### [TC-004] POST /:assetId/restore - 복원 성공

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | FULL_ACCESS 권한, 삭제된 에셋 ID |
| **When** | POST /api/v1/assets/:assetId/restore 요청 |
| **Then** | 200, 복원된 에셋 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `apps/server/src/module/assets/services/asset.service.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
| 2026-02-23 | 엔드포인트 구현 완료 (restore, move, status, batch-delete 추가) | be-controller-builder |
