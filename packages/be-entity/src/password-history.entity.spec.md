# PasswordHistory Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/password-history.entity.ts

## 역할

사용자의 비밀번호 변경 이력을 기록하는 엔티티입니다. 비밀번호 재사용 방지(SecurityPolicy.passwordReuseLimit) 정책 적용을 위해 이전 비밀번호 해시를 저장합니다. AbstractEntity를 상속하지 않으며 수정 불가(불변) 레코드로 관리됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 비밀번호 변경 일시 |
| userId | string | FK, required | - | 사용자 ID |
| passwordHash | string | required | - | 변경된 비밀번호 해시 |

## Enum

해당 없음

## 관계

해당 없음 (User 엔티티에서 OneToMany로 참조)

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 비밀번호 변경 시 기존 비밀번호 해시를 이 테이블에 저장합니다.
- `SecurityPolicy.passwordReuseLimit`에 지정된 최근 N개의 비밀번호를 재사용할 수 없습니다.
- `updatedAt`, `removedAt` 필드가 없으며 불변 레코드로 관리됩니다.
- AbstractEntity를 상속하지 않아 소프트 삭제 기능이 없습니다.
- 보안을 위해 비밀번호 원문은 저장하지 않고 해시만 저장합니다.

## 구현 체크리스트

- [x] password-history.entity.ts
- [x] AbstractEntity 미상속 (독립 구현)
- [x] Prisma PasswordHistoryEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
