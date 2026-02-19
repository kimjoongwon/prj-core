# Ground Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/ground.entity.ts

## 역할

물리적 시설(피트니스 센터, 체육관 등)을 나타내는 엔티티입니다. Space와 1:1로 연결되어 해당 공간의 실제 위치 정보(주소, 연락처, 사업자 번호 등)를 관리합니다. 로고 이미지와 대표 이미지를 파일로 참조할 수 있습니다.

Space 자체는 추상 컨테이너(id만 존재)이고, Ground가 실제 비즈니스 의미를 부여합니다. Ground 등록 시 새 Space가 자동으로 함께 생성됩니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| name | string | required | - | 시설 이름 (예: "강남 헬스클럽") |
| label | string \| null | nullable | null | 단축 라벨 (예: "GANGNAM") |
| address | string | required | - | 시설 주소 |
| phone | string | required | - | 시설 전화번호 |
| email | string | required | - | 시설 이메일 |
| businessNo | string | required, unique | - | 사업자등록번호 (한 번 등록 후 변경 불가) |
| spaceId | string | FK, required, unique | - | 연결된 Space ID (1:1) |
| logoImageFileId | string \| null | FK, nullable | null | 로고 이미지 파일 ID |
| imageFileId | string \| null | FK, nullable | null | 대표 이미지 파일 ID |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| space | Space | OneToOne | 연결된 Space (1:1, spaceId unique) |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- 하나의 Space에 하나의 Ground만 연결됩니다 (`spaceId` unique).
- `businessNo`는 사업자등록번호로 전체 시스템에서 유일해야 합니다 (`businessNo` unique).
- `businessNo`는 한 번 등록 후 변경 불가합니다. UpdateDto에서 제외합니다.
- Ground 등록 시 서버에서 새 Space를 자동 생성하고 `spaceId`를 연결합니다.
- `logoImageFileId`와 `imageFileId`는 File 엔티티를 참조합니다 (선택적).
- `email`과 `phone`은 시설 공식 연락처입니다.
- 소프트 삭제 방식으로 `removedAt`을 설정하여 논리 삭제합니다.

## CRUD 시나리오

| 작업 | 조건 | 비고 |
|------|------|------|
| 등록 (CREATE) | FULL_ACCESS 전용 | Space 자동 생성 포함 |
| 목록 조회 (LIST) | 인증 필요 | 전체 또는 Space 기반 필터 |
| 상세 조회 (GET) | 인증 필요 | groundId로 단건 조회 |
| 수정 (UPDATE) | FULL_ACCESS 전용 | businessNo 수정 불가 |
| 삭제 (DELETE) | FULL_ACCESS 전용 | 소프트 삭제 |

## 구현 체크리스트

- [x] ground.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma GroundEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | CRUD 시나리오 추가, businessNo 불변 규칙 명시, Ground-Space 관계 설명 보강 | req-entity-planner |
