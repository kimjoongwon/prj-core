# Asset Service 기획서

> 생성일: 2026-02-22
> 타입: service
> 위치: apps/server/src/module/assets/asset.service.ts

## 역할

에셋(Asset) CRUD 및 비즈니스 로직을 담당합니다. 업로드 상태 관리, 폴더 이동, 타입별 상세 정보 처리 등을 수행합니다.

## 담당 도메인

Asset, Image, Video, Document, Derivative, Folder

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Repository | AssetRepository | 에셋 데이터 접근 |
| Repository | ImageRepository | 이미지 상세 데이터 접근 |
| Repository | VideoRepository | 비디오 상세 데이터 접근 |
| Repository | DocumentRepository | 문서 상세 데이터 접근 |
| Repository | DerivativeRepository | 파생 리소스 데이터 접근 |
| Repository | FolderRepository | 폴더 데이터 접근 |

## 공개 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| findById | id: string | Asset | 단일 에셋 조회 |
| findByFolder | folderId: string, query: QueryDto | PaginatedResult<Asset> | 폴더별 에셋 목록 |
| search | keyword: string, query: QueryDto | PaginatedResult<Asset> | 에셋 검색 |
| create | createDto: CreateAssetDto | Asset | 에셋 생성 |
| update | id: string, updateDto: UpdateAssetDto | Asset | 에셋 수정 |
| moveToFolder | id: string, targetFolderId: string | Asset | 폴더 이동 |
| softDelete | id: string | void | 소프트 삭제 |
| batchSoftDelete | ids: string[] | void | 일괄 소프트 삭제 |
| getDetailInfo | id: string | AssetDetail | 타입별 상세 정보 포함 조회 |
| getDerivatives | assetId: string | Derivative[] | 파생 리소스 목록 |

## 비즈니스 규칙

### 에셋 생성

- kind에 따라 상세 테이블(Image/Video/Document) 생성 필요
- status는 기본적으로 UPLOADING으로 시작
- storageKey는 중복 불가

### 폴더 이동

- 대상 폴더가 같은 Space에 속해야 함
- 존재하지 않는 폴더로 이동 불가

### 소프트 삭제

- removedAt 필드에 현재 시간 설정
- 삭제된 에셋은 목록에서 제외 (기본 쿼리)

## 에러 처리

| 상황 | 에러 코드 | 메시지 |
|------|----------|--------|
| 에셋 없음 | 404 | "에셋을 찾을 수 없습니다" |
| 폴더 없음 | 404 | "폴더를 찾을 수 없습니다" |
| 권한 없음 | 403 | "이 에셋에 접근할 권한이 없습니다" |
| 중복 storageKey | 409 | "이미 존재하는 스토리지 키입니다" |

## 권한 체크

| 메서드 | 필요 권한 | 체크 방식 |
|--------|----------|----------|
| findById | VIEW | Space 멤버십 확인 |
| findByFolder | VIEW | Space 멤버십 확인 |
| create | MANAGE | Space 관리 권한 확인 |
| update | MANAGE | Space 관리 권한 확인 |
| softDelete | MANAGE | Space 관리 권한 확인 |

## 구현 체크리스트

- [ ] asset.service.ts
- [ ] 단위 테스트 (Jest)
- [ ] 통합 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| findById | 1 | 1 | 0 | 2 |
| findByFolder | 1 | 1 | 1 | 3 |
| create | 1 | 1 | 0 | 2 |
| moveToFolder | 1 | 2 | 0 | 3 |
| softDelete | 1 | 1 | 0 | 2 |

### [TC-001] findById - 정상 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 존재하는 에셋 ID |
| **When** | findById 호출 |
| **Then** | 에셋 정보 반환 |

### [TC-002] findById - 존재하지 않음

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 존재하지 않는 에셋 ID |
| **When** | findById 호출 |
| **Then** | NotFoundException 발생 |

### [TC-003] moveToFolder - 정상 이동

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 에셋과 대상 폴더가 같은 Space에 존재 |
| **When** | moveToFolder 호출 |
| **Then** | folderId가 변경됨 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
