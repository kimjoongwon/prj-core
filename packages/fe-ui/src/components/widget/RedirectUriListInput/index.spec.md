# RedirectUriListInput Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/RedirectUriListInput/

## 역할

OIDC 클라이언트의 Redirect URI를 동적으로 추가/삭제/수정하는 입력 위젯입니다.

## Props

```typescript
interface RedirectUriListInputProps {
  value: string[];
  onChange: (uris: string[]) => void;
  errors?: Record<number, string>;
  isReadOnly?: boolean;  // 기본값: false
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| HeroUI Input | 각 URI 입력 필드 |
| HeroUI Button | URI 추가/삭제 버튼 |

## 상태 관리

**없음** (순수 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
