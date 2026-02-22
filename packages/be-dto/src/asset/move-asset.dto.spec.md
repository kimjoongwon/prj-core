# MoveAssetDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/asset/move-asset.dto.ts

## 역할

에셋을 다른 폴더로 이동할 때 사용하는 DTO입니다. 단일 에셋 이동 전용 DTO로, 일괄 이동은 별도 API를 사용합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| targetFolderId | string | required, UUID | - | 이동할 대상 폴더 ID |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| targetFolderId | 필수 값 | "대상 폴더를 선택해주세요" |
| targetFolderId | UUID 형식 | "폴더 ID가 올바르지 않습니다" |

## 비즈니스 규칙

- 대상 폴더가 현재 폴더와 같으면 아무 작업 없음
- 대상 폴더가 존재하는지 확인 필요
- 같은 Space 내의 폴더로만 이동 가능

## 사용 예시

### 요청
```json
{
  "targetFolderId": "550e8400-e29b-41d4-a716-446655440002"
}
```

### 응답
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "folderId": "550e8400-e29b-41d4-a716-446655440002",
  "kind": "IMAGE",
  "status": "READY",
  "originalName": "banner-image.jpg",
  "mimeType": "image/jpeg",
  "extension": "jpg",
  "sizeBytes": 2456789,
  "createdAt": "2026-02-22T10:00:00Z",
  "updatedAt": "2026-02-22T11:00:00Z"
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| DTO | AssetResponseDto | 응답 타입 |

## 구현 체크리스트

- [ ] move-asset.dto.ts
- [ ] class-validator 데코레이터 (@IsUUID, @IsNotEmpty)
- [ ] Swagger @ApiProperty 데코레이터
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
