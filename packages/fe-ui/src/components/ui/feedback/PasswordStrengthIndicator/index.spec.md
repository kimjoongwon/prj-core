# PasswordStrengthIndicator UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/feedback/PasswordStrengthIndicator/

## 역할

비밀번호 정책 규칙의 충족 여부를 실시간으로 표시하는 컴포넌트. 각 규칙의 통과/미통과 상태를 체크/X 아이콘으로 표시한다.

## Props

```typescript
interface PasswordStrengthIndicatorProps {
  /** 현재 입력된 비밀번호 */
  password: string;
  /** 비밀번호 정책 규칙 목록 */
  rules: PasswordRule[];
}
```

## 의존성

- `PasswordRule` from `@cocrepo/constant`

## 상태

| 상태 | 동작 |
|------|------|
| password 빈 문자열 | null 반환 (숨김) |
| 규칙 통과 | 체크 아이콘 (text-success) + 라벨 |
| 규칙 미통과 | X 아이콘 (text-default-400) + 라벨 |

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). observer로 감싸져 있음.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
