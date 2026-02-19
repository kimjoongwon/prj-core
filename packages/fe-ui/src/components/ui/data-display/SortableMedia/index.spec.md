# SortableMedia UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/data-display/SortableMedia/

## 역할

드래그로 정렬 가능한 미디어(이미지/비디오) 아이템 컴포넌트. 이미지는 직접 표시하고, 비디오는 썸네일 + 재생 버튼으로 표시한다.

## Props

```typescript
interface SortableMediaProps {
  /** 미디어 객체 (id, url, mimeType 포함) */
  media: Partial<any>;
  /** 삭제 핸들러 */
  onRemove: (id: string) => void;
}
```

## 상태

| 상태 | 동작 |
|------|------|
| mimeType이 image 포함 | `<img>` 태그로 렌더링 |
| mimeType이 video | 비디오 썸네일 + Play 버튼, 클릭 시 VideoPlayer 모달 |
| isDragging | opacity: 0.5, zIndex: 1 |

## 내부 의존성

- `@dnd-kit/sortable` (useSortable)
- `VideoPlayer` (비디오 재생 모달)
- `lucide-react` (Play, X)

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
