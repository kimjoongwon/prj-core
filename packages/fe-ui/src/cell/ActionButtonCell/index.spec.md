# ActionButtonCell 기획서

> 생성일: 2026-03-28
> 타입: ui (cell)
> 위치: packages/fe-ui/src/cell/ActionButtonCell/

## 역할

테이블 컬럼에서 사용하는 경량 액션 버튼 셀. 컬럼 정의는 버튼 정렬과 동작만 주입하고 실제 HeroUI Button 마크업은 이 컴포넌트가 책임진다.

## Props

```typescript
interface ActionButtonCellProps extends ButtonProps {
  /** 버튼 정렬 */
  align?: "center" | "start" | "end";
}
```

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | columns 인라인 버튼 마크업 제거를 위해 범용 액션 버튼 셀을 추가 | codex |
