# File Entity 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: entity
> 위치: packages/be-entity/src/file.entity.ts

## 역할

시스템 내 업로드된 파일 정보를 관리하는 엔티티입니다. 파일의 이름, MIME 타입, 크기, URL, 소속 공간 등의 메타데이터를 저장하며, 이미지·동영상·문서 등 모든 파일 형식을 통합 관리합니다. 폴더 구조를 지원하기 위해 부모 파일(parentId) 참조도 가능합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | string | PK, required | uuid() | 고유 식별자 |
| createdAt | Date | required | now() | 생성 일시 |
| updatedAt | Date \| null | nullable | now() | 수정 일시 |
| removedAt | Date \| null | nullable | null | 소프트 삭제 일시 |
| tenantId | string | required | - | 테넌트 ID |
| parentId | string \| null | FK, nullable | null | 부모 파일/폴더 ID |
| spaceId | string | FK, required | - | 소속 공간 ID |
| creatorId | string \| null | FK, nullable | null | 업로드한 사용자 ID |
| size | number | required | - | 파일 크기 (바이트) |
| mimeType | string | required | - | MIME 타입 |
| url | string | required | - | 파일 접근 URL |
| name | string | required | - | 파일 이름 |

## Enum

해당 없음

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| space | Space | ManyToOne | 소속 공간 |
| creator | User | ManyToOne | 업로드한 사용자 |

## 도메인 메서드

해당 없음

## 비즈니스 규칙

- `parentId`를 활용하여 폴더 계층 구조를 표현할 수 있습니다.
- Space 단위로 파일이 격리됩니다.
- `url`은 외부 스토리지(S3 등)의 접근 가능한 URL 또는 내부 경로입니다.
- `creatorId`가 null인 경우 시스템 생성 파일을 의미합니다.
- 소프트 삭제를 통해 파일 삭제 이력을 보존합니다.

## 구현 체크리스트

- [x] file.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma FileEntity 타입 implements
- [x] index.ts export 추가

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
