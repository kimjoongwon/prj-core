# Exercise Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/exercise.entity.ts

## 역할

태스크(Task)에 연결된 운동 정보를 담는 엔티티입니다. 운동의 이름, 소요 시간, 횟수, 이미지/동영상 파일 등 운동 콘텐츠 세부 정보를 저장합니다. 하나의 태스크에는 하나의 Exercise가 연결됩니다.

관리자 UI(`/exercises`)에서 CRUD를 제공하며, Routine 구성(Activity 추가)의 기반 데이터가 됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required | - | 운동 이름 |
| duration | number | required | - | 운동 소요 시간 (초 단위, 최소 1) |
| count | number | required | - | 운동 횟수 (최소 1) |
| taskId | string | FK, required, unique | - | 연결된 태스크 ID (Task와 1:1) |
| description | string \| null | nullable | null | 운동 설명 (최대 500자) |
| imageFileId | string \| null | FK, nullable | null | 이미지 파일 ID (운동 동작 이미지) |
| videoFileId | string \| null | FK, nullable | null | 동영상 파일 ID (운동 시연 영상) |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| task | Task | OneToOne | 연결된 태스크 (spaceId, creatorId, activities 보유) |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 하나의 태스크에는 하나의 Exercise만 연결됩니다 (OneToOne).
- `duration`은 초 단위로 저장됩니다. UI에서는 분:초로 변환하여 표시합니다.
- `imageFileId`와 `videoFileId`는 파일 시스템의 File 엔티티를 참조합니다.
- 운동 콘텐츠 미디어(이미지, 동영상)는 선택 사항입니다.
- Exercise 등록 시 서버에서 Task를 자동으로 함께 생성합니다.
- Activity에서 사용 중인 Exercise는 삭제할 수 없습니다 (서버에서 409 에러 반환).
- Space 계층 공유: 상위 Space의 Exercise를 하위 Space의 Routine에서 사용할 수 있습니다.

## UI 연동 규칙 (admin 앱)

| 화면 | 경로 | 설명 |
|------|------|------|
| 목록 | `/exercises` | 이름 검색, Space 범위 필터, 삭제 |
| 등록 | `/exercises/new` | Task 자동 생성 포함 |
| 상세 | `/exercises/[exerciseId]` | 사용 루틴 목록 표시 |
| 수정 | `/exercises/[exerciseId]/edit` | 미디어 변경 포함 |

## 구현 체크리스트

- [x] exercise.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma ExerciseEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 관리자 UI 기획 완료 반영 (비즈니스 규칙 보완, UI 연동 섹션 추가) | req-entity-planner |
