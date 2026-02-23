# FolderNavigator Feature 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/FolderNavigator/

## 역할

AssetStore의 currentFolderId와 연결된 폴더 탐색 컴포넌트입니다. 폴더 트리와 브레드크럼을 표시하며 폴더 선택 시 Store를 업데이트합니다.

## 디자인 목업

```
┌────────────────────────┐
│ 🏠 루트 > 📂 이미지    │  ← 브레드크럼
├────────────────────────┤
│ 🏠 모든 에셋           │
│                        │
│ 📂 루트                │
│   📂 이미지 ◀          │  ← 현재 선택됨
│   📂 비디오            │
│   📂 문서              │
│   📂 보관함            │
│                        │
│ 📂 공유 폴더           │
│   📂 팀 자료           │
│   📂 프로젝트          │
└────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `root` | 루트 선택 | "모든 에셋" 하이라이트 |
| `folder` | 폴더 선택 | 해당 폴더 하이라이트 |
| `nested` | 중첩 폴더 | 브레드크럼에 경로 표시 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | AssetStore | 현재 폴더 상태 |
| UI | VStack, HStack | 레이아웃 |
| Icon | lucide-react | 폴더 아이콘 |

## Props

```typescript
interface FolderItem {
  id: string;              // 폴더 ID
  name: string;            // 폴더 이름
  parentId: string | null; // 상위 폴더 ID
  children?: FolderItem[]; // 하위 폴더 목록
}

interface FolderNavigatorProps {
  folders?: FolderItem[];                      // 폴더 트리 데이터
  showCreateButton?: boolean;                  // 폴더 생성 버튼 표시 (기본: true)
  className?: string;                          // 추가 클래스
  onFolderSelect?: (folderId: string | null) => void;  // 폴더 선택 핸들러
  onCreateFolder?: (parentId: string | null) => void;  // 폴더 생성 핸들러
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| AssetStore | currentFolderId | 현재 폴더 ID |
| AssetStore | setCurrentFolder() | 폴더 변경 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onFolderSelect` | 폴더 클릭 | O (folderId) |
| `onCreateFolder` | 폴더 생성 버튼 클릭 | O (parentId) |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| Button | ui | HeroUI |
| VStack, HStack | ui | `ui/surfaces` |

## 레이아웃 구조

```
┌────────────────────────┐
│ [Breadcrumb]           │
├────────────────────────┤
│ [FolderTree]           │
│ - 모든 에셋            │
│ - 폴더 목록            │
│   - 하위 폴더          │
└────────────────────────┘
```

## 구현 체크리스트

- [x] FolderNavigator.tsx
- [x] observer 적용
- [x] AssetStore 연결
- [x] Props 타입 정의
- [x] index.ts export
- [x] 브레드크럼 네비게이션 구현
- [x] 중첩 폴더 렌더링

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 초기 렌더링 | 1 | 0 | 0 | 1 |
| 폴더 선택 | 1 | 0 | 0 | 1 |
| 브레드크럼 | 1 | 0 | 0 | 1 |
| 중첩 폴더 | 1 | 0 | 1 | 2 |

### [TC-001] 폴더 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | FolderNavigator 렌더링됨 |
| **When** | 폴더 클릭 |
| **Then** | setCurrentFolder() 호출, onFolderSelect 콜백 실행 |

### [TC-002] 브레드크럼 네비게이션

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 중첩 폴더 선택됨 |
| **When** | 브레드크럼에서 상위 폴더 클릭 |
| **Then** | 해당 폴더로 이동 |

### [TC-003] 루트 폴더 선택

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 특정 폴더 선택됨 |
| **When** | "모든 에셋" 클릭 |
| **Then** | currentFolderId = null, 브레드크럼 초기화 |

## 상위 기획서

- `apps/admin/src/app/(admin)/assets/page.spec.md`
- `feature/AssetManager`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | fe-feature-builder |
| 2026-02-23 | 구현 체크리스트 업데이트 | fe-feature-builder |
