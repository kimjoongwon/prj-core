# MarkdownEditor Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/MarkdownEditor/

## 역할

툴바를 통해 마크다운 문법(제목, 굵게, 기울임, 코드, 목록, 테이블, 링크 등)을 쉽게 삽입할 수 있는 에디터입니다.

## Props

```typescript
interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  extraToolbarItems?: ToolbarItemOrDivider[];
  extraActions?: ReactNode;
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Button | 툴바 각 기능 버튼 |
| HeroUI Tooltip | 툴바 버튼 라벨 표시 |
| Lucide 아이콘 | 제목/굵게/기울임/코드/목록/테이블/링크 아이콘 |
| textarea (네이티브) | 마크다운 편집 영역 |

## 상태 관리

로컬: textareaRef (커서 위치 조작용)

## 슬롯

| 슬롯 | 설명 |
|------|------|
| extraActions | 툴바 우측 추가 액션 버튼 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
