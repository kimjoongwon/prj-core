# Profile Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/profile.entity.ts

## 역할

사용자(User)의 프로필 정보를 저장하는 엔티티입니다. 이름, 닉네임, 아바타 이미지 파일을 포함하며, 하나의 사용자가 여러 프로필을 가질 수 있습니다 (User-Profile은 OneToMany). 사용자 인증 정보와 분리된 표시 정보를 관리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| avatarFileId | string | FK, required | - | 아바타 이미지 파일 ID |
| name | string | required | - | 표시 이름 |
| nickname | string | required | - | 닉네임 |
| userId | string | FK, required | - | 소속 사용자 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| user | User | ManyToOne | 소속 사용자 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 한 사용자가 여러 프로필을 가질 수 있습니다 (컨텍스트별 프로필 분리).
- `avatarFileId`는 File 엔티티를 참조하며 필수 필드입니다.
- `name`과 `nickname`은 표시 목적으로 사용되며 로그인 이메일과 분리됩니다.
- 소프트 삭제를 통해 프로필 삭제 이력을 보존합니다.

## 구현 체크리스트

- [x] profile.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma ProfileEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
