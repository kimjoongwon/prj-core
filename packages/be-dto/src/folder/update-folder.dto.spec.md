# UpdateFolderDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/folder/update-folder.dto.ts

## 역할

기존 폴더의 이름을 변경하거나 상위 폴더를 변경할 때 사용하는 DTO입니다. 모든 필드가 선택사항입니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| name | string | optional, max 100자 | - | 폴더명 |
| parentFolderId | string | optional, UUID | - | 상위 폴더 ID (null이면 루트로 이동) |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| name | 문자열 길이 1-100 | "폴더명은 1~100자 사이여야 합니다" |
| name | 특수문자 제한 (/, \, :, *, ?, ", <, >, \|) | "폴더명에 특수문자를 사용할 수 없습니다" |
| parentFolderId | UUID 형식 | "상위 폴더 ID가 올바르지 않습니다" |

## 비즈니스 규칙

- 순환 참조 금지: 자기 자신 또는 자신의 하위 폴더를 상위 폴더로 설정 불가
- 같은 상위 폴더 내에서 이름 중복 불가
- parentFolderId 변경 시 path도 함께 갱신 필요

## 사용 예시

### 요청 - 이름 변경
```json
{
  "name": "새 폴더명"
}
```

### 요청 - 상위 폴더 변경
```json
{
  "parentFolderId": "550e8400-e29b-41d4-a716-446655440002"
}
```

### 요청 - 루트로 이동
```json
{
  "parentFolderId": null
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| DTO | CreateFolderDto | PartialType 확장 |

## 구현 체크리스트

- [ ] update-folder.dto.ts
- [ ] PartialType(CreateFolderDto) 확장
- [ ] Swagger @ApiPropertyOptional 데코레이터
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/folder.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
