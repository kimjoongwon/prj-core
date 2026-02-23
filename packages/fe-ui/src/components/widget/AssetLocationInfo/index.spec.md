# AssetLocationInfo Widget 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AssetLocationInfo/

## 역할

에셋의 소속 폴더와 앨범 정보를 표시하는 컴포넌트입니다. 클릭 시 해당 폴더/앨범으로 이동할 수 있습니다.

## 디자인 목업

```
┌──────────────────────────────────────────────────────────────────┐
│ 소속 정보                                                         │
├──────────────────────────────────────────────────────────────────┤
│ 폴더        📁 2024 시즌 포스터                         [이동]    │
│ 앨범        📷 마케팅 자료 (3장)                        [보기]    │
│            📷 SNS 썸네일 (12장)                         [보기]    │
└──────────────────────────────────────────────────────────────────┘

[앨범 없는 경우]
┌──────────────────────────────────────────────────────────────────┐
│ 소속 정보                                                         │
├──────────────────────────────────────────────────────────────────┤
│ 폴더        📁 루트 폴더                               [이동]    │
│ 앨범        속한 앨범이 없습니다                                 │
└──────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 로딩 중 | Skeleton |
| `hasData` | 데이터 존재 | 폴더 + 앨범 목록 표시 |
| `noAlbums` | 앨범 없음 | "속한 앨범이 없습니다" 메시지 |

## Props

```typescript
interface AssetLocationInfoProps {
  folder: Folder;                                // 소속 폴더
  albums: Album[];                               // 소속 앨범 목록
  onNavigateFolder: (folderId: string) => void;  // 폴더 이동 핸들러
  onNavigateAlbum: (albumId: string) => void;    // 앨범 이동 핸들러
  maxAlbums?: number;                            // 표시할 최대 앨범 수 (기본값: 5)
  showAlbumCount?: boolean;                      // 앨범 내 에셋 수 표시 (기본값: true)
  className?: string;                            // 추가 클래스
}

interface Folder {
  id: string;
  name: string;
  path: string;
}

interface Album {
  id: string;
  name: string;
  assetCount?: number;   // 앨범 내 에셋 수
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Card | `ui/Card` | 패널 컨테이너 |
| Button | `ui/Button` | 이동/보기 버튼 |
| Link | `ui/Link` | 폴더/앨범 링크 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `folderIcon` | 폴더 아이콘 커스터마이징 |
| `albumIcon` | 앨범 아이콘 커스터마이징 |
| `emptyAlbums` | 앨범 없을 때 표시 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 행 높이 | 44px |
| 라운드 | rounded-xl |
| 배경 | bg-content1 |
| 아이콘 크기 | 20px |

## 구현 체크리스트

- [ ] index.tsx
- [ ] 앨범 수 제한 처리
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 기본 렌더링 | 1 | 0 | 0 | 1 |
| 폴더 이동 | 1 | 0 | 0 | 1 |
| 앨범 이동 | 1 | 0 | 0 | 1 |
| 앨범 없음 | 1 | 0 | 0 | 1 |
| 앨범 수 제한 | 1 | 0 | 0 | 1 |

### [TC-001] 기본 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | folder, albums 데이터 전달됨 |
| **When** | AssetLocationInfo 렌더링 |
| **Then** | 폴더와 앨범 목록이 표시됨 |

### [TC-002] 폴더 이동

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetLocationInfo 렌더링됨 |
| **When** | [이동] 버튼 클릭 |
| **Then** | onNavigateFolder(folder.id) 호출 |

### [TC-003] 앨범 이동

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetLocationInfo 렌더링됨 |
| **When** | 앨범의 [보기] 버튼 클릭 |
| **Then** | onNavigateAlbum(album.id) 호출 |

### [TC-004] 앨범 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | albums=[] |
| **When** | AssetLocationInfo 렌더링 |
| **Then** | "속한 앨범이 없습니다" 메시지 표시 |

### [TC-005] 앨범 수 제한

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | albums.length=10, maxAlbums=5 |
| **When** | AssetLocationInfo 렌더링 |
| **Then** | 5개 앨범만 표시 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/[assetId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | req-widget-planner |
