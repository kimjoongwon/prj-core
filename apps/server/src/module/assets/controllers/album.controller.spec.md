# Album Controller 기획서

## 개요

앨범(Album) 관리를 위한 REST API Controller입니다. 앨범의 CRUD 및 앨범 내 에셋(엔트리) 관리 기능을 제공합니다.

---

## 엔드포인트 목록

### 1. 앨범 목록 조회

| 항목 | 내용 |
|------|------|
| **Method** | GET |
| **Path** | /api/v1/albums |
| **Operation ID** | getAlbums |
| **설명** | 현재 Space 내의 앨범 목록을 조회합니다. 검색, 필터링, 페이지네이션을 지원합니다. |
| **인증** | 필수 (JWT) |
| **헤더** | X-Space-ID (필수) |

#### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| skip | number | 아니요 | 건너뛸 항목 수 (기본값: 0) |
| take | number | 아니요 | 조회할 항목 수 (기본값: 10) |
| spaceId | string (UUID) | 아니요 | 스페이스 ID 필터 |
| name | string | 아니요 | 앨범명 검색 (부분 일치) |
| statusFilter | enum | 아니요 | 상태 필터 (active, deleted) |
| sort | string[] | 아니요 | 정렬 (createdAt, name, sortOrder) |

#### Response (200 OK)

```json
{
  "httpStatus": 200,
  "message": "앨범 목록 조회 성공",
  "data": [
    {
      "id": "uuid",
      "spaceId": "uuid",
      "name": "앨범명",
      "description": "설명",
      "sortOrder": 1,
      "coverAssetId": "uuid",
      "creatorId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "skip": 0,
    "take": 10,
    "totalPages": 10
  }
}
```

---

### 2. 앨범 상세 조회

| 항목 | 내용 |
|------|------|
| **Method** | GET |
| **Path** | /api/v1/albums/:albumId |
| **Operation ID** | getAlbumById |
| **설명** | 특정 앨범의 상세 정보를 조회합니다. 앨범에 포함된 엔트리 목록을 함께 반환합니다. |
| **인증** | 필수 (JWT) |
| **헤더** | X-Space-ID (필수) |

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| albumId | string (UUID) | 예 | 앨범 ID |

#### Response (200 OK)

```json
{
  "httpStatus": 200,
  "message": "앨범 상세 조회 성공",
  "data": {
    "id": "uuid",
    "spaceId": "uuid",
    "name": "앨범명",
    "description": "설명",
    "sortOrder": 1,
    "coverAssetId": "uuid",
    "creatorId": "uuid",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "coverAsset": { ... },
    "entries": [
      {
        "id": "uuid",
        "albumId": "uuid",
        "assetId": "uuid",
        "position": 1,
        "caption": "캡션",
        "asset": { ... }
      }
    ]
  }
}
```

#### Error Response (404)

```json
{
  "httpStatus": 404,
  "message": "앨범을 찾을 수 없습니다."
}
```

---

### 3. 앨범 생성

| 항목 | 내용 |
|------|------|
| **Method** | POST |
| **Path** | /api/v1/albums |
| **Operation ID** | createAlbum |
| **설명** | 새로운 앨범을 생성합니다. |
| **인증** | 필수 (JWT) |
| **헤더** | X-Space-ID (필수) |

#### Request Body

```json
{
  "spaceId": "uuid",
  "name": "새 앨범",
  "description": "앨범 설명",
  "sortOrder": 1,
  "coverAssetId": "uuid",
  "creatorId": "uuid"
}
```

#### Response (201 Created)

```json
{
  "httpStatus": 201,
  "message": "앨범 생성 성공",
  "data": {
    "id": "uuid",
    "spaceId": "uuid",
    "name": "새 앨범",
    ...
  }
}
```

---

### 4. 앨범 수정

| 항목 | 내용 |
|------|------|
| **Method** | PATCH |
| **Path** | /api/v1/albums/:albumId |
| **Operation ID** | updateAlbum |
| **설명** | 앨범 정보를 수정합니다. 변경하려는 필드만 전송하면 됩니다. |
| **인증** | 필수 (JWT) |
| **헤더** | X-Space-ID (필수) |

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| albumId | string (UUID) | 예 | 앨범 ID |

#### Request Body

```json
{
  "name": "수정된 앨범명",
  "description": "수정된 설명",
  "sortOrder": 2,
  "coverAssetId": "uuid"
}
```

#### Response (200 OK)

```json
{
  "httpStatus": 200,
  "message": "앨범 수정 성공",
  "data": { ... }
}
```

---

### 5. 앨범 삭제

