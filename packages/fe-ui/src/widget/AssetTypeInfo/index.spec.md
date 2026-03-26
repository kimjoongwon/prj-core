# AssetTypeInfo Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-22
> 타입: widget
> 위치: packages/fe-ui/src/widget/AssetTypeInfo/

## 역할

에셋 타입에 따라 상세 정보를 조건부 렌더링하는 컴포넌트입니다. ImageInfo, VideoInfo, DocumentInfo를 타입에 따라 표시합니다.

## 디자인 목업

```
[이미지 타입]
┌─────────────────────────────────────────────┐
│ 이미지 정보                                  │
├─────────────────────────────────────────────┤
│                                             │
│  해상도          1920 x 1080                │
│                                             │
│  색상 공간       sRGB                       │
│                                             │
│  방향           가로                        │
│                                             │
│  EXIF           [상세 보기]                 │
│                                             │
└─────────────────────────────────────────────┘

[비디오 타입]
┌─────────────────────────────────────────────┐
│ 비디오 정보                                  │
├─────────────────────────────────────────────┤
│                                             │
│  재생 시간       00:02:30                   │
│                                             │
│  해상도          1920 x 1080                │
│                                             │
│  프레임 레이트   30 fps                     │
│                                             │
│  코덱            H.264                      │
│                                             │
│  비트레이트      5000 kbps                  │
│                                             │
│  오디오          있음 (AAC)                 │
│                                             │
└─────────────────────────────────────────────┘

[문서 타입]
┌─────────────────────────────────────────────┐
│ 문서 정보                                    │
├─────────────────────────────────────────────┤
│                                             │
│  페이지 수       15                         │
│                                             │
│  시트 수         -                          │
│                                             │
│  슬라이드 수     -                          │
│                                             │
│  텍스트 추출     [다운로드]                 │
│                                             │
└─────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `image` | 이미지 타입 | ImageInfo 표시 |
| `video` | 비디오 타입 | VideoInfo 표시 |
| `document` | 문서 타입 | DocumentInfo 표시 |
| `noData` | 상세 정보 없음 | "정보 없음" 메시지 |

## Props

```typescript
interface AssetTypeInfoProps {
  asset: Asset;                                // 에셋 데이터
  imageInfo?: Image;                           // 이미지 상세 정보 (asset.image)
  videoInfo?: Video;                           // 비디오 상세 정보 (asset.video)
  documentInfo?: Document;                     // 문서 상세 정보 (asset.document)
  onExifView?: (exif: Record<string, unknown>) => void; // EXIF 보기 핸들러
  onTextExtract?: (asset: Asset) => void;      // 텍스트 추출 다운로드 핸들러
  className?: string;                          // 추가 클래스
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 기획서 | 역할 |
|----------|--------|------|
| Card | `ui/Card` | 카드 컨테이너 |
| Button | `ui/Button` | 액션 버튼 |
| Badge | `ui/Badge` | 정보 뱃지 |

## 상태 관리

**없음** (Store 사용 금지 - 순수 UI)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `header` | 헤더 영역 커스터마이징 |
| `extra` | 타입별 추가 정보 |

## 타입별 표시 항목

### IMAGE 타입

| 항목 | 키 | 포맷 |
|------|-----|------|
| 해상도 | width x height | 1920 x 1080 |
| 색상 공간 | colorSpace | sRGB, Adobe RGB 등 |
| 방향 | orientation | 가로/세로 |
| EXIF | exif | 상세 보기 버튼 |

### VIDEO 타입

| 항목 | 키 | 포맷 |
|------|-----|------|
| 재생 시간 | durationMs | HH:mm:ss |
| 해상도 | width x height | 1920 x 1080 |
| 프레임 레이트 | frameRate | 30 fps |
| 코덱 | codec | H.264, VP9 등 |
| 비트레이트 | bitRateKbps | 5000 kbps |
| 오디오 | hasAudio | 있음/없음 |

### DOCUMENT 타입

| 항목 | 키 | 포맷 |
|------|-----|------|
| 페이지 수 | pageCount | 숫자 |
| 시트 수 | sheetCount | 숫자 (Excel) |
| 슬라이드 수 | slideCount | 숫자 (PPT) |
| 텍스트 추출 | extractedTextKey | 다운로드 버튼 |

## 디자인 토큰

| 항목 | 값 |
|------|-----|
| 라벨 너비 | 100px |
| 행 간격 | py-3 |
| 라운드 | rounded-xl |
| 배경 | bg-content1 |

## 구현 체크리스트

- [ ] index.tsx
- [ ] ImageInfo 서브컴포넌트
- [ ] VideoInfo 서브컴포넌트
- [ ] DocumentInfo 서브컴포넌트
- [ ] Storybook 스토리
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 타입 분기 | 3 | 0 | 1 | 4 |
| 정보 표시 | 3 | 0 | 0 | 3 |
| 액션 | 2 | 0 | 0 | 2 |

### [TC-001] 이미지 정보 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="IMAGE", imageInfo 존재 |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | 해상도, 색상 공간, EXIF 버튼 표시 |

### [TC-002] 비디오 정보 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="VIDEO", videoInfo 존재 |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | 재생 시간, 코덱, 비트레이트 등 표시 |

### [TC-003] 문서 정보 표시

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="DOCUMENT", documentInfo 존재 |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | 페이지 수, 텍스트 추출 버튼 표시 |

### [TC-004] 상세 정보 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind="IMAGE", imageInfo=null |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | "정보 없음" 메시지 표시 |

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
