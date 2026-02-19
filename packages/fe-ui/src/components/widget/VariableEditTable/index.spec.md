# VariableEditTable Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/VariableEditTable/

## 역할

등록/수정 폼에서 템플릿 변수를 인라인으로 추가/수정/삭제하는 테이블입니다. 변수명 유효성 검증과 본문 내 사용 여부 확인 기능을 제공합니다.

## Props

```typescript
interface VariableEditTableProps {
  variables: VariableEditItem[];
  onChange: (variables: VariableEditItem[]) => void;
  contentText?: string;
  errors?: Record<number, Record<string, string>>;
}

interface VariableEditItem {
  id?: string;
  name: string;
  description: string;
  defaultValue: string;
  isRequired: boolean;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Table | 테이블 컨테이너 |
| Input (커스텀) | 변수명/설명/기본값 인라인 입력 |
| Switch (커스텀) | 필수 여부 토글 |
| HeroUI Button | 행 추가/삭제 |
| HeroUI Tooltip | 본문 사용 중 경고 |

## 상태 관리

**없음** (외부에서 variables 상태를 관리)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
