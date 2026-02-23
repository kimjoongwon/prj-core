# AssetUploader Feature 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-23
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/AssetUploader/

## 역할

파일 업로드를 담당하는 비즈니스 컴포넌트입니다. DropZone과 UploadQueue를 조합하고 AssetStore와 연결하여 실제 API 업로드를 수행합니다.

## 디자인 목업

```
[기본 상태 - 드래그 영역]
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                         📤                                       │
│              파일을 드래그하여 업로드하세요                       │
│                    또는                                          │
│                  [파일 선택]                                     │
│                                                                 │
│          지원 포맷: JPG, PNG, GIF, MP4, PDF (최대 100MB)         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

[드래그 중]
┌─────────────────────────────────────────────────────────────────┐
│ ▲                                                               │
│ ▲                   여기에 놓으세요!                            │
│ ▲                                                               │
│ ▲              (전체 영역 하이라이트)                           │
│ ▲                                                               │
└─────────────────────────────────────────────────────────────────┘

[업로드 진행 중]
┌─────────────────────────────────────────────────────────────────┐
│ 업로드 중 (3개 파일)                                [전체 취소] │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🖼️ banner.jpg                                     2.4 MB    │ │
│ │ ████████████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░  45%        │ │
│ │                                          [⏸] [✕]           │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🖼️ photo.png                                      1.2 MB    │ │
│ │ ████████████████████████████████████████████████  100% ✓    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 🎬 video.mp4                                      45.2 MB   │ │
│ │ ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  5%         │ │
│ │                                          [⏸] [✕]           │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘

[업로드 완료]
┌─────────────────────────────────────────────────────────────────┐
│ 업로드 완료 (3개)                                    [닫기]     │
├─────────────────────────────────────────────────────────────────┤
│ ✓ banner.jpg - 2.4 MB                                          │
│ ✓ photo.png - 1.2 MB                                           │
│ ✓ video.mp4 - 45.2 MB                                          │
└─────────────────────────────────────────────────────────────────┘

[업로드 실패]
┌─────────────────────────────────────────────────────────────────┐
│ 업로드 실패 (1개)                                    [재시도]   │
├─────────────────────────────────────────────────────────────────┤
│ ✗ large.pdf - 150 MB                                           │
│   파일 크기가 제한을 초과했습니다 (최대 100MB)                  │
└─────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `idle` | 대기 상태 | DropZone 표시 |
| `dragOver` | 드래그 중 | DropZone 하이라이트 |
| `uploading` | 업로드 중 | UploadQueue + 진행률 바 |
| `completed` | 완료 | 완료 목록 + 닫기 버튼 |
| `error` | 실패 | 에러 메시지 + 재시도 버튼 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| Store | AssetStore | 업로드 상태 관리, API 호출 |
| Widget | UploadPanel | 파일 선택 + 큐 UI 조합 |
| Widget | UploadQueue | 업로드 큐 표시 |
| UI | DropZone | 파일 드래그 영역 |
| UI | UploadQueueItem | 개별 파일 항목 |
| UI | FileIcon | 파일 타입 아이콘 |

## Props

```typescript
interface AssetUploaderProps {
  folderId?: string | null;                    // 업로드 대상 폴더
  allowedTypes?: AssetKind[];                  // 허용 타입 (IMAGE, VIDEO, DOCUMENT)
  allowedExtensions?: string[];                // 허용 확장자 (예: [".jpg", ".png"])
  maxFileSize?: number;                        // 최대 파일 크기 (bytes, 기본: 104857600 = 100MB)
  maxFiles?: number;                           // 최대 파일 수 (기본: 20)
  multiple?: boolean;                          // 다중 업로드 허용 (기본: true)
  autoUpload?: boolean;                        // 자동 업로드 (기본: true)
  showProgress?: boolean;                      // 진행률 표시 (기본: true)
  onUploadStart?: (files: File[]) => void;     // 업로드 시작 핸들러
  onUploadProgress?: (fileId: string, progress: number) => void; // 진행률 핸들러
  onUploadComplete?: (assets: Asset[]) => void; // 완료 핸들러
  onUploadError?: (errors: UploadError[]) => void; // 에러 핸들러
  onClose?: () => void;                        // 닫기 핸들러
  className?: string;                          // 추가 클래스
}

