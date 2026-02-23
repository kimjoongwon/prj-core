# AssetViewer Feature 기획서

> 생성일: 2026-02-23
> 수정일: 2026-02-23
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/AssetViewer/

## 역할

에셋 미리보기와 다운로드 기능을 담당하는 Feature 컴포넌트입니다. Asset.kind에 따라 다른 뷰어를 렌더링하며, 줌 컨트롤과 다운로드 기능을 제공합니다.

## 디자인 목업

```
[이미지 뷰어]
┌──────────────────────────────────────┐
│                                      │
│                                      │
│         [이미지 미리보기]             │
│                                      │
│                                      │
│                                      │
│                                      │
└──────────────────────────────────────┘
│  1920 x 1080 · 2.4 MB  [-] 100% [+]  │
│                        [원본 다운로드] │
└──────────────────────────────────────┘

[비디오 뷰어]
┌──────────────────────────────────────┐
│                                      │
│         [비디오 플레이어]             │
│            ▶ ═════○═════ 🔊 ⛶       │
│          00:45 / 02:30               │
│                                      │
└──────────────────────────────────────┘
│  1920 x 1080 · H.264 · 02:30         │
│                        [원본 다운로드] │
└──────────────────────────────────────┘

[다운로드 진행 중]
┌──────────────────────────────────────┐
│                                      │
│         [미리보기]                    │
│                                      │
└──────────────────────────────────────┘
│  1920 x 1080 · 2.4 MB                │
│                    [다운로드 중 45%]   │
└──────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `ready` | 미리보기 준비 | 뷰어 + 다운로드 버튼 |
| `downloading` | 다운로드 중 | 진행률 표시 |
| `error` | 다운로드 실패 | 에러 메시지 + 재시도 버튼 |

## Props

```typescript
interface AssetViewerProps {
  asset: AssetViewerAsset;                     // 에셋 데이터
  previewUrl?: string;                         // 프리뷰 URL
  downloadUrl?: string;                        // 원본 다운로드 URL
  onDownload?: () => void;                     // 다운로드 핸들러
}

interface AssetViewerAsset {
  id: string;
  originalName: string;
  kind: AssetKind;                             // IMAGE | VIDEO | DOCUMENT
  mimeType: string;
  sizeBytes: bigint | number;
  image?: { width: number; height: number; };
  video?: { width: number; height: number; durationMs: number; codec?: string; };
}
```

## 하위 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| AssetPreview | `widget/AssetPreview` | 미리보기 위젯 |
| Button | `@heroui/react` | 다운로드 버튼 |
| HStack | `ui/surfaces/HStack` | 수평 레이아웃 |
| VStack | `ui/surfaces/VStack` | 수직 레이아웃 |

## Store 연결

**없음** (Props로 전달받음)

## 상태 관리 (LocalObservable)

```typescript
const state = useLocalObservable(() => ({
  zoom: 1,
  zoomIn() { this.zoom = Math.min(this.zoom + 0.25, 3); },
  zoomOut() { this.zoom = Math.max(this.zoom - 0.25, 0.25); },
  resetZoom() { this.zoom = 1; },
}));
```

## 이벤트

| 이벤트 | 설명 |
|--------|------|
| `onDownload` | 다운로드 버튼 클릭 시 호출 |

## 타입별 뷰어 렌더링

| kind | 렌더링 | 특이사항 |
|------|--------|----------|
| IMAGE | AssetPreview | 줌 컨트롤 표시 |
| VIDEO | AssetPreview (video 태그) | 비디오 컨트롤 자체 제공 |
| DOCUMENT | AssetPreview | 줌 컨트롤 표시 |

## 줌 컨트롤

- 범위: 25% ~ 300%
- 단계: 25%
- 표시: 이미지/문서 타입만

## 다운로드 로직

```typescript
const handleDownload = () => {
  if (downloadUrl) {
    window.open(downloadUrl, "_blank");
  }
  onDownload?.();
};
```

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 컨테이너 | aspect-video |
| 미리보기 배경 | bg-content2 |
| 미리보기 라운드 | rounded-lg |
| 버튼 색상 | primary |

## 구현 체크리스트

- [x] AssetViewer.tsx
- [x] types (inline)
- [x] index.ts
- [x] AssetPreview 위젯 통합
- [x] 줌 컨트롤 (이미지/문서)
- [x] 다운로드 기능
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 기본 렌더링 | 1 | 0 | 0 | 1 |
| 이미지 뷰어 | 1 | 0 | 0 | 1 |
| 비디오 뷰어 | 1 | 0 | 0 | 1 |
| 다운로드 | 1 | 1 | 0 | 2 |
| 줌 컨트롤 | 1 | 0 | 0 | 1 |

### [TC-001] 이미지 뷰어 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind=IMAGE |
| **When** | AssetViewer 렌더링 |
| **Then** | AssetPreview(IMAGE) + 줌 컨트롤 + 다운로드 버튼 표시 |

### [TC-002] 비디오 뷰어 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind=VIDEO |
| **When** | AssetViewer 렌더링 |
| **Then** | AssetPreview(VIDEO) + 다운로드 버튼 표시 (줌 컨트롤 없음) |

### [TC-003] 다운로드 성공

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | AssetViewer 렌더링됨, downloadUrl 존재 |
| **When** | [원본 다운로드] 버튼 클릭 |
| **Then** | 새 창으로 downloadUrl 열림, onDownload() 호출 |

### [TC-004] 다운로드 URL 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | downloadUrl이 없음 |
| **When** | [원본 다운로드] 버튼 클릭 |
| **Then** | onDownload()만 호출됨 |

### [TC-005] 줌 컨트롤

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | 이미지 뷰어 렌더링됨 |
| **When** | [+], [-] 버튼 클릭 |
| **Then** | 줌 레벨이 25% 단위로 변경됨 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/[assetId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-23 | 초기 생성 | req-feature-planner |
| 2026-02-23 | 구현 완료 | fe-feature-builder |
