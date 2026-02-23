# AssetTypeInfo Widget 기획서

> 생성일: 2026-02-22
> 수정일: 2026-02-23
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/AssetTypeInfo/

## 역할

에셋 타입에 따라 적절한 상세 정보 위젯을 조건부 렌더링하는 래퍼 컴포넌트입니다. 이미지/비디오/문서별로 다른 상세 정보를 표시합니다.

## 디자인 목업

```
[IMAGE 타입]
┌──────────────────────────────────────────────────────────────────┐
│ 이미지 정보                                          [접기 ▲]     │
│ ──────────────────────────────────────────────────────────────── │
│ 너비            1920 px         │ 색상 공간      sRGB            │
│ 높이            1080 px         │ 알파 채널      예              │
│ 방향            1 (정방향)      │                                │
└──────────────────────────────────────────────────────────────────┘

[VIDEO 타입]
┌──────────────────────────────────────────────────────────────────┐
│ 비디오 정보                                          [접기 ▲]     │
│ ──────────────────────────────────────────────────────────────── │
│ 너비            1920 px         │ 프레임 레이트  30 fps          │
│ 높이            1080 px         │ 비디오 코덱    H.264           │
│ 재생 시간       02:30           │ 비트레이트      8.5 Mbps        │
│ 오디오          AAC             │                                │
└──────────────────────────────────────────────────────────────────┘

[DOCUMENT 타입]
┌──────────────────────────────────────────────────────────────────┐
│ 문서 정보                                            [접기 ▲]     │
│ ──────────────────────────────────────────────────────────────── │
│ 페이지 수       15              │ 제목          2024년 가이드    │
│ 단어 수         3,240           │ 주제          사용자 매뉴얼    │
│ 작성자          홍길동          │ 키워드        가이드, 매뉴얼    │
└──────────────────────────────────────────────────────────────────┘
```

### 상태별 UI 변화

| 상태 | 설명 | 시각적 변화 |
|------|------|-------------|
| `image` | 이미지 타입 | ImageDetailInfo 표시 |
| `video` | 비디오 타입 | VideoDetailInfo 표시 |
| `document` | 문서 타입 | DocumentDetailInfo 표시 |
| `noData` | 상세 정보 없음 | 아무것도 렌더링하지 않음 |

### 타입별 렌더링 분기

| kind | 렌더링 컴포넌트 | 기획서 |
|------|----------------|--------|
| IMAGE | ImageDetailInfo | `widget/ImageDetailInfo` |
| VIDEO | VideoDetailInfo | `widget/VideoDetailInfo` |
| DOCUMENT | DocumentDetailInfo | `widget/DocumentDetailInfo` |

## Props

```typescript
interface AssetTypeInfoProps {
  asset: Asset;                           // 에셋 데이터 (image/video/document 포함)
  collapsible?: boolean;                  // 접기/펼치기 가능 여부 (기본값: true)
  defaultExpanded?: boolean;              // 기본 펼침 상태 (기본값: true)
  className?: string;                     // 추가 클래스
}

interface Asset {
  kind: AssetKind;                        // IMAGE | VIDEO | DOCUMENT
  image?: Image;                          // kind=IMAGE일 때만
  video?: Video;                          // kind=VIDEO일 때만
  document?: Document;                    // kind=DOCUMENT일 때만
}
```

## 하위 Widget 컴포넌트

| 컴포넌트 | 기획서 | 렌더링 조건 |
|----------|--------|-------------|
| ImageDetailInfo | `widget/ImageDetailInfo` | kind=IMAGE |
| VideoDetailInfo | `widget/VideoDetailInfo` | kind=VIDEO |
| DocumentDetailInfo | `widget/DocumentDetailInfo` | kind=DOCUMENT |

## 상태 관리

**없음** (하위 컴포넌트에서 로컬 상태만 사용)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| `fallback` | 상세 정보 없을 때 표시 |

## 렌더링 로직

```typescript
function AssetTypeInfo({ asset, collapsible, defaultExpanded, className }: Props) {
  switch (asset.kind) {
    case 'IMAGE':
      if (!asset.image) return null;
      return (
        <ImageDetailInfo
          image={asset.image}
          collapsible={collapsible}
          defaultExpanded={defaultExpanded}
          className={className}
        />
      );
    case 'VIDEO':
      if (!asset.video) return null;
      return (
        <VideoDetailInfo
          video={asset.video}
          collapsible={collapsible}
          defaultExpanded={defaultExpanded}
          className={className}
        />
      );
    case 'DOCUMENT':
      if (!asset.document) return null;
      return (
        <DocumentDetailInfo
          document={asset.document}
          collapsible={collapsible}
          defaultExpanded={defaultExpanded}
          className={className}
        />
      );
    default:
      return null;
  }
}
```

## 디자인 토큰

하위 컴포넌트의 토큰을 따름

## 구현 체크리스트

- [ ] index.tsx
- [ ] 타입별 분기 렌더링
- [ ] Storybook 스토리 (3가지 타입)
- [ ] 컴포넌트 테스트 (Vitest)

## 테스트 케이스

> 구현 도구: Vitest + Testing Library

### 테스트 커버리지

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| IMAGE 렌더링 | 1 | 0 | 1 | 2 |
| VIDEO 렌더링 | 1 | 0 | 1 | 2 |
| DOCUMENT 렌더링 | 1 | 0 | 1 | 2 |

### [TC-001] IMAGE 타입 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind=IMAGE, asset.image 존재 |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | ImageDetailInfo 컴포넌트 렌더링 |

### [TC-002] VIDEO 타입 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind=VIDEO, asset.video 존재 |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | VideoDetailInfo 컴포넌트 렌더링 |

### [TC-003] DOCUMENT 타입 렌더링

**분류:** Happy Path

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind=DOCUMENT, asset.document 존재 |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | DocumentDetailInfo 컴포넌트 렌더링 |

### [TC-004] IMAGE 데이터 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind=IMAGE, asset.image=null |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | 아무것도 렌더링하지 않음 |

### [TC-005] VIDEO 데이터 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind=VIDEO, asset.video=null |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | 아무것도 렌더링하지 않음 |

### [TC-006] DOCUMENT 데이터 없음

**분류:** Edge Case

| 구분 | 내용 |
|------|------|
| **Given** | asset.kind=DOCUMENT, asset.document=null |
| **When** | AssetTypeInfo 렌더링 |
| **Then** | 아무것도 렌더링하지 않음 |

## 상위 기획서

- `apps/admin/app/(admin)/assets/[assetId]/page.spec.md`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-22 | 초기 생성 | req-widget-planner |
| 2026-02-23 | 하위 Widget 컴포넌트(ImageDetailInfo, VideoDetailInfo, DocumentDetailInfo) 분리 | req-widget-planner |
