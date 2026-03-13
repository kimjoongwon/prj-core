# Groups Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/group.service/index.ts

## 역할

역할 그룹(RoleGroup)을 관리합니다.
그룹은 동일한 Space 내에서 type별로 이름 unique 제약이 있습니다.
연결된 역할이 있어도 그룹 삭제가 가능합니다 (RoleAssociation cascade).

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `GroupsRepository` | 그룹 CRUD |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getAll` | `query: QueryGroupDto` | `Promise<Group[]>` | 그룹 목록 조회 |
| `getById` | `id: string` | `Promise<Group>` | ID로 그룹 조회 (연결된 역할 포함) |
| `create` | `dto: CreateGroupDto, spaceId: string` | `Promise<Group>` | 그룹 생성 |
| `update` | `id: string, dto: UpdateGroupDto` | `Promise<Group>` | 그룹 수정 |
| `delete` | `id: string` | `Promise<Group>` | 그룹 삭제 |

## 비즈니스 규칙

- **이름 unique**: 같은 Space + type 내에서 name 중복 불가 (전역 unique 아님)
- **삭제 허용**: 연결된 역할이 있어도 삭제 가능 (RoleAssociation cascade 삭제)
- 기본 타입: `GroupTypes.Role`

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 그룹 없음 | `NotFoundException` | "그룹을 찾을 수 없습니다" |
| 이름 중복 (같은 Space+type) | `ConflictException` | "이미 존재하는 그룹 이름입니다: {name}" |

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리

## 구현 체크리스트

- [x] group.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `group.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
