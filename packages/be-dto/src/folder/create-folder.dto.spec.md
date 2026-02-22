# CreateFolderDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/folder/create-folder.dto.ts

## 역할

새로운 폴더를 생성할 때 사용하는 DTO입니다. 계층적 구조를 위해 상위 폴더 ID를 선택적으로 받습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| parentFolderId | string | optional, UUID | - | 상위 폴더 ID (null이면 루트 폴더) |
| name | string | required, max 100자 | - | 폴더명 |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| parentFolderId | UUID 형식 | "상위 폴더 ID가 올바르지 않습니다" |
| name | 필수 값 | "폴더명을 입력해주세요" |
| name | 문자열 길이 1-100 | "폴더명은 1~100자 사이여야 합니다" |
| name | 특수문자 제한 (/, \, :, *, ?, ", <, >, \|) | "폴더명에 특수문자를 사용할 수 없습니다" |

## 변환 로직

### toEntity (생성 시)
```typescript
// DTO → Entity 변환
const folder = new Folder();
folder.parentFolderId = dto.parentFolderId ?? null;
folder.name = dto.name;
folder.path = parentFolder
  ? `${parentFolder.path}/${dto.name}`
  : `/${dto.name}`;
folder.sortOrder = 0; // Service에서 다음 순서 계산
return folder;
```

## 사용 예시

### 요청 - 루트 폴더 생성
```json
{
  "name": "이미지"
}
```

### 요청 - 하위 폴더 생성
```json
{
  "parentFolderId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "배너"
}
```

### 응답
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "spaceId": "550e8400-e29b-41d4-a716-446655440099",
  "parentFolderId": "550e8400-e29b-41d4-a716-446655440000",
  "name": "배너",
  "path": "/이미지/배너",
  "sortOrder": 0,
  "createdAt": "2026-02-22T10:00:00Z",
  "updatedAt": "2026-02-22T10:00:00Z"
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Entity | Folder | Entity 변환 |

## 구현 체크리스트

- [ ] create-folder.dto.ts
- [ ] class-validator 데코레이터 (@IsString, @IsUUID, @MaxLength)
- [ ] class-transformer 데코레이터 (@Type)
- [ ] Swagger @ApiProperty 데코레이터
- [ ] toEntity() 메서드 구현
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/folder.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