interface UploadError {
  file: File;
  message: string;
  code: "FILE_TOO_LARGE" | "INVALID_TYPE" | "TOO_MANY_FILES" | "DUPLICATE_FILE" | "NETWORK_ERROR";
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| AssetStore | isUploading | 업로드 중 여부 확인 |
| AssetStore | uploadQueue | 업로드 큐 상태 |
| AssetStore | uploadProgress | 전체 업로드 진행률 |
| AssetStore | uploadFiles() | 파일 업로드 실행 |
| AssetStore | cancelUpload() | 업로드 취소 |
| AssetStore | pauseUpload() | 업로드 일시정지 |
| AssetStore | resumeUpload() | 업로드 재개 |
| AssetStore | retryUpload() | 업로드 재시도 |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| `onUploadStart` | 파일 선택/드롭 | O (files) |
| `onUploadProgress` | 진행률 업데이트 | O (fileId, progress) |
| `onUploadComplete` | 모든 파일 업로드 완료 | O (assets) |
| `onUploadError` | 업로드 실패 | O (errors) |
| `onClose` | 닫기 버튼 클릭 | O |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 기획서 |
|----------|------|--------|
| UploadPanel | widget | `widget/UploadPanel/index.spec.md` |
| UploadQueue | widget | `widget/UploadQueue/index.spec.md` |
| DropZone | ui | `ui/DropZone/index.spec.md` |
| UploadQueueItem | ui | `ui/UploadQueueItem/index.spec.md` |
| FileIcon | ui | `ui/FileIcon/index.spec.md` |
| ProgressBar | ui | `ui/ProgressBar/index.spec.md` |
| Button | ui | `ui/Button/index.spec.md` |

## 파일 검증

| 항목 | 검증 내용 | 에러 코드 |
|------|----------|----------|
| 파일 크기 | maxFileSize 초과 | FILE_TOO_LARGE |
| 파일 타입 | allowedExtensions 불일치 | INVALID_TYPE |
| 파일 수 | maxFiles 초과 | TOO_MANY_FILES |
| 중복 파일 | 동일 파일명 존재 | DUPLICATE_FILE |
| 네트워크 | 업로드 실패 | NETWORK_ERROR |

## API 호출 흐름

```
1. 파일 선택/드롭
   ↓
2. 파일 검증 (크기, 타입, 중복)
   ↓
3. AssetStore.uploadFiles() 호출
   ↓
4. POST /api/v1/assets (파일별 순차 호출)
   ↓
5. 진행률 업데이트 (onUploadProgress)
   ↓
6. 완료/실패 처리 (onUploadComplete / onUploadError)
```

## 구현 체크리스트

- [ ] index.tsx
- [ ] observer 적용
- [ ] AssetStore 주입
- [ ] useAssetUpload 훅
- [ ] Props 타입 정의
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 파일 선택 | 1 | 0 | 0 | 1 |
| 드래그앤드롭 | 1 | 0 | 1 | 2 |
| 진행률 표시 | 1 | 0 | 0 | 1 |
| 완료 상태 | 1 | 0 | 0 | 1 |
| 에러 처리 | 0 | 3 | 0 | 3 |
| **합계** | **4** | **3** | **1** | **8** |

### [TC-001] 파일 선택 업로드

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetUploader 렌더링됨 |
| **When** | 파일 선택 버튼 클릭 → 파일 선택 |
| **Then** | onUploadStart 호출 → 업로드 시작 |

### [TC-002] 드래그앤드롭 업로드

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetUploader 렌더링됨 |
| **When** | 파일 드래그 → 드롭 |
| **Then** | onUploadStart 호출 → 업로드 시작 |

### [TC-003] 드래그 취소

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | AssetUploader 렌더링됨 |
| **When** | 파일 드래그 → 영역 밖으로 이동 |
| **Then** | idle 상태로 복귀 |

### [TC-004] 파일 크기 초과 에러

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | maxFileSize=100MB |
| **When** | 150MB 파일 업로드 시도 |
| **Then** | onUploadError({ code: "FILE_TOO_LARGE" }) |

### [TC-005] 파일 타입 에러

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | allowedExtensions=[".jpg", ".png"] |
| **When** | .exe 파일 업로드 시도 |
| **Then** | onUploadError({ code: "INVALID_TYPE" }) |

### [TC-006] 네트워크 에러

**분류:** Error Path

| 구분 | 내용 |
|------|------|
| **Given** | 파일 업로드 중 |
| **When** | 네트워크 연결 끊김 |
| **Then** | onUploadError({ code: "NETWORK_ERROR" }) |

### [TC-007] 업로드 완료

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 파일 업로드 중 |
| **When** | 모든 파일 업로드 완료 |
| **Then** | onUploadComplete(assets) 호출 |

### [TC-008] 진행률 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 파일 업로드 중 |
| **When** | 진행률 업데이트 |
| **Then** | ProgressBar가 0% → 100%로 업데이트 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/new/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | req-feature-planner |
| 2026-02-23 | 하위 컴포넌트 기획서 연결 및 API 흐름 추가 | orch-screen-planner |
