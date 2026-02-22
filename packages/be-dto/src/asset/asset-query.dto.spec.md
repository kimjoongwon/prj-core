# AssetQueryDto DTO 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: dto
> 위치: packages/be-dto/src/asset/asset-query.dto.ts

## 역할

에셋 목록 조회 시 필터링, 검색, 정렬을 위한 쿼리 파라미터 DTO입니다. PrismaQueryDto를 확장하여 자동 Prisma 변환을 지원합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| folderId | string | optional, UUID | - | 폴더 ID 필터 |
| kind | AssetKind | optional, enum | - | 에셋 타입 필터 |
| status | AssetStatus | optional, enum | - | 업로드 상태 필터 |
| search | string | optional, max 100자 | - | 파일명 검색 (부분 일치) |
| skip | number | optional, min 0 | 0 | 건너뛸 항목 수 |
| take | number | optional, min 1, max 100 | 20 | 가져올 항목 수 |
| sort | string[] | optional | - | 정렬 필드 (JSON:API 컨벤션) |

## 검증 규칙

| 필드 | 규칙 | 에러 메시지 |
|------|------|------------|
| folderId | UUID 형식 | "폴더 ID가 올바르지 않습니다" |
| kind | Enum 값 (IMAGE/VIDEO/DOCUMENT) | "에셋 타입이 올바르지 않습니다" |
| status | Enum 값 (UPLOADING/READY/FAILED) | "상태 값이 올바르지 않습니다" |
| search | 문자열 길이 1-100 | "검색어는 100자 이하여야 합니다" |
| skip | 0 이상의 정수 | "skip 값이 올바르지 않습니다" |
| take | 1-100 사이의 정수 | "take 값은 1~100 사이여야 합니다" |

## 변환 로직

### toPrismaWhere
```typescript
toPrismaWhere(baseWhere?: Prisma.AssetWhereInput): Prisma.AssetWhereInput {
  const where = super.toPrismaWhere(baseWhere);

  // search → originalName 부분 일치
  if (this.search) {
    where.originalName = this.containsFilter(this.search);
  }

  // kind, status, folderId는 자동 매핑됨
  // (PrismaQueryDto의 *Id 패턴, enum 직접 매핑 규칙)

  return where;
}
```

## 사용 예시

### 요청 - 기본 목록
```
GET /api/v1/assets?folderId=550e8400-e29b-41d4-a716-446655440000&skip=0&take=20
```

### 요청 - 타입 필터
```
GET /api/v1/assets?kind=IMAGE&status=READY
```

### 요청 - 검색
```
GET /api/v1/assets?search=banner&sort=-createdAt
```

### Prisma 변환 결과
```typescript
{
  where: {
    folderId: "550e8400-e29b-41d4-a716-446655440000",
    kind: "IMAGE",
    status: "READY",
    originalName: { contains: "banner", mode: "insensitive" }
  },
  orderBy: [{ createdAt: "desc" }],
  skip: 0,
  take: 20
}
```

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| DTO | PrismaQueryDto | 기본 쿼리 기능 확장 |
| Enum | AssetKind | 에셋 타입 |
| Enum | AssetStatus | 업로드 상태 |
| Type | Prisma.AssetWhereInput | Prisma 타입 |

## 구현 체크리스트

- [ ] asset-query.dto.ts
- [ ] PrismaQueryDto 상속
- [ ] class-validator 데코레이터
- [ ] Swagger @ApiPropertyOptional 데코레이터
- [ ] toPrismaWhere() 메서드 구현
- [ ] index.ts export 추가

## 상위 기획서

- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | be-dto-builder |
