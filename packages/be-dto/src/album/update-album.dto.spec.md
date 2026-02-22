# UpdateAlbumDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/album/update-album.dto.ts

## 역할

기존 앨범의 정보를 수정할 때 사용하는 DTO입니다. 모든 필드가 선택사항입니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| name | string | optional, max 100자 | - | 앨범명 |
| description | string | optional, max 500자 | - | 앨범 설명 |
| coverAssetId | string | optional, UUID | - | 커버 이미지 Asset ID |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 문자열 길이 1-100 | "앨범명은 1~100자 사이여야 합니다" |
| description | 문자열 길이 0-500 | "설명은 500자 이하여야 합니다" |
| coverAssetId | UUID 형식 | "커버 이미지 ID가 올바르지 않습니다" |

## 사용 예시

### 요청 - 이름 변경
```json
{
  "name": "수정된 앨범명"
}
```

### 요청 - 커버 변경
```json
{
  "coverAssetId": "550e8400-e29b-41d4-a716-446655440002"
}
```

### 요청 - 커버 제거
```json
{
  "coverAssetId": null
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| DTO | CreateAlbumDto | PartialType 확장 |

## 구현 체크리스트

- [ ] update-album.dto.ts
- [ ] PartialType(CreateAlbumDto) 확장
- [ ] Swagger @ApiPropertyOptional 데코레이터
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/album.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
