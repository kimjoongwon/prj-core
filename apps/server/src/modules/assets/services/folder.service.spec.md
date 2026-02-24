# Folder Service 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: service
> 위치: apps/server/src/module/assets/services/folder.service.ts

## 역할

폴더(Folder) CRUD, 계층 구조 관리, 경로 생성/검증, Space 기반 접근 권한을 담당합니다. 에셋 저장소의 디렉토리 구조를 관리하며, 폴더 이동 시 하위 트리의 경로도 함께 업데이트합니다.

## 담당 도메인

Folder, Space

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Repository | FolderRepository | 폴더 데이터 접근 |
| Service | ClsService | CLS 컨텍스트 접근 (Space ID, Tenant) |

## 공개 메서드

### 단일 조회

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| getFolderById | folderId: string | Promise\<Folder\> | ID로 폴더 조회 (권한 확인 포함) |
| getFolderWithChildren | folderId: string | Promise\<Folder\> | ID로 폴더 조회 (하위 폴더 포함) |
| getFolderByPath | path: string | Promise\<Folder \| null\> | 경로로 폴더 조회 |
| getFoldersByIds | ids: string[] | Promise\<Folder[]\> | 여러 ID로 폴더 목록 조회 |

### 목록 조회

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| getFoldersBySpace | query: FolderQueryDto | Promise\<{folders, totalCount}\> | Space 내 폴더 목록 (페이지네이션) |
| getChildFolders | parentFolderId: string | Promise\<Folder[]\> | 하위 폴더 목록 조회 |
| getRootFolders | - | Promise\<Folder[]\> | 루트 폴더 목록 조회 |

### 트리 조회

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| getFolderTree | spaceId: string | Promise\<Folder[]\> | 전체 폴더 트리 조회 |
| getSubTree | folderId: string | Promise\<FolderTreeNode\> | 특정 폴더의 하위 트리 조회 |

### 생성

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| createFolder | dto: CreateFolderDto | Promise\<Folder\> | 폴더 생성 (경로 자동 생성) |
| createRootFolder | params | Promise\<Folder\> | 루트 폴더 생성 |

### 수정

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| updateFolder | folderId, dto: UpdateFolderDto | Promise\<Folder\> | 폴더 수정 (이름 변경 시 하위 경로 자동 업데이트) |
| renameFolder | folderId, newName | Promise\<Folder\> | 폴더 이름 변경 (하위 경로 자동 업데이트) |
| updateFolderSortOrder | folderId, sortOrder | Promise\<Folder\> | 정렬 순서 변경 |

### 이동

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| moveFolder | folderId, targetFolderId? | Promise\<Folder\> | 폴더 이동 (하위 트리 경로 자동 업데이트) |

### 삭제

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| deleteFolder | folderId: string | Promise\<Folder\> | 소프트 삭제 (하위 폴더 있으면 실패) |
| restoreFolder | folderId: string | Promise\<Folder\> | 폴더 복원 (전체 접근 권한 필요) |

### 집계

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| countFoldersBySpace | - | Promise\<number\> | Space 내 폴더 수 |
| countChildFolders | folderId: string | Promise\<number\> | 하위 폴더 수 |
| existsFolder | folderId: string | Promise\<boolean\> | 폴더 존재 여부 |
| existsPath | path: string | Promise\<boolean\> | 경로 존재 여부 |

## 비즈니스 규칙

### Space 접근 권한

- System Space (ROOT Category)인 경우: 전체 Space 폴더 접근 가능
- 일반 Space인 경우: 해당 Space 폴더만 접근 가능
- `canAccessAllSpaces(tenant)` 함수로 권한 확인

### 폴더 생성

- 동일 위치에 같은 이름의 폴더 생성 불가
- 경로는 부모 폴더 경로 + 폴더 이름으로 자동 생성
- 루트 폴더는 parentFolderId가 null

### 폴더 이름 규칙

- 빈 문자열 불가
- 최대 255자
- 금지된 문자: `/ \ : * ? " < > |`

### 폴더 이동

- 자기 자신의 하위 폴더로 이동 불가
- 이동할 위치에 동일 이름의 폴더가 있으면 이동 불가
- 이동 시 하위 폴더의 경로도 함께 업데이트

### 폴더 이름 변경

- 이름 변경 시 하위 폴더의 경로도 함께 업데이트

### 폴더 삭제

- 하위 폴더가 있으면 삭제 불가 (먼저 하위 폴더 삭제 필요)
- 폴더 내 에셋이 있으면 삭제 불가 (TODO: AssetRepository 연동 후 구현)
- Soft Delete (removedAt 필드 업데이트)

### 폴더 복원

- 전체 접근 권한(FULL_ACCESS)이 있는 경우에만 복원 가능

## 에러 처리

