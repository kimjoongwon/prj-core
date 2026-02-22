# UpdateAssetDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/asset/update-asset.dto.ts

## 역할

기존 에셋의 메타데이터를 수정하거나 폴더를 이동할 때 사용하는 DTO입니다. 모든 필드가 선택사항입니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| originalName | string | optional, max 255자 | - | 원본 파일명 |
| folderId | string | optional, UUID | - | 이동할 폴더 ID |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| originalName | 문자열 길이 1-255 | "파일명은 1~255자 사이여야 합니다" |
| folderId | UUID 형식 | "폴더 ID가 올바르지 않습니다" |

## 변환 로직

### toEntity (수정 시)
```typescript
// DTO → Entity 부분 업데이트
if (dto.originalName !== undefined) {
  asset.originalName = dto.originalName;
}
if (dto.folderId !== undefined) {
  asset.folderId = dto.folderId;
}
return asset;
```

## 사용 예시

### 요청 - 파일명 변경
```json
{
  "originalName": "renamed-image.jpg"
}
```

### 요청 - 폴더 이동
```json
{
  "folderId": "550e8400-e29b-41d4-a716-446655440002"
}
```

### 요청 - 복합 변경
```json
{
  "originalName": "new-name.jpg",
  "folderId": "550e8400-e29b-41d4-a716-446655440002"
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| DTO | CreateAssetDto | PartialType 확장 |

## 구현 체크리스트

- [ ] update-asset.dto.ts
- [ ] PartialType(CreateAssetDto) 확장
- [ ] Swagger @ApiPropertyOptional 데코레이터
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
