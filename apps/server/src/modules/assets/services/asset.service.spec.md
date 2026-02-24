# Asset Service 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-23
> 타입: service
> 위치: apps/server/src/module/assets/services/asset.service.ts

## 역할

에셋(Asset) CRUD 및 비즈니스 로직을 담당합니다. 업로드 상태 관리, 폴더 이동, 타입별 상세 정보 처리, Space 기반 접근 권한 검증 등을 수행합니다.

## 담당 도메인

Asset, Image, Video, Document, Derivative, Folder

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Repository | AssetRepository | 에셋 데이터 접근 |
| Service | ClsService | CLS 컨텍스트 접근 (Space ID, Tenant) |

## 공개 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| getAssetsBySpace | query: AssetQueryDto | Promise\<GetAssetsResult\> | Space 내 에셋 목록 조회 (페이지네이션, 통계 포함) |
| getAssetDetailById | assetId: string | Promise\<Asset\> | 에셋 상세 조회 (Image/Video/Document 포함) |
| getAssetById | assetId: string | Promise\<Asset \| null\> | ID로 에셋 조회 |
| getAssetByStorageKey | storageKey: string | Promise\<Asset \| null\> | Storage Key로 에셋 조회 |
| createAsset | data: Prisma.AssetUncheckedCreateInput | Promise\<Asset\> | 에셋 생성 |
| createAssetWithDetails | params | Promise\<Asset\> | 에셋 생성 (상세 정보 포함) |
| updateAsset | assetId, data | Promise\<Asset\> | 에셋 수정 |
| deleteAsset | assetId: string | Promise\<Asset\> | 소프트 삭제 |
| batchSoftDelete | assetIds: string[] | Promise\<number\> | 일괄 소프트 삭제 (삭제된 수 반환) |
| restoreAsset | assetId: string | Promise\<Asset\> | 에셋 복원 |
| moveAsset | assetId, targetFolderId | Promise\<Asset\> | 폴더 이동 |
| updateAssetStatus | assetId, status | Promise\<Asset\> | 상태 변경 (UPLOADING/READY/FAILED) |
| getAssetsByIds | ids: string[] | Promise\<Asset[]\> | 여러 ID로 에셋 조회 |
| getAssetsByFolderId | folderId, query? | Promise\<{items, count}\> | Folder ID로 에셋 목록 |
| countAssetsBySpaceId | spaceId: string | Promise\<number\> | Space 내 에셋 수 |
| countAssetsByFolderId | folderId: string | Promise\<number\> | Folder 내 에셋 수 |
| searchAssets | keyword, query? | Promise\<GetAssetsResult\> | 키워드 검색 |

## 비즈니스 규칙

### Space 접근 권한

- System Space (ROOT Category)인 경우: 전체 Space 에셋 접근 가능
- 일반 Space인 경우: 해당 Space 에셋만 접근 가능
- `canAccessAllSpaces(tenant)` 함수로 권한 확인

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

### 에셋 복원

- 전체 접근 권한(FULL_ACCESS)이 있는 경우에만 복원 가능

### 에셋 상태

- UPLOADING: 업로드 중
- READY: 업로드 완료 (사용 가능)
- FAILED: 업로드 실패

## 에러 처리

| 상황 | 에러 타입 | 메시지 |
|------|----------|--------|
| Space 미선택 | BadRequestException | "Space가 선택되지 않았습니다." |
| 에셋 없음 | NotFoundException | "에셋을 찾을 수 없습니다." |
| Space 접근 권한 없음 | NotFoundException | "에셋을 찾을 수 없습니다." (보안상 동일 메시지) |
| 복원 권한 없음 | BadRequestException | "삭제된 에셋 복원은 전체 접근 권한이 필요합니다." |
| 일괄 삭제 권한 없음 | BadRequestException | "일부 에셋에 대한 접근 권한이 없습니다." |

## 권한 체크

| 메서드 | 필요 권한 | 체크 방식 |
|--------|----------|----------|
| getAssetsBySpace | VIEW | Space 멤버십 확인 |
| getAssetDetailById | VIEW | Space 멤버십 확인 |
| createAsset | MANAGE | Space 관리 권한 확인 |
| updateAsset | MANAGE | Space 관리 권한 확인 |
| deleteAsset | MANAGE | Space 관리 권한 확인 |
| restoreAsset | FULL_ACCESS | System Space (ROOT) 확인 |

## 구현 체크리스트

- [x] asset.service.ts
- [x] `@Injectable()` 데코레이터
- [x] AssetStats 타입 정의 (packages/common-type)
- [ ] 단위 테스트 (Jest)
- [ ] 통합 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| getAssetsBySpace | 1 | 1 | 1 | 3 |
| getAssetDetailById | 1 | 2 | 0 | 3 |
| createAsset | 1 | 1 | 0 | 2 |
| moveAsset | 1 | 2 | 0 | 3 |
| deleteAsset | 1 | 2 | 0 | 3 |
| batchSoftDelete | 1 | 1 | 1 | 3 |

### [TC-001] getAssetsBySpace - 정상 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | Space ID가 설정되고, 에셋이 존재함 |
| **When** | getAssetsBySpace 호출 |
| **Then** | 에셋 목록 + 통계 반환 |

### [TC-002] getAssetDetailById - 존재하지 않음

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 존재하지 않는 에셋 ID |
| **When** | getAssetDetailById 호출 |
| **Then** | NotFoundException 발생 |

### [TC-003] moveAsset - 정상 이동

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 에셋과 대상 폴더가 같은 Space에 존재 |
| **When** | moveAsset 호출 |
| **Then** | folderId가 변경됨 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/asset.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
| 2026-02-23 | 구현 완료, 메서드 및 권한 규칙 업데이트 | be-service-builder |
