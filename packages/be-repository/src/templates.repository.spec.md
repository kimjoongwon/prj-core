# Templates Repository 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: repository
> 위치: packages/be-repository/src/templates.repository.ts

## 역할

메시지 템플릿(Template) 엔티티의 데이터 접근을 담당합니다. 이메일, SMS 등 다양한 채널의 메시지 템플릿과 해당 변수(TemplateVariable)를 함께 관리합니다. 템플릿과 변수를 트랜잭션 단위로 생성/수정하는 복합 작업을 지원합니다.

## 엔티티

- **대상 Entity**: Template (`@cocrepo/entity`)
- **Prisma 모델**: `template`

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `findById(id)` | string | `Promise<Template \| null>` | ID로 조회 (variables 포함) |
| `findByIdOrThrow(id)` | string | `Promise<Template>` | ID로 조회 (없으면 에러) |
| `findByCode(code)` | string | `Promise<Template \| null>` | code(unique)로 조회 (variables 포함) |
| `findMany(params)` | where, orderBy, skip?, take? | `Promise<{ data: Template[], totalCount: number }>` | 페이지네이션 목록 조회 (variables 미포함) |
| `create(data)` | Prisma.TemplateUncheckedCreateInput | `Promise<Template>` | 단순 생성 (variables 없음) |
| `createWithVariables(templateData, variables)` | TemplateInput, VariableInput[] | `Promise<Template>` | 템플릿 + 변수 함께 생성 |
| `updateById(id, data)` | string, Prisma.TemplateUncheckedUpdateInput | `Promise<Template>` | ID로 수정 (variables 미포함) |
| `updateWithVariables(id, templateData, variables)` | string, TemplateInput, VariableInput[] | `Promise<Template>` | 템플릿 + 변수 전체 교체 |
| `removeById(id)` | string | `Promise<Template>` | 소프트 삭제 (removedAt + isActive: false) |

## 변수 관리 전략

### createWithVariables
Prisma nested create를 사용하여 템플릿과 변수를 단일 쿼리로 생성합니다.

### updateWithVariables
기존 변수를 모두 삭제 후 새 변수를 생성하는 교체(replace) 전략을 사용합니다.

```
1. templateVariable.deleteMany({ where: { templateId: id } })
2. template.update({ data: { ...templateData, variables: { create: variables } } })
```

## 쿼리 최적화

- `findById()` / `findByCode()`: `include: { variables: true }` 연관 로딩
- `findMany()`: `Promise.all()`로 데이터와 totalCount 동시 조회
- `findMany()` 내부에서 `removedAt: null` 조건 자동 추가

## 삭제 정책

- **소프트 삭제**: `removeById()` → `removedAt: new Date(), isActive: false` 함께 설정
- 물리 삭제 메서드 없음

## 구현 체크리스트

- [x] templates.repository.ts
- [x] @Injectable() 데코레이터
- [x] TransactionHost 의존성 주입
- [x] plainToInstance 변환

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
