# VariableReadTable Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/VariableReadTable/

## 역할

상세 화면에서 템플릿 변수 목록을 읽기 전용 테이블로 표시합니다. 변수명({{name}} 형식), 설명, 기본값, 필수 여부를 컬럼으로 제공합니다.

## Props

```typescript
interface VariableReadTableProps {
  variables: TemplateVariable[];
}

interface TemplateVariable {
  id: string;
  name: string;
  description: string | null;
  defaultValue: string | null;
  isRequired: boolean;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Table | 테이블 컨테이너 |
| HeroUI Chip | 필수/선택 배지 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