| 항목 | 내용 |
|------|------|
| **Method** | DELETE |
| **Path** | /api/v1/albums/:albumId |
| **Operation ID** | deleteAlbum |
| **설명** | 앨범을 삭제합니다 (Soft Delete). |
| **인증** | 필수 (JWT) |
| **헤더** | X-Space-ID (필수) |

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| albumId | string (UUID) | 예 | 앨범 ID |

#### Response (204 No Content)

Body 없음

---

### 6. 앨범 복원

| 항목 | 내용 |
|------|------|
| **Method** | POST |
| **Path** | /api/v1/albums/:albumId/restore |
| **Operation ID** | restoreAlbum |
| **설명** | 삭제된 앨범을 복원합니다. |
| **인증** | 필수 (JWT) |
| **헤더** | X-Space-ID (필수) |

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| albumId | string (UUID) | 예 | 앨범 ID |

#### Response (200 OK)

```json
{
  "httpStatus": 200,
  "message": "앨범 복원 성공",
  "data": { ... }
}
```

---

### 7. 앨범에 에셋 추가

| 항목 | 내용 |
|------|------|
| **Method** | POST |
| **Path** | /api/v1/albums/:albumId/entries |
| **Operation ID** | addAssetsToAlbum |
| **설명** | 앨범에 하나 이상의 에셋을 엔트리로 추가합니다. |
| **인증** | 필수 (JWT) |
| **헤더** | X-Space-ID (필수) |

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| albumId | string (UUID) | 예 | 앨범 ID |

#### Request Body

```json
{
  "assetIds": ["uuid1", "uuid2", "uuid3"]
}
```

#### Response (200 OK)

```json
{
  "httpStatus": 200,
  "message": "앨범에 에셋 추가 성공",
  "data": { ... }
}
```

---

### 8. 앨범에서 에셋 제거

| 항목 | 내용 |
|------|------|
| **Method** | DELETE |
| **Path** | /api/v1/albums/:albumId/entries/:assetId |
| **Operation ID** | removeAssetFromAlbum |
| **설명** | 앨범에서 특정 에셋을 제거합니다. |
| **인증** | 필수 (JWT) |
| **헤더** | X-Space-ID (필수) |

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| albumId | string (UUID) | 예 | 앨범 ID |
| assetId | string (UUID) | 예 | 에셋 ID |

#### Response (204 No Content)

Body 없음

---

### 9. 앨범 엔트리 순서 변경

| 항목 | 내용 |
|------|------|
| **Method** | PATCH |
| **Path** | /api/v1/albums/:albumId/entries/reorder |
| **Operation ID** | reorderAlbumEntries |
| **설명** | 앨범 내 엔트리의 표시 순서를 변경합니다. |
| **인증** | 필수 (JWT) |
| **헤더** | X-Space-ID (필수) |

#### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| albumId | string (UUID) | 예 | 앨범 ID |

#### Request Body

```json
{
  "entries": [
    { "entryId": "uuid1", "position": 1 },
    { "entryId": "uuid2", "position": 2 },
    { "entryId": "uuid3", "position": 3 }
  ]
}
```

#### Response (200 OK)

```json
{
  "httpStatus": 200,
  "message": "앨범 엔트리 순서 변경 성공",
  "data": { ... }
}
```

---

## 공통 에러 응답

| Status | Message | 설명 |
|--------|---------|------|
| 401 | 인증이 필요합니다. | JWT 토큰 없음 또는 만료 |
| 400 | Space가 선택되지 않았습니다. | X-Space-ID 헤더 없음 |
| 404 | 앨범을 찾을 수 없습니다. | 존재하지 않는 앨범 ID |
| 404 | 엔트리를 찾을 수 없습니다. | 존재하지 않는 엔트리 |
| 400 | 일부 에셋을 찾을 수 없습니다. | 잘못된 에셋 ID 포함 |
| 500 | 내부 서버 오류 | 예상치 못한 서버 에러 |

---

## 의존성

| 항목 | 설명 |
|------|------|
| AlbumService | 앨범 비즈니스 로직 처리 |
| ClsService | 요청 컨텍스트 (Space ID) 접근 |
| AlbumDto | 앨범 응답 DTO |
| AlbumDetailResponseDto | 앨범 상세 응답 DTO (entries 포함) |
| CreateAlbumDto | 앨범 생성 요청 DTO |
| UpdateAlbumDto | 앨범 수정 요청 DTO |
| AlbumQueryDto | 앨범 목록 조회 쿼리 DTO |
| AddAssetsToAlbumDto | 에셋 추가 요청 DTO |
| ReorderAlbumEntriesDto | 엔트리 순서 변경 요청 DTO |

---

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | be-controller-builder |
