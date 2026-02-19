# Categories Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/categories.service.ts

## 역할

역할 카테고리(RoleCategory) 계층 구조를 관리합니다.
카테고리는 트리 구조(parent-children)로 구성되며, 순환 참조를 방지합니다.
카테고리 이름은 전역 unique 제약이 있습니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `CategoriesRepository` | 카테고리 CRUD |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getAll` | `query: QueryCategoryDto` | `Promise<Category[]>` | 카테고리 목록 조회 (parent, children 포함) |
| `getById` | `id: string` | `Promise<Category>` | ID로 카테고리 조회 (parent, children, roleClassifications 포함) |
| `create` | `dto: CreateCategoryDto, spaceId: string` | `Promise<Category>` | 카테고리 생성 |
| `update` | `id: string, dto: UpdateCategoryDto` | `Promise<Category>` | 카테고리 수정 |
| `delete` | `id: string` | `Promise<Category>` | 카테고리 삭제 |

## 비즈니스 규칙

- **이름 unique**: Category.name은 전역 unique (중복 불가)
- **parentId 검증**: 생성/수정 시 parentId가 있으면 존재 여부 확인
- **순환 참조 방지**: parentId 변경 시 자기 자신 또는 하위 카테고리를 부모로 설정 불가
- **삭제 제한**: 하위 카테고리가 있으면 삭제 거부
- 기본 타입: `CategoryTypes.Role`

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 카테고리 없음 | `NotFoundException` | "카테고리를 찾을 수 없습니다" |
| 이름 중복 | `ConflictException` | "이미 존재하는 카테고리 이름입니다: {name}" |
| 상위 카테고리 없음 | `NotFoundException` | "상위 카테고리를 찾을 수 없습니다" |
| 하위 카테고리 존재 | `BadRequestException` | "하위 카테고리가 {N}개 있어 삭제할 수 없습니다..." |
| 자기 자신을 부모로 설정 | `BadRequestException` | "자기 자신을 상위 카테고리로 설정할 수 없습니다" |
| 하위를 부모로 설정 | `BadRequestException` | "하위 카테고리를 상위 카테고리로 설정할 수 없습니다 (순환 참조)" |

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리

## 구현 체크리스트

- [x] categories.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
