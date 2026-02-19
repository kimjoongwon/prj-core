# ImageCard Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ImageCard/

## 역할

이미지를 카드 형태로 표시하며, 호버 시 다운로드/복사/삭제 오버레이 액션을 제공합니다.

## Props

```typescript
interface ImageCardProps {
  src: string;
  filename: string;
  onDownload?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
  showActions?: boolean;        // 기본값: true
  aspectRatio?: "square" | "video" | "auto";  // 기본값: "square"
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Image | 이미지 렌더링 |
| HeroUI Button | 다운로드/복사/삭제 아이콘 버튼 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
