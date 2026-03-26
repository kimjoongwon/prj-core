# AssetPreview Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/AssetPreview/

## 역할

에셋의 미리보기를 표시하는 컴포넌트입니다. 이미지, 비디오, 문서 타입에 따라 적절한 뷰어를 렌더링합니다.

## 디자인 목업

```
[이미지 미리보기]
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                                                                     │
│                         [이미지 표시]                               │
│                                                                     │
│                                                                     │
│                                                                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
│  1920 x 1080 · 2.4 MB                                               │

[비디오 미리보기]
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                         [비디오 플레이어]                            │
│                            ▶  ═══════○═══════  🔊  ⛶               │
│                          00:45 / 02:30                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
│  1920 x 1080 · H.264 · 02:30                                        │

[문서 미리보기 (PDF)]
┌─────────────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────────────┐ │
│ │                         PDF 뷰어                                │ │
│ │                                                                 │ │
│ │   페이지 1/15                                                   │ │
│ │                                                                 │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                       < 1 2 3 ... 15 >  🔍+  🔍-                    │
└─────────────────────────────────────────────────────────────────────┘
│  guide.pdf · 15페이지 · 2.1 MB                                      │

[문서 미리보기 (기타)]
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                            📄                                        │
│                         manual.xlsx                                 │
│                                                                     │
│              이 파일 형식은 미리보기를 지원하지 않습니다             │
│                                                                     │
│                        [원본 다운로드]                               │
└─────────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `loading` | 로딩 중 | Skeleton + 스피너 |
| `ready` | 로드 완료 | 실제 미리보기 표시 |
| `error` | 로드 실패 | 에러 메시지 + 재시도 버튼 |
| `unsupported` | 지원하지 않는 타입 | 파일 정보 + 다운로드 버튼 |

## Props

```typescript
interface AssetPreviewProps {
  asset: Asset;                                // 에셋 데이터
  previewUrl?: string;                         // 프리뷰 URL (Derivative)
  originalUrl?: string;                        // 원본 URL
  width?: number | string;                     // 너비
  height?: number | string;                    // 높이
  showInfo?: boolean;                          // 하단 정보 표시 여부
  autoPlay?: boolean;                          // 비디오 자동 재생
  controls?: boolean;                          // 비디오 컨트롤 표시
  onDownload?: (asset: Asset) => void;         // 다운로드 핸들러
  onLoad?: () => void;                         // 로드 완료 핸들러
  onError?: (error: Error) => void;            // 에러 핸들러
  className?: string;                          // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| ImageViewer | `ui/ImageViewer` | 이미지 뷰어 (줌, 팬) |
| VideoPlayer | `ui/VideoPlayer` | 비디오 플레이어 |
| PdfViewer | `ui/PdfViewer` | PDF 뷰어 |
| Button | `ui/Button` | 다운로드 버튼 |
| Skeleton | `ui/Skeleton` | 로딩 스켈레톤 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `overlay` | 미리보기 위 오버레이 |
| `info` | 하단 정보 영역 커스터마이징 |
| `unsupported` | 지원하지 않는 타입일 때 표시 |
| `error` | 에러 상태 커스터마이징 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 배경 | bg-content2 |
| 라운드 | rounded-xl |
| 최소 높이 | 300px |
| 최대 높이 | 600px |
| 하단 정보 높이 | 40px |

## 타입별 렌더링 분기

| 타입 | 뷰어 | 지원 포맷 |
|------|------|-----------|
| IMAGE | ImageViewer | jpg, png, gif, webp, svg |
| VIDEO | VideoPlayer | mp4, webm, mov |
| DOCUMENT (pdf) | PdfViewer | pdf |
| DOCUMENT (기타) | UnsupportedView | xlsx, docx, pptx 등 |

## 구현 체크리스트

- [ ] index.tsx
- [ ] ImageViewer 통합
- [ ] VideoPlayer 통합
- [ ] PdfViewer 통합
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 이미지 렌더링 | 1 | 1 | 0 | 2 |
| 비디오 렌더링 | 1 | 1 | 0 | 2 |
| PDF 렌더링 | 1 | 1 | 0 | 2 |
| 미지원 타입 | 1 | 0 | 0 | 1 |

### [TC-001] 이미지 미리보기

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="IMAGE", previewUrl 존재 |
| **When** | AssetPreview 렌더링 |
| **Then** | ImageViewer가 표시됨 |

### [TC-002] 비디오 미리보기

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="VIDEO" |
| **When** | AssetPreview 렌더링 |
| **Then** | VideoPlayer가 표시됨 |

### [TC-003] PDF 미리보기

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="DOCUMENT", mimeType="application/pdf" |
| **When** | AssetPreview 렌더링 |
| **Then** | PdfViewer가 표시됨 |

### [TC-004] 미지원 문서 타입

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="DOCUMENT", mimeType="application/vnd.ms-excel" |
| **When** | AssetPreview 렌더링 |
| **Then** | "지원하지 않음" 메시지 + 다운로드 버튼 표시 |

## 상위 기획서

- `apps/admin/web/src/app/(admin)/assets/[assetId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-22 | 초기 생성 | req-widget-planner |
| 2026-02-26 | Stage 5 정합화: assets 페이지-컴포넌트 스펙 경로/명칭 일치화 | orch-screen-planner |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
