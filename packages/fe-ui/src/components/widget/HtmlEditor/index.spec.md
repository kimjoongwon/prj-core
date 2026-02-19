# HtmlEditor Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/HtmlEditor/

## 역할

EMAIL 유형의 HTML 본문을 편집하는 Textarea 기반 코드 에디터입니다. {{변수명}} 형태의 변수 삽입 안내와 font-mono 스타일을 제공합니다.

## Props

```typescript
interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;  // 기본값: 300 (minRows로 변환)
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Textarea | HTML 코드 입력 영역 |
| Info (Lucide) | 변수 삽입 안내 아이콘 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
