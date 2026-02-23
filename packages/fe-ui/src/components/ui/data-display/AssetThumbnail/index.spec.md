# AssetThumbnail

## 개요

에셋 종류에 따라 적절한 썸네일을 표시하는 컴포넌트입니다.
이미지는 실제 썸네일을, 비디오/문서는 아이콘을 표시합니다.

## Props

| 이름      | 타입               | 필수 | 설명                    |
| --------- | ------------------ | ---- | ----------------------- |
| src       | string \| null     | ❌   | 썸네일 이미지 URL       |
| alt       | string             | ❌   | 대체 텍스트             |
| kind      | AssetKind          | ✅   | 에셋 종류               |
| size      | AssetThumbnailSize | ❌   | 썸네일 크기 (기본값: md) |
| className | string             | ❌   | 추가 클래스명           |

## 타입

### AssetThumbnailSize

```typescript
type AssetThumbnailSize = "sm" | "md" | "lg";
```

## 크기별 스펙

| 크기 | width | height | iconSize |
| ---- | ----- | ------ | -------- |
| sm   | 32    | 32     | 16       |
| md   | 48    | 48     | 24       |
| lg   | 64    | 64     | 32       |

## 종류별 표시

| 종류    | src 있음 | src 없음      |
| ------- | -------- | ------------- |
| IMAGE   | 이미지   | 아이콘        |
| VIDEO   | -        | 비디오 아이콘 |
| DOCUMENT| -        | 문서 아이콘   |

## 종류별 아이콘 스타일

| 종류    | 아이콘   | 배경색          | 아이콘 색상      |
| ------- | -------- | --------------- | ---------------- |
| IMAGE   | Image    | bg-primary/10   | text-primary     |
| VIDEO   | Video    | bg-secondary/10 | text-secondary   |
| DOCUMENT| FileText | bg-default-100  | text-default-500 |

## 사용 예시

```tsx
import { AssetThumbnail } from "@cocrepo/ui";

// 이미지 썸네일 (실제 이미지)
<AssetThumbnail
  src="/uploads/image.jpg"
  alt="프로필 이미지"
  kind="IMAGE"
/>

// 비디오 썸네일 (아이콘)
<AssetThumbnail kind="VIDEO" size="lg" />

// 문서 썸네일
<AssetThumbnail kind="DOCUMENT" size="sm" />
```

## 의존성

- @heroui/react (Image)
- lucide-react (Image, Video, FileText, File)
- mobx-react-lite (observer)

## 변경 이력

| 일자       | 내용     | 작성자             |
| ---------- | -------- | ------------------ |
| 2026-02-23 | 초기 생성 | fe-ui-component-builder |
