# Folder Service 기획서

> 생성일: 2026-02-22
> 타입: service
> 위치: apps/server/src/module/folders/folder.service.ts

## 역할

폴더(Folder) CRUD 및 계층 구조 관리 비즈니스 로직을 담당합니다. 트리 구조 조회, 순환 참조 방지 등을 처리합니다.

## 담당 도메인

Folder

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Repository | FolderRepository | 폴더 데이터 접근 |

## 공개 메서드

| 메서드 | 파라미터 | 반환값 | 설명 |
|--------|----------|--------|------|
| findById | id: string | Folder | 단일 폴더 조회 |
| findBySpace | query: FolderQueryDto | GetFoldersResult | Space별 전체 폴더 목록 (페이지네이션) |
| getTree | spaceId: string | FolderTreeNode[] | 트리 구조로 반환 |
| getChildren | parentFolderId: string | Folder[] | 하위 폴더 목록 |
| create | dto: CreateFolderDto | Folder | 폴더 생성 |
| update | id: string, dto: UpdateFolderDto | Folder | 폴더 수정 |
| moveTo | id: string, targetParentId: string \| null | Folder | 상위 폴더 변경 |
| softDelete | id: string | Folder | 소프트 삭제 |
| restore | id: string | Folder | 폴더 복원 |
| isDescendant | folderId: string, potentialAncestorId: string | boolean | 하위 폴더 여부 확인 |

## 비즈니스 규칙

### 폴더 생성

- 같은 상위 폴더 내에서 이름 중복 불가
- path는 자동 계산 (부모 path + "/" + name)

### 폴더 이동

- 순환 참조 금지: 자기 자신 또는 자신의 하위 폴더를 상위로 설정 불가
- 같은 상위 폴더 내에서 이름 중복 불가
- 이동 시 하위 모든 폴더의 path 갱신 필요

### 삭제

- 하위 폴더가 있으면 삭제 불가 (에러)
- 폴더 내 에셋이 있으면 삭제 불가 (에러)

## 에러 처리

| 상황 | 에러 코드 | 메시지 |
|------|----------|--------|
| 폴더 없음 | 404 | "폴더를 찾을 수 없습니다" |
| 순환 참조 | 400 | "하위 폴더를 상위 폴더로 설정할 수 없습니다" |
| 이름 중복 | 409 | "같은 위치에 같은 이름의 폴더가 이미 존재합니다" |
| 하위 폴더 존재 | 400 | "하위 폴더가 있어 삭제할 수 없습니다" |
| 에셋 존재 | 400 | "폴더에 에셋이 있어 삭제할 수 없습니다" |

## 권한 체크

| 메서드 | 필요 권한 | 체크 방식 |
|--------|----------|----------|
| findById | VIEW | Space 멤버십 확인 |
| findBySpace | VIEW | Space 멤버십 확인 |
| create | MANAGE | Space 관리 권한 확인 |
| update | MANAGE | Space 관리 권한 확인 |
| moveTo | MANAGE | Space 관리 권한 확인 |
| softDelete | MANAGE | Space 관리 권한 확인 |

## 구현 체크리스트

- [x] folder.service.ts
- [x] folder.repository.ts
- [ ] 단위 테스트 (Jest)
- [ ] 통합 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|--------|:----------:|:----------:|:---------:|:----:|
| findById | 1 | 1 | 0 | 2 |
| getTree | 1 | 0 | 1 | 2 |
| create | 1 | 1 | 0 | 2 |
| moveTo | 1 | 2 | 0 | 3 |
| softDelete | 1 | 2 | 0 | 3 |

### [TC-001] moveTo - 정상 이동

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 폴더 A가 루트에 있음 |
| **When** | moveTo(A, targetParentId=B) 호출 |
| **Then** | parentFolderId=B로 변경, path 갱신 |

### [TC-002] moveTo - 순환 참조

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 폴더 B가 폴더 A의 하위 |
| **When** | moveTo(A, targetParentId=B) 호출 |
| **Then** | BadRequestException 발생 |

### [TC-003] softDelete - 하위 폴더 존재

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 폴더 A에 하위 폴더 B가 있음 |
| **When** | softDelete(A) 호출 |
| **Then** | BadRequestException 발생 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`
- `packages/be-entity/src/folder.entity.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
| 2026-02-24 | Service 및 Repository 구현 완료 | service-builder |
