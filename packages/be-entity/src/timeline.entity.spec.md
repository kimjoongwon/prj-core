# Timeline Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/timeline.entity.ts

## 역할

시간표/타임라인을 관리하는 엔티티입니다. 여러 Session(수업 세션)을 포함하며, Space 단위로 격리됩니다. 체육관이나 훈련 시설의 수업 스케줄을 조직하는 컨테이너 역할을 합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| tenantId | string | required | - | 테넌트 ID |
| spaceId | string | FK, required | - | 소속 공간 ID |
| creatorId | string \| null | FK, nullable | null | 생성자 사용자 ID |
| name | string | required | - | 타임라인 이름 |
| description | string \| null | nullable | null | 설명 |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| space | Space | ManyToOne | 소속 공간 |
| creator | User | ManyToOne | 생성자 |
| sessions | Session[] | OneToMany | 포함된 세션 목록 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- Space 단위로 타임라인이 격리됩니다.
- 하나의 타임라인에 여러 세션(1회성 및 반복)이 포함됩니다.
- `creatorId`가 null인 경우 시스템 생성 타임라인입니다.
- 소프트 삭제를 통해 타임라인 삭제 이력을 보존합니다.

## 구현 체크리스트

- [x] timeline.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma TimelineEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
