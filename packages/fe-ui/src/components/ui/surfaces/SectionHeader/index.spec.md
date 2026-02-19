# SectionHeader UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/surfaces/SectionHeader/

## 역할

섹션의 제목을 대문자 캡션 스타일로 표시하는 컴포넌트.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 구조]
BASIC INFORMATION              ← children (uppercase, caption 스타일, mb-2)
──────────────────────────────
[섹션 내용...]

[실사용 예시 - 폼 섹션 헤더]
ACCOUNT SETTINGS
  [이메일 필드]
  [비밀번호 필드]

NOTIFICATION PREFERENCES
  [알림 체크박스]
  [이메일 수신 토글]
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (단일 형태) | 대문자 변환된 캡션 크기 텍스트 + 하단 여백(mb-2) |

## Props

```typescript
interface SectionHeaderProps {
  /** 헤더 텍스트 */
  children: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 기본 스타일

Text variant="caption" + `uppercase mb-2`

## 내부 의존성

- `Text` (data-display/Text)

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
