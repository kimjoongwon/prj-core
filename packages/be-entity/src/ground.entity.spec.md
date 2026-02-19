# Ground Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/ground.entity.ts

## 역할

물리적 시설(체육관, 훈련장 등)을 나타내는 엔티티입니다. Space와 연결되어 해당 공간의 실제 위치 정보(주소, 연락처, 사업자 번호 등)를 관리합니다. 로고 이미지와 대표 이미지를 파일로 참조할 수 있습니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required | - | 시설 이름 |
| label | string \| null | nullable | null | 표시 라벨 |
| address | string | required | - | 주소 |
| phone | string | required | - | 전화번호 |
| email | string | required | - | 이메일 |
| businessNo | string | required | - | 사업자 번호 |
| spaceId | string | FK, required | - | 연결된 공간 ID |
| logoImageFileId | string \| null | FK, nullable | null | 로고 이미지 파일 ID |
| imageFileId | string \| null | FK, nullable | null | 대표 이미지 파일 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| space | Space \| null | OneToOne | 연결된 공간 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 하나의 Space에 하나의 Ground만 연결됩니다 (OneToOne).
- `businessNo`는 사업자 등록번호로 검증이 필요합니다.
- `logoImageFileId`와 `imageFileId`는 File 엔티티를 참조합니다.
- `email`과 `phone`은 시설 공식 연락처입니다.

## 구현 체크리스트

- [x] ground.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma GroundEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
