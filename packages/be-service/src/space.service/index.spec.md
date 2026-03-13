# Spaces Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/space.service/index.ts

## 역할

Space aggregate root를 관리합니다. Ground 1:1 detail lifecycle과 SpaceCategory 계층 기반 접근 계산을 함께 담당합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `SpacesRepository` | Space CRUD |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getById` | `id: string` | `Promise<Space \| null>` | ID로 Space 조회 |
| `listSpaces` | - | `Promise<{ spaces: Space[]; total: number }>` | Ground 포함 Space 목록 조회 |
| `getGroundBySpaceId` | `spaceId: string` | `Promise<Ground>` | Space의 1:1 Ground detail 조회 |
| `createPersonalSpace` | - | `Promise<Space>` | 개인 Space 생성 (회원가입 시) |
| `create` | `data?: Prisma.SpaceUncheckedCreateInput` | `Promise<Space>` | Space 생성 (옵션 포함) |
| `createSpaceWithGround` | `dto: CreateGroundDto` | `Promise<Space>` | Space root와 Ground detail 동시 생성 |
| `updateGroundBySpaceId` | `spaceId: string, dto: UpdateGroundDto` | `Promise<Space>` | Space root 아래 Ground detail 수정 |
| `getAccessibleSpaceIds` | `spaceId: string` | `Promise<string[]>` | SpaceCategory 계층 기반 접근 가능한 Space ID 배열 조회 |
| `findByIdsWithGround` | `ids: string[]` | `Promise<Space[]>` | 여러 ID로 Space 조회 (Ground 포함) |
| `removeById` | `id: string` | `Promise<Space>` | Space 소프트 삭제 |

## 비즈니스 규칙

- `createPersonalSpace`: 파라미터 없이 기본 개인 Space 생성
- `getAccessibleSpaceIds`: SpaceCategory 계층 구조를 탐색하여 접근 가능한 모든 하위 Space ID 반환
- `findByIdsWithGround`: 여러 Space를 Ground 정보 포함하여 조회 (다중 Space 조회 최적화)
- Ground는 독립 aggregate가 아니라 Space의 1:1 detail child로 취급한다.

## 에러 처리

- 별도 에러 처리 없음 (Repository로 위임)

## 권한 요구사항

- 내부 서비스 전용 (다른 서비스/ApplicationService에서 호출)

## 구현 체크리스트

- [x] space.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-11 | 호출 주체 설명을 ApplicationService 기준으로 갱신 | codex |
| 2026-03-11 | Ground 1:1 detail 메서드와 root 책임 설명을 반영 | codex |
| 2026-03-13 | `space.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
| 2026-03-13 | frontend 런타임 미사용 상세 조회/삭제 보조 메서드를 제거 | codex |
