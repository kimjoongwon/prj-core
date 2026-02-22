# Asset Entity 기획서

> 생성일: 2026-02-22
> 타입: entity
> 위치: packages/be-entity/src/asset.entity.ts

## 역할

미디어 리소스(이미지, 비디오, 문서)의 공통 메타데이터를 관리하는 베이스 엔티티입니다. CTI(Class Table Inheritance) 패턴을 사용하여 타입별 상세 정보는 Image, Video, Document 엔티티로 분리합니다.

## 필드

| 필드 | 타입 | 제약조건 | 기본값 | 설명 |
|------|------|----------|--------|------|
| id | UUID | PK, required | uuid() | 고유 식별자 |
| spaceId | UUID | FK, required | - | 소속 Space ID |
| folderId | UUID | FK, required | - | 소속 폴더 ID |
| kind | AssetKind | required | - | 에셋 타입 (IMAGE/VIDEO/DOCUMENT) |
| status | AssetStatus | required | UPLOADING | 업로드 상태 |
| originalName | String | required | - | 원본 파일명 |
| storageKey | String | required, unique | - | 스토리지 키 |
| mimeType | String | required | - | MIME 타입 |
| extension | String | optional | - | 파일 확장자 |
| sizeBytes | BigInt | required | - | 파일 크기 (bytes) |
| checksum | String | optional | - | 파일 체크섬 (MD5/SHA256) |
| metadata | Json | optional | - | 추가 메타데이터 |
| createdAt | DateTime | required | now() | 생성 일시 |
| updatedAt | DateTime | required | now() | 수정 일시 |
| removedAt | DateTime | optional | - | 삭제 일시 (소프트 삭제) |

## Enum

### AssetKind

| 값 | 설명 |
|-----|------|
| IMAGE | 이미지 파일 |
| VIDEO | 비디오 파일 |
| DOCUMENT | 문서 파일 |

### AssetStatus

| 값 | 설명 |
|-----|------|
| UPLOADING | 업로드 진행 중 |
| READY | 업로드 완료, 사용 가능 |
| FAILED | 업로드 실패 |

## 관계

| 관계 | 대상 Entity | 타입 | 설명 |
|------|-------------|------|------|
| belongsTo | Space | N:1 | 소속 Space |
| belongsTo | Folder | N:1 | 소속 폴더 |
| hasOne | Image | 1:0..1 | 이미지 상세 정보 (CTI) |
| hasOne | Video | 1:0..1 | 비디오 상세 정보 (CTI) |
| hasOne | Document | 1:0..1 | 문서 상세 정보 (CTI) |
| hasMany | Derivative | 1:N | 파생 리소스 |
| hasMany | AlbumEntry | 1:N | 앨범 엔트리 |
| hasMany | Album | 1:N | 커버 이미지로 사용되는 앨범 |

## 도메인 메서드

| 메서드 | 반환 | 설명 |
|--------|------|------|
| isReady() | boolean | 업로드 완료 여부 확인 |
| isImage() | boolean | 이미지 타입 여부 확인 |
| isVideo() | boolean | 비디오 타입 여부 확인 |
| isDocument() | boolean | 문서 타입 여부 확인 |
| getExtension() | string | 확장자 반환 (점 제외) |
| getHumanReadableSize() | string | 사람이 읽기 쉬운 크기 반환 (예: "2.4 MB") |
| softDelete() | void | 소프트 삭제 수행 |

## 비즈니스 규칙

- Asset.kind와 상세 테이블 일치 강제 (IMAGE -> Image, VIDEO -> Video, DOCUMENT -> Document)
- 서로 다른 상세 테이블 동시 존재 금지 (예: Image와 Video 동시 존재 불가)
- 소프트 삭제 정책: removedAt이 설정되면 삭제된 것으로 간주
- storageKey는 Space 내에서 유니크
- 업로드 완료 시 status를 READY로 변경

## 구현 체크리스트

- [ ] asset.entity.ts
- [ ] AbstractEntity 상속
- [ ] Prisma 타입 implements
- [ ] index.ts export 추가
- [ ] 단위 테스트 (Jest)

## 테스트 케이스

> 구현 도구: Jest

### 테스트 커버리지

| 도메인 메서드 | Happy Path | Error Path | Edge Case | 합계 |
|-------------|:----------:|:----------:|:---------:|:----:|
| isReady() | 1 | 0 | 1 | 2 |
| isImage/Video/Document() | 3 | 0 | 0 | 3 |
| getHumanReadableSize() | 3 | 0 | 1 | 4 |
| softDelete() | 1 | 0 | 0 | 1 |

### [TC-001] isReady() - READY 상태

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | status가 READY인 Asset |
| **When** | isReady() 호출 |
| **Then** | true 반환 |

### [TC-002] isReady() - UPLOADING 상태

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | status가 UPLOADING인 Asset |
| **When** | isReady() 호출 |
| **Then** | false 반환 |

### [TC-003] getHumanReadableSize() - KB

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | sizeBytes가 1024인 Asset |
| **When** | getHumanReadableSize() 호출 |
| **Then** | "1 KB" 반환 |

### [TC-004] getHumanReadableSize() - MB

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | sizeBytes가 2,400,000인 Asset |
| **When** | getHumanReadableSize() 호출 |
| **Then** | "2.4 MB" 반환 |

## 상위 기획서

- `apps/admin/src/app/(admin)/app.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | orch-requirement |
