# Document Entity 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-23
> 타입: entity
> 위치: packages/be-entity/src/document.entity.ts

## 역할

Asset의 CTI(Class Table Inheritance) 서브타입으로, 문서 타입 에셋의 상세 정보를 관리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| removedAt | DateTime | nullable | null | 삭제 일시 |
| assetId | UUID | unique, FK, required | - | 부모 Asset ID |
| pageCount | Int | nullable | null | 페이지 수 (PDF 등) |
| wordCount | Int | nullable | null | 단어 수 |
| author | String | nullable | null | 작성자 |
| title | String | nullable | null | 제목 |
| subject | String | nullable | null | 주제 |
| keywords | String | nullable | null | 키워드 (쉼표 구분) |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| asset | Asset | 1:1 | 부모 Asset (onDelete: Cascade) |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| hasMetadata() | boolean | 메타데이터가 존재하는지 확인 |
| getKeywordsArray() | string[] | 키워드를 배열로 반환 (쉼표로 구분된 문자열 분리) |
| getContentCount() | number \| null | 문서 유형에 따른 콘텐츠 수 반환 |
| getDocumentType() | string | 문서 유형 추정 (PDF, 문서 등) |
| hasExtractedText() | boolean | 텍스트 추출 여부 확인 |

## 비즈니스 규칙

- Document 레코드는 부모 Asset의 kind가 DOCUMENT인 경우에만 존재
- Asset 삭제 시 연결된 Document도 함께 삭제 (Cascade)
- keywords는 쉼표로 구분된 문자열로 저장
- pageCount, wordCount는 0 이상이어야 함

## 구현 체크리스트

- [x] document.entity.ts
- [x] AbstractEntity 상속
- [x] Prisma 타입 implements
- [x] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| hasMetadata() | 2 | 0 | 0 | 2 |
| getKeywordsArray() | 2 | 0 | 2 | 4 |
| getContentCount() | 2 | 0 | 1 | 3 |
| getDocumentType() | 2 | 0 | 1 | 3 |
| hasExtractedText() | 2 | 0 | 0 | 2 |

### [TC-001] hasMetadata() - 메타데이터 있음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | author="홍길동"인 Document |
| **When** | hasMetadata() 호출 |
| **Then** | true 반환 |

### [TC-002] hasMetadata() - 메타데이터 없음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 모든 nullable 필드가 null인 Document |
| **When** | hasMetadata() 호출 |
| **Then** | false 반환 |

### [TC-003] getKeywordsArray() - 정상 케이스

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | keywords="개발, 프로그래밍, 코딩"인 Document |
| **When** | getKeywordsArray() 호출 |
| **Then** | ["개발", "프로그래밍", "코딩"] 반환 |

### [TC-004] getKeywordsArray() - keywords가 null

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | keywords=null인 Document |
| **When** | getKeywordsArray() 호출 |
| **Then** | [] 반환 |

### [TC-005] getKeywordsArray() - 빈 문자열 포함

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | keywords="개발, , 프로그래밍"인 Document |
| **When** | getKeywordsArray() 호출 |
| **Then** | ["개발", "프로그래밍"] 반환 (빈 문자열 제외) |

### [TC-006] getContentCount() - PDF

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | pageCount=15인 Document |
| **When** | getContentCount() 호출 |
| **Then** | 15 반환 |

### [TC-007] getContentCount() - Word

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | wordCount=5000인 Document |
| **When** | getContentCount() 호출 |
| **Then** | 5000 반환 |

### [TC-008] getDocumentType() - PDF

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | pageCount=10, wordCount=null인 Document |
| **When** | getDocumentType() 호출 |
| **Then** | "PDF" 반환 |

### [TC-009] hasExtractedText() - 있음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | wordCount=100인 Document |
| **When** | hasExtractedText() 호출 |
| **Then** | true 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
| 2026-02-23 | 필드 구조 실제 Prisma 스키마에 맞게 업데이트 | entity-builder |
| 2026-02-23 | hasMetadata(), getKeywordsArray() 메서드 추가 | entity-builder |