| 상황 | 에러 타입 | 메시지 |
|------|----------|--------|
| Space 미선택 | BadRequestException | "Space가 선택되지 않았습니다." |
| 폴더 없음 | NotFoundException | "폴더를 찾을 수 없습니다." |
| Space 접근 권한 없음 | NotFoundException | "폴더를 찾을 수 없습니다." (보안상 동일 메시지) |
| 중복 이름 | BadRequestException | "같은 위치에 동일한 이름의 폴더가 이미 존재합니다." |
| 자신의 하위로 이동 | BadRequestException | "자신의 하위 폴더로 이동할 수 없습니다." |
| 하위 폴더 있음 | BadRequestException | "하위 폴더가 있는 폴더는 삭제할 수 없습니다. 먼저 하위 폴더를 삭제해주세요." |
| 복원 권한 없음 | BadRequestException | "삭제된 폴더 복원은 전체 접근 권한이 필요합니다." |
| 빈 이름 | BadRequestException | "폴더 이름은 비워둘 수 없습니다." |
| 이름 길이 초과 | BadRequestException | "폴더 이름은 255자를 초과할 수 없습니다." |
| 금지된 문자 | BadRequestException | "폴더 이름에 사용할 수 없는 문자가 포함되어 있습니다..." |

## 권한 체크

| 메서드 | 필요 권한 | 체크 방식 |
|--------|----------|----------|
| getFolderById | VIEW | Space 멤버십 확인 |
| getFolderTree | VIEW | Space 멤버십 확인 |
| createFolder | MANAGE | Space 관리 권한 확인 |
| updateFolder | MANAGE | Space 관리 권한 확인 |
| moveFolder | MANAGE | Space 관리 권한 확인 |
| deleteFolder | MANAGE | Space 관리 권한 확인 |
| restoreFolder | FULL_ACCESS | System Space (ROOT) 확인 |

## 타입 정의

### FolderTreeNode

```typescript
interface FolderTreeNode extends Folder {
  children: FolderTreeNode[];
}
```

### MoveFolderResult

```typescript
interface MoveFolderResult {
  folder: Folder;
  affectedCount: number; // 경로가 변경된 폴더 수 (본인 + 하위 폴더)
}
```

## 구현 체크리스트

- [x] folder.service.ts
- [x] `@Injectable()` 데코레이터
- [x] FolderTreeNode 타입 정의
- [x] MoveFolderResult 타입 정의
- [x] Space 접근 권한 확인 로직
- [x] 폴더 생성/수정/삭제
- [x] 폴더 이동 (하위 트리 경로 업데이트)
- [x] 폴더 이름 검증
- [x] Controller 호환 메서드 (getFoldersBySpace, updateFolder)
- [ ] 단위 테스트 (Jest)
- [ ] 통합 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| getFolderById | 1 | 2 | 0 | 3 |
| getFolderTree | 1 | 0 | 0 | 1 |
| createFolder | 1 | 2 | 0 | 3 |
| updateFolder | 1 | 2 | 1 | 4 |
| moveFolder | 1 | 3 | 0 | 4 |
| deleteFolder | 1 | 2 | 0 | 3 |
| validateFolderName | 0 | 3 | 0 | 3 |

### [TC-001] getFolderById - 정상 조회

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 폴더가 존재하고, 같은 Space ID 설정됨 |
| **When** | getFolderById 호출 |
| **Then** | Folder 인스턴스 반환 |

### [TC-002] getFolderById - 존재하지 않음

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 존재하지 않는 폴더 ID |
| **When** | getFolderById 호출 |
| **Then** | NotFoundException 발생 |

### [TC-003] getFolderById - 다른 Space

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 다른 Space의 폴더 ID, 전체 접근 권한 없음 |
| **When** | getFolderById 호출 |
| **Then** | NotFoundException 발생 (보안상 폴더 없음과 동일 메시지) |

### [TC-004] createFolder - 정상 생성

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 유효한 CreateFolderDto |
| **When** | createFolder 호출 |
| **Then** | 폴더 생성, 경로 자동 생성됨 |

### [TC-005] createFolder - 중복 이름

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 같은 위치에 동일 이름의 폴더 존재 |
| **When** | createFolder 호출 |
| **Then** | BadRequestException 발생 |

### [TC-006] moveFolder - 정상 이동

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 폴더와 대상 상위 폴더가 같은 Space에 존재 |
| **When** | moveFolder 호출 |
| **Then** | 폴더 이동, 하위 폴더 경로도 업데이트됨 |

### [TC-007] moveFolder - 자신의 하위로 이동

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 이동할 폴더의 하위 폴더로 이동 시도 |
| **When** | moveFolder 호출 |
| **Then** | BadRequestException 발생 |

### [TC-008] updateFolder - 이름 변경

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 폴더 존재, 유효한 UpdateFolderDto |
| **When** | updateFolder 호출 |
| **Then** | 이름 변경, 하위 폴더 경로도 업데이트됨 |

### [TC-009] deleteFolder - 하위 폴더 있음

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 하위 폴더가 있는 폴더 |
| **When** | deleteFolder 호출 |
| **Then** | BadRequestException 발생 |

### [TC-010] validateFolderName - 금지된 문자

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 금지된 문자가 포함된 이름 (예: "폴더/이름") |
| **When** | createFolder 호출 |
| **Then** | BadRequestException 발생 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/folder.entity.spec.md`
- `apps/server/src/module/assets/repositories/folder.repository.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | be-service-builder |
| 2026-02-23 | Controller 호환 메서드 추가 (updateFolder, getFoldersBySpace) | be-service-builder |
