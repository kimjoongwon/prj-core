# AbstractEntity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/abstract.entity.ts

## 역할

모든 엔티티 클래스의 기본 추상 클래스입니다. `BaseEntityFields` 인터페이스를 구현하며, 공통 기본 필드(id, createdAt, updatedAt, removedAt)를 제공합니다. `plainToInstance`를 활용한 DTO 변환 기능을 포함하며, 현재는 `DtoTransformInterceptor`가 자동 변환을 담당하므로 `toDto()`는 deprecated 상태입니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |

## Enum

해당 없음

## 관계

해당 없음 (모든 엔티티의 기본 클래스)

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| toDto?(options?) | DTO | [Deprecated] Entity를 DTO로 변환합니다. DtoTransformInterceptor 사용 권장 |

## 비즈니스 규칙

- 소프트 삭제(Soft Delete) 패턴을 사용합니다. 실제 삭제 대신 `removedAt` 필드에 시각을 기록합니다.
- `toDto()`는 deprecated되었으며 `DtoTransformInterceptor`가 자동으로 Entity → DTO 변환을 처리합니다.
- `dtoClass`가 설정되지 않은 상태에서 `toDto()`를 호출하면 에러가 발생합니다.
- 제네릭 타입 `DTO`와 `O`를 통해 각 엔티티별 DTO 변환 타입을 강제합니다.

## 구현 체크리스트

- [x] abstract.entity.ts
- [x] BaseEntityFields 인터페이스 implements
- [x] class-transformer plainToInstance 활용
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
