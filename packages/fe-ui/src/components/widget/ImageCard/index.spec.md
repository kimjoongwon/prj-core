# ImageCard Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ImageCard/

## 역할

이미지를 카드 형태로 표시하며, 호버 시 다운로드/복사/삭제 오버레이 액션을 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
기본 상태 (square, 호버 전)
┌─────────────────┐
│                 │
│                 │
│   [이미지]      │
│                 │
│                 │
│  filename.jpg   │  ← 파일명
└─────────────────┘

호버 시 (오버레이 표시)
┌─────────────────┐
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│  ← 반투명 다크 오버레이
│▓               ▓│
│▓  [⬇][⧉][🗑] ▓│  ← 액션 버튼 (다운로드/복사/삭제)
│▓               ▓│
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  filename.jpg   │
└─────────────────┘

video 비율 (16:9)
┌─────────────────────────────┐
│                             │
│          [이미지]            │
│                             │
│  filename.jpg               │
└─────────────────────────────┘

showActions: false (액션 없음)
┌─────────────────┐
│                 │
│   [이미지]      │
│                 │
│  filename.jpg   │
└─────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| square (기본) | 1:1 정사각형 이미지 카드 |
| video | 16:9 와이드 비율 이미지 카드 |
| auto | 이미지 원본 비율 |
| 호버 | 반투명 오버레이 + 액션 버튼 3개 표시 |
| 액션 없음 | showActions=false 시 오버레이 미표시 |

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
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
