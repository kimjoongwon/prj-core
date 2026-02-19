# SpaceAlert Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/SpaceAlert/

## 역할

Space가 선택되지 않았을 때 표시되는 모달 Alert입니다. 확인 버튼으로 Space 선택 화면으로 유도합니다.

## Props

```typescript
interface SpaceAlertProps {
  title?: string;           // 기본값: "Space 선택 필요"
  message?: string;         // 기본값: "서비스 이용을 위해 Space를 선택해주세요."
  confirmText?: string;     // 기본값: "Space 선택하기"
  onConfirm?: () => void;
  onDismiss?: () => void;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| Button (커스텀) | 확인/닫기 버튼 |
| Text (커스텀) | 제목/메시지 텍스트 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
