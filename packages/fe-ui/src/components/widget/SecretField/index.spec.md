# SecretField Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/SecretField/

## 역할

비밀 값(Client Secret 등)을 마스킹/표시 토글/클립보드 복사할 수 있는 위젯입니다.

## Props

```typescript
interface SecretFieldProps {
  value: string | null | undefined;
  maskChar?: string;     // 기본값: "•" (bullet)
  maskLength?: number;   // 기본값: 16
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Snippet | 복사 기능이 포함된 코드 표시 |
| HeroUI Button | 마스킹 토글 버튼 |
| Eye/EyeOff (Lucide) | 보기/숨기기 아이콘 |

## 상태 관리

로컬: isVisible (boolean) - 마스킹 표시/숨김 토글

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
