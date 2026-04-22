# Document Entity 기획서

> 생성일: 2026-02-22
> 타입: entity
> 위치: packages/be-entity/src/document.entity.ts

## 역할

Asset의 CTI(Class Table Inheritance) 서브타입으로, 문서 타입 에셋의 상세 정보를 관리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| assetId | UUID | PK, FK, required | - | 부모 Asset ID |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| pageCount | Int | optional | - | 페이지 수 (PDF 등) |
| sheetCount | Int | optional | - | 시트 수 (Excel 등) |
| slideCount | Int | optional | - | 슬라이드 수 (PPT 등) |
| extractedTextKey | String | optional | - | 추출된 텍스트 저장 키 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Asset | 1:1 | 부모 Asset (onDelete: Cascade) |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| getContentCount() | number | 문서 유형에 따른 콘텐츠 수 반환 |
| getDocumentType() | string | 문서 유형 추정 (PDF, Excel, PPT 등) |
| hasExtractedText() | boolean | 텍스트 추출 여부 확인 |

## 비즈니스 규칙

- Document 레코드는 부모 Asset의 kind가 DOCUMENT인 경우에만 존재
- Asset 삭제 시 연결된 Document도 함께 삭제 (Cascade)
- pageCount, sheetCount, slideCount 중 하나만 의미 있음 (문서 유형에 따라)

## 구현 체크리스트

- [ ] document.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| getContentCount() | 3 | 0 | 1 | 4 |
| getDocumentType() | 3 | 0 | 1 | 4 |
| hasExtractedText() | 2 | 0 | 0 | 2 |

### [TC-001] getContentCount() - PDF

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | pageCount=15인 Document |
| **When** | getContentCount() 호출 |
| **Then** | 15 반환 |

### [TC-002] getContentCount() - Excel

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | sheetCount=5인 Document |
| **When** | getContentCount() 호출 |
| **Then** | 5 반환 |

### [TC-003] getContentCount() - PPT

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | slideCount=20인 Document |
| **When** | getContentCount() 호출 |
| **Then** | 20 반환 |

### [TC-004] getDocumentType() - PDF

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | pageCount=10, sheetCount=null, slideCount=null인 Document |
| **When** | getDocumentType() 호출 |
| **Then** | "PDF" 반환 |

### [TC-005] hasExtractedText() - 있음

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | extractedTextKey가 있는 Document |
| **When** | hasExtractedText() 호출 |
| **Then** | true 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.context.md`
- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
