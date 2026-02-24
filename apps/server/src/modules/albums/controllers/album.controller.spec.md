# Album Controller 기획서

> 생성일: 2026-02-22
> 타입: controller
> 위치: apps/server/src/module/albums/controllers/album.controller.ts

## 역할

앨범(Album) REST API 엔드포인트를 제공합니다. 요청 검증, 인증/인가, 서비스 호출을 담당합니다.

## 베이스 경로

`/api/v1/albums`

## 엔드포인트

| Method | 경로 | DTO | 반환값 | 설명 |
|--------|------|-----|--------|------|
| GET | `/` | AlbumQueryDto | Album[] | 앨범 목록 조회 |
| GET | `/:albumId` | - | Album | 앨범 상세 조회 |
| POST | `/` | CreateAlbumDto | Album | 앨범 생성 |
| PATCH | `/:albumId` | UpdateAlbumDto | Album | 앨범 수정 |
| DELETE | `/:albumId` | - | 204 | 앨범 삭제 |
| GET | `/:albumId/entries` | QueryDto | AlbumEntry[] | 엔트리 목록 |
| POST | `/:albumId/entries` | AddAssetsDto | AlbumEntry[] | 에셋 추가 |
| DELETE | `/:albumId/entries/:entryId` | - | 204 | 엔트리 제거 |
| PATCH | `/:albumId/entries/reorder` | ReorderEntriesDto | 204 | 순서 변경 |
| PATCH | `/:albumId/entries/:entryId` | UpdateEntryDto | AlbumEntry | 캡션 수정 |

## 인증/인가

| 엔드포인트 | 인증 필요 | 권한 |
|------------|----------|------|
| GET / | 필수 | VIEW |
| GET /:albumId | 필수 | VIEW |
| POST / | 필수 | MANAGE |
| PATCH /:albumId | 필수 | MANAGE |
| DELETE /:albumId | 필수 | MANAGE |
| GET /:albumId/entries | 필수 | VIEW |
| POST /:albumId/entries | 필수 | MANAGE |
| DELETE /:albumId/entries/:entryId | 필수 | MANAGE |
| PATCH /:albumId/entries/reorder | 필수 | MANAGE |
| PATCH /:albumId/entries/:entryId | 필수 | MANAGE |

## 요청 예시

### 앨범 생성

```http
POST /api/v1/albums
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "name": "2024 행사 사진",
  "description": "2024년 진행된 주요 행사들의 사진 모음",
  "coverAssetId": "uuid"
}
```

### 에셋 추가

```http
POST /api/v1/albums/uuid/entries
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "assetIds": ["uuid1", "uuid2", "uuid3"]
}
```

### 순서 변경

```http
PATCH /api/v1/albums/uuid/entries/reorder
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "entryIds": ["entry3", "entry1", "entry2"]
}
```

### 캡션 수정

```http
PATCH /api/v1/albums/uuid/entries/entryId
Authorization: Bearer {token}
X-Space-ID: {spaceId}
Content-Type: application/json

{
  "caption": "오프닝 세션 기념 촬영"
}
```

## 응답 예시

### 앨범 목록

```json
{
  "httpStatus": 200,
  "message": "앨범 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "name": "2024 행사 사진",
      "description": "2024년 진행된 주요 행사들의 사진 모음",
      "coverAssetId": "uuid",
      "sortOrder": 0,
      "createdAt": "2024-02-22T10:00:00Z"
    }
  ],
  "meta": {
    "total": 6,
    "skip": 0,
    "take": 20
  }
}
```

### 엔트리 목록

```json
{
  "httpStatus": 200,
  "message": "엔트리 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "albumId": "uuid",
      "assetId": "uuid",
      "position": 0,
      "caption": "오프닝 세션",
      "asset": {
        "id": "uuid",
        "kind": "IMAGE",
        "originalName": "opening.jpg",
        "mimeType": "image/jpeg"
      }
    }
  ]
}
```

## 구현 체크리스트

- [ ] album.controller.ts
- [ ] DTO 검증
- [ ] Swagger 데코레이터
- [ ] E2E 테스트 (Jest + Supertest)

## 테스트 케이스

> 구현 도구: Jest + Supertest

### 테스트 커버리지

| 엔드포인트 | Happy Path | Error Path | Edge Case | 합계 |
|-----------|:----------:|:----------:|:---------:|:----:|
| GET / | 1 | 1 | 0 | 2 |
| POST / | 1 | 2 | 0 | 3 |
| PATCH /:albumId | 1 | 1 | 0 | 2 |
| DELETE /:albumId | 1 | 1 | 0 | 2 |
| GET /:albumId/entries | 1 | 1 | 0 | 2 |
| POST /:albumId/entries | 1 | 2 | 0 | 3 |
| DELETE /:albumId/entries/:entryId | 1 | 1 | 0 | 2 |
| PATCH /:albumId/entries/reorder | 1 | 1 | 1 | 3 |

### [TC-001] POST / - 정상 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 인증 토큰, X-Space-ID, 유효한 DTO |
| **When** | POST /api/v1/albums 요청 |
| **Then** | 201, 생성된 앨범 반환 |

### [TC-002] POST / - 중복 이름

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 같은 이름의 앨범 이미 존재 |
| **When** | POST /api/v1/albums 요청 |
| **Then** | 409, 중복 오류 |

### [TC-003] POST /:albumId/entries - 정상 추가

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 앨범 존재, 에셋들 존재 |
| **When** | POST /api/v1/albums/uuid/entries 요청 |
| **Then** | 201, 생성된 엔트리들 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `apps/server/src/module/albums/album.service.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
