# ConditionEditor Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ability/ConditionEditor/

## 역할

CASL Ability의 conditions(JSON 조건)를 편집하는 위젯입니다. Textarea 기반 JSON 편집기로, 실시간 JSON 유효성 검사와 템플릿 변수(${user.id}, ${user.spaceId} 등) 삽입 기능을 제공합니다.

## Props

```typescript
interface ConditionEditorProps {
  value: Record<string, unknown> | null;
  onChange: (conditions: Record<string, unknown> | null) => void;
  subjectFields?: string[];
  error?: string;
  isDisabled?: boolean;    // 기본값: false
  label?: string;          // 기본값: "조건 (Conditions)"
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| Textarea (커스텀) | JSON 코드 편집 (font-mono) |
| HeroUI Chip | 템플릿 변수 삽입 버튼 |
| HeroUI Tooltip | 필드 목록 안내, 변수 라벨 표시 |
| lucide-react 아이콘 | AlertCircle(에러), Info(안내) |
| VStack, HStack | 레이아웃 |

## 상태 관리

로컬: textValue (JSON 문자열, useState), internalError (파싱 에러, useState). 외부 value 변경 시 useEffect로 동기화.

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
