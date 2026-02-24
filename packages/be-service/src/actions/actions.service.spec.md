# Actions Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/actions.service.ts

## 역할

CASL Action을 관리합니다. Action은 권한 시스템에서 수행 가능한 행위(read, write, manage 등)를 정의합니다.
DDD 원칙에 따라 Action은 행위의 완전한 정의를 가지며, 단일 Repository에만 의존합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `ActionsRepository` | Action CRUD |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getAllActions` | - | `Promise<Action[]>` | 모든 Action 조회 |
| `getActionsByGroup` | `group: string` | `Promise<Action[]>` | 그룹별 Action 조회 |
| `getCrudActions` | - | `Promise<Action[]>` | CRUD Action 목록 조회 |
| `getVisibilityActions` | - | `Promise<Action[]>` | Visibility Action 목록 조회 (마스킹 포함) |
| `getActionById` | `id: string` | `Promise<Action>` | ID로 Action 조회 |
| `getActionByName` | `name: string` | `Promise<Action>` | 이름으로 Action 조회 |
| `getActionsByNames` | `names: string[]` | `Promise<Action[]>` | 여러 이름으로 Action 조회 |
| `createAction` | `data: Prisma.ActionUncheckedCreateInput` | `Promise<Action>` | Action 생성 |
| `updateAction` | `id: string, data: Prisma.ActionUncheckedUpdateInput` | `Promise<Action>` | Action 수정 |
| `deleteAction` | `id: string` | `Promise<Action>` | Action 소프트 삭제 |
| `upsertActions` | `actions: Prisma.ActionUncheckedCreateInput[]` | `Promise<Action[]>` | 다중 Action 생성/업데이트 |

## 비즈니스 규칙

- Action 그룹: `crud`, `visibility`, `bulk`, `workflow`
- `updateAction`, `deleteAction` 실행 전 존재 여부 확인 (없으면 NotFoundException)
- `upsertActions`: 시드 데이터 동기화 용도로 사용

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| Action이 존재하지 않는 경우 | `NotFoundException` | `ACTION_ERRORS.NOT_FOUND` |

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리

## 구현 체크리스트

- [x] actions.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
