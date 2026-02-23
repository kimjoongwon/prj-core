# Folder Controller 기획서

> 생성일: 2026-02-23
> 타입: controller
> 위치: apps/server/src/module/assets/controllers/folder.controller.ts

## 역할

폴더(Folder) REST API 엔드포인트를 제공합니다. 요청 검증, 인증/인가, 서비스 호출을 담당합니다.

## 베이스 경로

`/api/v1/folders`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | `/` | FolderQueryDto | Folder[] + meta | 폴더 목록 조회 |
| GET | `/tree` | - | Folder[] | 폴더 트리 조회 |
| GET | `/:folderId` | - | Folder | 폴더 상세 조회 |
| POST | `/` | CreateFolderDto | Folder | 폴더 생성 |
| PATCH | `/:folderId` | UpdateFolderDto | Folder | 폴더 수정 |
| POST | `/:folderId/restore` | - | Folder | 폴더 복원 |
| POST | `/:folderId/move` | MoveFolderDto | Folder | 폴더 이동 |
| DELETE | `/:folderId` | - | 204 | 폴더 삭제 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET / | 필수 | VIEW |
| GET /tree | 필수 | VIEW |
| GET /:folderId | 필수 | VIEW |
| POST / | 필수 | MANAGE |
| PATCH /:folderId | 필수 | MANAGE |
| POST /:folderId/restore | 필수 | FULL_ACCESS |
| POST /:folderId/move | 필수 | MANAGE |
| DELETE /:folderId | 필수 | MANAGE |

## Multi-Tenancy

모든 엔드포인트는 `X-Space-ID` 헤더가 필수입니다.

- 일반 사용자: 자신의 Space 내 폴더만 접근 가능
- FULL_ACCESS 권한: 모든 Space의 폴더 접근 가능 (복원 기능은 FULL_ACCESS만 가능)

## 요청 예시

### 폴더 목록 조회

```http
GET /api/v1/folders?parentFolderId=uuid&name=이미지&skip=0&take=20
Authorization: Bearer {token}
X-Space-ID: {spaceId}
```

### 폴더 트리 조회

```http
GET /api/v1/folders/tree
Authorization: Bearer {token}
X-Space-ID: {spaceId}
```

### 폴더 생성

```http
POST /api/v1/folders
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "spaceId": "uuid",
  "parentFolderId": "uuid",
  "name": "배너 이미지",
  "sortOrder": 0
}
```

### 폴더 이동

```http
POST /api/v1/folders/uuid/move
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "targetFolderId": "uuid"
}
```

### 폴더를 루트로 이동

```http
POST /api/v1/folders/uuid/move
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "targetFolderId": null
}
```

## 응답 예시

### 폴더 목록

```json
{
  "httpStatus": 200,
  "message": "폴더 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "spaceId": "uuid",
      "parentFolderId": null,
      "name": "이미지",
      "path": "/이미지",
      "sortOrder": 0,
      "createdAt": "2024-02-23T10:00:00Z"
    }
  ],
  "meta": {
    "total": 5,
    "skip": 0,
    "take": 10,
    "totalPages": 1
  }
}
```

### 폴더 트리

```json
{
  "httpStatus": 200,
  "message": "폴더 트리 조회 성공",
  "data": [
    {
      "id": "uuid-1",
      "name": "이미지",
      "path": "/이미지",
      "sortOrder": 0,
      "children": [
        {
          "id": "uuid-2",
          "name": "배너",
          "path": "/이미지/배너",
          "sortOrder": 0,
          "children": []
        }
      ]
    }
  ]
}
```

### 폴더 상세

```json
{
  "httpStatus": 200,
  "message": "폴더 상세 조회 성공",
  "data": {
    "id": "uuid",
    "spaceId": "uuid",
    "parentFolderId": null,
    "name": "이미지",
    "path": "/이미지",
    "sortOrder": 0,
    "createdAt": "2024-02-23T10:00:00Z",
    "updatedAt": "2024-02-23T10:00:00Z"
  }
}
```

## 구현 체크리스트

- [x] folder.controller.ts
- [x] DTO 검증 (CreateFolderDto, UpdateFolderDto, MoveFolderDto)
- [x] Swagger 데코레이터 (@ApiTags, @ApiOperation, @ApiAuth, @ApiErrors, @ApiParam, @ApiBody)
- [x] ResponseEntity 래핑 (@ApiResponseEntity, @ResponseMessage)
- [x] Module 등록 (AssetsModule)
- [x] RouterModule 경로 등록 (/api/v1/folders)
- [ ] E2E 테스트 (Jest + Supertest)

## 테스트 케이스

> 구현 도구: Jest + Supertest

### 테스트 커버리지

| 엔드포인트 | Happy Path | Error Path | Edge Case | 합계 |
|-----------|:----------:|:----------:|:---------:|:----:|
| GET / | 1 | 1 | 1 | 3 |
| GET /tree | 1 | 1 | 0 | 2 |
| GET /:folderId | 1 | 2 | 0 | 3 |
| POST / | 1 | 2 | 0 | 3 |
| PATCH /:folderId | 1 | 1 | 0 | 2 |
| DELETE /:folderId | 1 | 1 | 0 | 2 |
| POST /:folderId/restore | 1 | 1 | 0 | 2 |
| POST /:folderId/move | 1 | 2 | 1 | 4 |

### [TC-001] GET / - 정상 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID 헤더 |
| **When** | GET /api/v1/folders 요청 |
| **Then** | 200, 폴더 목록 + meta 반환 |

### [TC-002] GET / - 권한 없음

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID 헤더 (다른 Space) |
| **When** | GET /api/v1/folders 요청 |
| **Then** | 403, 권한 없음 |

### [TC-003] GET /tree - 정상 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID 헤더 |
| **When** | GET /api/v1/folders/tree 요청 |
| **Then** | 200, 계층 구조의 폴더 트리 반환 |

### [TC-004] POST / - 정상 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID, 유효한 DTO |
| **When** | POST /api/v1/folders 요청 |
| **Then** | 201, 생성된 폴더 반환 |

### [TC-005] POST /:folderId/move - 정상 이동

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID, 이동할 폴더 ID, 대상 폴더 ID |
| **When** | POST /api/v1/folders/:folderId/move 요청 |
| **Then** | 200, 이동된 폴더 반환 |

### [TC-006] POST /:folderId/move - 하위 폴더로 이동 불가

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID, 자신의 하위 폴더 ID를 대상으로 지정 |
| **When** | POST /api/v1/folders/:folderId/move 요청 |
| **Then** | 400, 자신의 하위 폴더로 이동할 수 없음 |

### [TC-007] POST /:folderId/restore - 복원 성공

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | FULL_ACCESS 권한, 삭제된 폴더 ID |
| **When** | POST /api/v1/folders/:folderId/restore 요청 |
| **Then** | 200, 복원된 폴더 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `apps/server/src/module/assets/services/folder.service.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | be-controller-builder |
