# AssetKindBadge

## 개요

에셋의 종류(이미지/비디오/문서)를 시각적으로 표시하는 Badge 컴포넌트입니다.

## Props

| 이름      | 타입      | 필수 | 설명          |
| --------- | --------- | ---- | ------------- |
| kind      | AssetKind | ✅   | 에셋 종류     |
| className | string    | ❌   | 추가 클래스명 |

## 타입

### AssetKind

```typescript
type AssetKind = "IMAGE" | "VIDEO" | "DOCUMENT";
```

## 종류별 스타일

| 종류    | 라벨   | 색상      |
| ------- | ------ | --------- |
| IMAGE   | 이미지 | primary   |
| VIDEO   | 비디오 | secondary |
| DOCUMENT| 문서   | default   |

## 사용 예시

```tsx
import { AssetKindBadge } from "@cocrepo/ui";

// 기본 사용
<AssetKindBadge kind="IMAGE" />

// 종류에 따른 표시
<AssetKindBadge kind="VIDEO" />
<AssetKindBadge kind="DOCUMENT" />
```

## 의존성

- @heroui/react (Chip)
- mobx-react-lite (observer)

## 변경 이력

| 일자       | 내용     | 작성자             |
| ---------- | -------- | ------------------ |
| 2026-02-23 | 초기 생성 | fe-ui-component-builder |
