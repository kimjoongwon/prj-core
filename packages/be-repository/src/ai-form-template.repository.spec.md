# AI 폼 템플릿 Repository 기획서

## 개요

AI 폼 템플릿 도메인의 데이터 접근 레이어입니다. Prisma를 사용하여 데이터베이스 조작을 수행합니다.

## 메서드 목록

### AIFormTemplate 메서드

| 메서드 | 설명 | Prisma 매핑 |
|--------|------|-------------|
| `findById(id)` | ID로 단일 템플릿 조회 (필드 포함) | `findUnique` |
| `findByIdOrThrow(id)` | ID로 조회 (없으면 에러) | `findUnique` |
| `findMany(params)` | 목록 조회 (페이지네이션) | `findMany` + `count` |
| `findManyByTargetDomain(domain, params)` | 도메인별 목록 조회 | `findMany` + `count` |
| `findActiveByTargetDomain(domain, params)` | 활성화된 템플릿만 조회 | `findMany` + `count` |
| `findByIdWithFields(id)` | 필드 포함 상세 조회 | `findUnique` + `include` |
| `create(data)` | 단일 템플릿 생성 | `create` |
| `createWithFields(templateData, fields)` | 필드와 함께 생성 | `create` + nested `create` |
| `updateById(id, data)` | ID로 업데이트 | `update` |
| `updateWithFields(id, templateData, fields)` | 필드와 함께 업데이트 | `deleteMany` + `update` + nested `create` |
| `removeById(id)` | 소프트 삭제 | `update` (removedAt 설정) |
| `deleteById(id)` | 물리 삭제 | `delete` |

### AIFormField 메서드

| 메서드 | 설명 | Prisma 매핑 |
|--------|------|-------------|
| `findFieldsByTemplateId(templateId)` | 템플릿의 모든 필드 조회 | `findMany` |
| `createField(data)` | 단일 필드 생성 | `create` |
| `updateFieldById(id, data)` | 단일 필드 업데이트 | `update` |
| `deleteFieldById(id)` | 단일 필드 삭제 | `delete` |

## Prisma 타입 사용

| 메서드 | Prisma 타입 |
|--------|-------------|
| `create` | `Prisma.AIFormTemplateUncheckedCreateInput` |
| `updateById` | `Prisma.AIFormTemplateUncheckedUpdateInput` |
| `findMany` | `Prisma.AIFormTemplateWhereInput`, `Prisma.AIFormTemplateOrderByWithRelationInput` |
| `createField` | `Prisma.AIFormFieldUncheckedCreateInput` |
| `updateFieldById` | `Prisma.AIFormFieldUncheckedUpdateInput` |

## 쿼리 패턴

### 기본 조회 (소프트 삭제 제외)

```typescript
const notRemoved: Prisma.AIFormTemplateWhereInput = {
  ...where,
  removedAt: null,
};
```

### 활성화된 템플릿만 조회

```typescript
const where: Prisma.AIFormTemplateWhereInput = {
  targetDomain,
  status: AITemplateStatus.ACTIVE,
  removedAt: null,
};
```

### 필드 포함 조회

```typescript
include: {
  fields: {
    orderBy: { order: "asc" },
  },
}
```

### 필드와 함께 생성

```typescript
create: {
  ...templateData,
  fields: {
    create: fields.map(field => ({ ...field })),
  },
}
```

### 필드 전체 교체 (updateWithFields)

```typescript
// 1. 기존 필드 전체 삭제
await this.txHost.tx.aIFormField.deleteMany({
  where: { templateId: id },
});

// 2. 템플릿 업데이트 + 새 필드 생성
await this.txHost.tx.aIFormTemplate.update({
  where: { id },
  data: {
    ...templateData,
    fields: {
      create: fields.map(field => ({ ...field })),
    },
  },
  include: { fields: true },
});
```

## 주의사항

1. **메서드명 규칙**: "어떤 데이터를 가져오는지" 표현
2. **소프트 삭제**: `removeById`는 `removedAt` 설정
3. **필드 정렬**: 항상 `order: "asc"`로 정렬
4. **트랜잭션**: `txHost.tx` 사용으로 자동 트랜잭션 관리
5. **Entity 변환**: `plainToInstance(AIFormTemplate, result)` 사용

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | be-repository-builder |
