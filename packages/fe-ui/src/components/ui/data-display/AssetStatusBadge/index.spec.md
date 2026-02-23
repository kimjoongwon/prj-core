# AssetStatusBadge

## 개요

에셋의 업로드 상태를 시각적으로 표시하는 Badge 컴포넌트입니다.

## Props

| 이름      | 타입        | 필수 | 설명                    |
| --------- | ----------- | ---- | ----------------------- |
| status    | AssetStatus | ✅   | 에셋 상태               |
| className | string      | ❌   | 추가 클래스명           |

## 타입

### AssetStatus

```typescript
type AssetStatus = "UPLOADING" | "READY" | "FAILED";
```

## 상태별 스타일

| 상태      | 라벨     | 색상    |
| --------- | -------- | ------- |
| UPLOADING | 업로드중 | warning |
| READY     | 준비완료 | success |
| FAILED    | 실패     | danger  |

## 사용 예시

```tsx
import { AssetStatusBadge } from "@cocrepo/ui";

// 기본 사용
<AssetStatusBadge status="READY" />

// 상태에 따른 표시
<AssetStatusBadge status="UPLOADING" />
<AssetStatusBadge status="FAILED" />
```

## 의존성

- @heroui/react (Chip)
- mobx-react-lite (observer)

## 변경 이력

| 일자       | 내용     | 작성자             |
| ---------- | -------- | ------------------ |
| 2026-02-23 | 초기 생성 | fe-ui-component-builder |
