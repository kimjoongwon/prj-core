# ReorderAlbumEntriesDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/album-entry/reorder-album-entries.dto.ts

## 역할

앨범 내 에셋의 순서를 일괄 변경할 때 사용하는 DTO입니다. 드래그 앤 드롭 등으로 순서를 재배열할 때 사용합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| entryIds | string[] | required, min 1 | - | 새 순서대로 정렬된 AlbumEntry ID 목록 |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| entryIds | 필수 값 | "순서를 변경할 항목을 선택해주세요" |
| entryIds | 최소 1개 | "최소 1개의 항목이 필요합니다" |
| entryIds | 배열 내 UUID 형식 | "항목 ID가 올바르지 않습니다" |
| entryIds | 중복 불가 | "중복된 항목이 포함되어 있습니다" |

## 비즈니스 규칙

- entryIds 배열의 순서대로 position이 0부터 순차 할당됨
- 배열에 포함되지 않은 기존 항목은 position이 조정됨 (뒤로 밀림)
- 다른 앨범의 entryId가 포함되면 에러

## 변환 로직

### toPositionMap
```typescript
// entryIds → position 매핑 생성
const positionMap = new Map<string, number>();
entryIds.forEach((entryId, index) => {
  positionMap.set(entryId, index);
});
return positionMap;
```

## 사용 예시

### 요청
```json
{
  "entryIds": [
    "550e8400-e29b-41d4-a716-446655440003",
    "550e8400-e29b-41d4-a716-446655440001",
    "550e8400-e29b-41d4-a716-446655440002"
  ]
}
```

### 결과
```
entryId 003 → position 0
entryId 001 → position 1
entryId 002 → position 2
```

## 의존성

없음

## 구현 체크리스트

- [ ] reorder-album-entries.dto.ts
- [ ] class-validator 데코레이터 (@IsArray, @IsUUID, @ArrayMinSize)
- [ ] class-transformer 데코레이터 (@Type)
- [ ] Swagger @ApiProperty 데코레이터
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/album-entry.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
