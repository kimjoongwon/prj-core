# PhoneCell 기획서

> 생성일: 2026-02-18
> 타입: ui (cell)
> 위치: packages/fe-ui/src/components/ui/data-display/cells/PhoneCell/

## 역할

전화번호를 한국식 포맷(하이픈 포함)으로 변환하여 표시하는 Cell 컴포넌트.

## Props

```typescript
interface PhoneCellProps {
  /** 전화번호 */
  value?: string | null;
}
```

## 표시 규칙

| 입력 | 표시 | 설명 |
|---|---|---|
| `01012345678` | 010-1234-5678 | 11자리 휴대폰 |
| `0212345678` | 02-1234-5678 | 10자리 서울 |
| `0311234567` | 031-123-4567 | 10자리 지역 |
| `010-1234-5678` | 010-1234-5678 | 이미 포맷팅됨 (그대로) |
| `null` / `undefined` / `""` | - | text-default-400 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
