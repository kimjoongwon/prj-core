# ImageGallery Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ImageGallery/

## 역할

이미지 목록을 반응형 그리드로 표시하고 재생성/전체다운로드/개별 액션을 제공합니다. 제네릭 타입을 지원합니다.

## Props

```typescript
interface ImageGalleryProps<T extends GalleryImage = GalleryImage> {
  images: T[];
  title?: string;            // 기본값: "생성 결과"
  subtitle?: string;
  onRegenerate?: () => void;
  onDownloadAll?: () => void;
  onDownload?: (image: T) => void;
  onCopy?: (image: T) => void;
  onDelete?: (image: T) => void;
  columns?: 2 | 3 | 4;      // 기본값: 4
  className?: string;
}

interface GalleryImage {
  id: string;
  src: string;
  filename: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| ImageCard | 개별 이미지 카드 |
| HeroUI Button | 재생성/전체다운로드 버튼 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
