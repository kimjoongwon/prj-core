# PasswordStrengthIndicator UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/primitive/feedback/PasswordStrengthIndicator/

## 역할

비밀번호 정책 규칙의 충족 여부를 실시간으로 표시하는 컴포넌트. 각 규칙의 통과/미통과 상태를 체크/X 아이콘으로 표시한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[비밀번호 입력 중 - 일부 규칙 통과]
  ✓  8자 이상          ← 통과: 체크 아이콘 (text-success, 초록)
  ✓  영문 포함         ← 통과
  ✗  숫자 포함         ← 미통과: X 아이콘 (text-default-400, 회색)
  ✗  특수문자 포함      ← 미통과

[모든 규칙 통과]
  ✓  8자 이상
  ✓  영문 포함
  ✓  숫자 포함
  ✓  특수문자 포함

[비밀번호 비어있음]
  (컴포넌트 미표시 - null 반환)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 규칙 통과 | ✓ 초록 체크 아이콘 + 라벨 (text-success) |
| 규칙 미통과 | ✗ 회색 X 아이콘 + 라벨 (text-default-400) |
| 비밀번호 없음 | 컴포넌트 자체 숨김 (null) |

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
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
