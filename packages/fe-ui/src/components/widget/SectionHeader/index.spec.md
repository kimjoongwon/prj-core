# SectionHeader Widget 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/SectionHeader/

## 역할

섹션 상단의 제목/설명/액션 영역을 표준화하는 컴포넌트입니다.
`title` 기반 헤더 모드와 기존 캡션(children) 모드를 모두 지원합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[헤더 모드]
┌──────────────────────────────────────────────────────┐
│ 기본 정보                                  [추가 버튼] │
│ 설명 텍스트(선택)                                     │
└──────────────────────────────────────────────────────┘

[캡션 모드(하위호환)]
BASIC INFORMATION              ← children (uppercase)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 헤더 모드 | title(h2) + description + actions |
| 캡션 모드 | children 기반 대문자 캡션 |

## Props

```typescript
interface SectionHeaderProps {
  /** 섹션 제목 (h2) */
  title?: ReactNode;
  /** 섹션 설명 */
  description?: ReactNode;
  /** 우측 액션 영역 */
  actions?: ReactNode;
  /** 하위호환용 캡션 콘텐츠 */
  children?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
}
```

## 기본 스타일

- 헤더 모드: `flex items-start justify-between gap-3`
- 캡션 모드: Text variant="caption" + `uppercase mb-2`

## 내부 의존성

- `Text` (data-display/Text)

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | `widget` 디렉터리 이동에 맞춰 위치/타입 문구 정리 | codex |
| 2026-03-03 | 페이지/섹션 헤더 반복 제거를 위해 title/description/actions 헤더 모드 추가 (캡션 모드 하위호환 유지) | codex |
