# 에셋 업로드 페이지 기획서

## 개요

| 항목 | 값 |
|------|-----|
| **URL** | `/assets/new` |
| **기능명** | 에셋 업로드 |
| **설명** | 새로운 에셋(이미지, 비디오, 문서)을 업로드하는 페이지 |

---

## L5. 진입 경로

| 진입점 | 위치 | 트리거 |
|--------|------|--------|
| 목록 페이지 | `/assets` | 업로드 버튼 클릭 |
| 상세 페이지 | `/assets/[id]` | 교체 버튼 클릭 |
| 폴더 내 | `/assets?folderId=xxx` | 업로드 버튼 → 폴더 선택됨 |

---

## L6. 정보 구조

### 사용자 상태

| 상태 | 설명 |
|------|------|
| `uploadingFiles` | 업로드 중인 파일 목록 |
| `selectedFolderId` | 선택된 폴더 ID |

### 서버 상태 (Query)

| Query | 설명 |
|-------|------|
| `useGetFolderTree` | 폴더 트리 조회 |

### Mutation

| Mutation | 설명 |
|----------|------|
| `useCreateAsset` | 에셋 업로드 |

---

## L7. 상호작용

### 7.1 파일 선택

```
사용자: 파일 선택/드래그앤드롭
  │
  ├─── 단일 파일
  │     └─── 즉시 업로드 시작
  │
  └─── 다중 파일
        └─── 순차 업로드 (최대 20개)
```

### 7.2 폴더 선택

```
사용자: 폴더 선택
  │
  └─── selectedFolderId 업데이트
        └─── 업로드 시 folderId 포함
```

### 7.3 업로드 진행

```
업로드 시작
  │
  ├─── uploadingFiles에 항목 추가
  │
  ├─── 진행률 업데이트 (0% → 100%)
  │
  ├─── 성공 시 상태 변경 (success)
  │
  └─── 실패 시 상태 변경 (error)
```

---

## L8. 화면 구성

### 레이아웃

```
PageSurface (raised)
├── Header
│   ├── Title: "에셋 업로드"
│   └── Actions: [목록으로] [완료]
│
└── Content
    ├── 폴더 선택 (SectionSurface)
    │   └── Select 컴포넌트
    │
    ├── 업로드 영역 (SectionSurface)
    │   └── AssetUploader
    │
    └── 업로드 진행 상황 (SectionSurface)
        └── UploadQueue
```

### 컴포넌트 계층

| 레이어 | 컴포넌트 | 위치 |
|--------|----------|------|
| Feature | AssetUploader | `packages/fe-ui/src/components/feature/AssetUploader/` |
| Widget | UploadQueue | `packages/fe-ui/src/components/widget/UploadQueue/` |
| Widget | UploadPanel | `packages/fe-ui/src/components/widget/UploadPanel/` |
| UI | DropZone | `packages/fe-ui/src/components/ui/DropZone/` |
| UI | UploadQueueItem | `packages/fe-ui/src/components/ui/UploadQueueItem/` |

---

## L9. 컴포넌트 스펙

### AssetUploader (Feature)

| Props | 타입 | 설명 |
|-------|------|------|
| `folderId` | `string \| null` | 업로드 대상 폴더 |
| `allowedTypes` | `AssetKind[]` | 허용 타입 |
| `allowedExtensions` | `string[]` | 허용 확장자 |
| `maxFileSize` | `number` | 최대 파일 크기 (bytes) |
| `maxFiles` | `number` | 최대 파일 수 |
| `multiple` | `boolean` | 다중 업로드 허용 |
| `autoUpload` | `boolean` | 자동 업로드 |
| `onUploadStart` | `(files: File[]) => void` | 업로드 시작 |
| `onUploadComplete` | `(assets: unknown[]) => void` | 업로드 완료 |
| `onUploadError` | `(errors: UploadError[]) => void` | 업로드 에러 |
| `onClose` | `() => void` | 닫기 |

### UploadQueue (Widget)

| Props | 타입 | 설명 |
|-------|------|------|
| `items` | `UploadQueueItemData[]` | 업로드 항목 목록 |
| `onCancelAll` | `() => void` | 전체 취소 |
| `onRetryFailed` | `() => void` | 실패 항목 재시도 |

### UploadQueueItemData

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | `string` | 항목 ID |
| `fileName` | `string` | 파일명 |
| `fileSize` | `number` | 파일 크기 |
| `status` | `pending \| uploading \| success \| error` | 상태 |
| `progress` | `number` | 진행률 (0-100) |
| `errorMessage` | `string \| undefined` | 에러 메시지 |

---

## L10. 이벤트 핸들러

### onUploadStart

```typescript
(files: File[]) => void
```

1. 각 파일에 고유 ID 생성
2. `uploadingFiles`에 항목 추가
3. FormData 생성 후 API 호출
4. 진행률 업데이트

### onUploadComplete

```typescript
(assets: unknown[]) => void
```

1. 완료된 항목 상태 변경
2. 성공 알림 (선택)
3. 완료 버튼 표시

### onUploadError

```typescript
(errors: UploadError[]) => void
```

1. 에러 항목 상태 변경
2. 에러 메시지 표시
3. 재시도 버튼 표시

### handleClose

```typescript
() => void
```

1. 목록 페이지로 이동 (`/assets`)

---

## L11. 검증 규칙

### 파일 검증

| 규칙 | 값 | 에러 메시지 |
|------|-----|------------|
| 파일 크기 | ≤ 100MB | "파일 크기는 100MB 이하여야 합니다" |
| 파일 수 | ≤ 20개 | "최대 20개까지 업로드 가능합니다" |
| 파일 타입 | IMAGE, VIDEO, DOCUMENT | "지원하지 않는 파일 형식입니다" |

### 확장자 검증

| 타입 | 허용 확장자 |
|------|------------|
| IMAGE | .jpg, .jpeg, .png, .gif, .webp, .svg |
| VIDEO | .mp4, .mov, .avi, .webm |
| DOCUMENT | .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx |

---

## L12. 접근성

| 항목 | 구현 |
|------|------|
| 키보드 | Tab으로 포커스 이동, Enter로 파일 선택 |
| 스크린리더 | 진행률 상태 읽기 |
| 색상 대비 | 상태별 충분한 대비 |

---

## 구현 대상 (orch-stage 자동 병렬 실행용)

### Feature 컴포넌트

| 컴포넌트 | 병렬 그룹 |
|----------|----------|
| AssetUploader | 0 |

### Widget 컴포넌트

| 컴포넌트 | 병렬 그룹 |
|----------|----------|
| UploadPanel | 0 |
| UploadQueue | 0 |

### UI 컴포넌트

| 컴포넌트 | 병렬 그룹 |
|----------|----------|
| DropZone | 0 |
| UploadQueueItem | 0 |
| FileIcon | 0 |

### 병렬 실행 DAG

```
Level 0: DropZone, UploadQueueItem, FileIcon, UploadPanel, UploadQueue, AssetUploader (모두 독립)
```

---

## 체크리스트

- [ ] PageSurface (raised) 사용
- [ ] AssetUploader Feature 사용
- [ ] 폴더 선택 기능
- [ ] 다중 파일 업로드
- [ ] 진행률 표시
- [ ] 에러 처리
- [ ] 완료 후 목록 이동
