# Text Component

개선된 Text 컴포넌트는 다크모드를 완전히 지원하며, semantic HTML과 타이포그래피 시스템을 제공합니다.

## 주요 개선사항

### 🌙 다크모드 지원

- 모든 텍스트 variant가 다크모드에서 적절한 대비를 제공
- HeroUI의 color system 활용 (`text-foreground`, `text-default-*`)
- 자동으로 라이트/다크 테마에 맞는 색상 전환

### 🏷️ Semantic HTML

- variant에 따라 적절한 HTML 태그 자동 선택
- `h1`~`h6` variant는 해당 heading 태그 사용
- 접근성(a11y) 향상

### 🎨 향상된 기능

- `truncate`: 한 줄 텍스트 말줄임
- `lineClamp`: 지정된 줄 수로 텍스트 제한
- `as` prop: 커스텀 HTML 태그 지정 가능
- TypeScript 완전 지원

## 사용법

### 기본 사용

```tsx
<Text variant="h1">메인 제목</Text>
<Text variant="body1">일반 문단 텍스트</Text>
<Text variant="caption">작은 캡션 텍스트</Text>
```

### 다크모드 대응

```tsx
// 자동으로 다크모드에서 적절한 색상 사용
<Text variant="body1">라이트/다크 모드 모두 보임</Text>
<Text variant="subtitle1">보조 텍스트 (다크모드에서 덜 진함)</Text>
```

### 텍스트 제한

```tsx
// 한 줄 말줄임
<Text variant="body1" truncate>
  긴 텍스트가 잘립니다...
</Text>

// 여러 줄 제한
<Text variant="body1" lineClamp={2}>
  이 텍스트는 정확히 2줄로 제한되고
  초과하면 말줄임표가 표시됩니다
</Text>
```

### 커스텀 HTML 태그

```tsx
<Text as="span" variant="h3">span으로 렌더된 제목</Text>
<Text as="div" variant="body1">div로 렌더된 본문</Text>
```

## 사용 가능한 Variants

| Variant     | 기본 태그 | 설명                                 |
| ----------- | --------- | ------------------------------------ |
| `h1`        | `<h1>`    | 메인 제목 (4xl, bold)                |
| `h2`        | `<h2>`    | 섹션 제목 (3xl, bold)                |
| `h3`        | `<h3>`    | 서브섹션 제목 (2xl, bold)            |
| `h4`        | `<h4>`    | 마이너 제목 (xl, bold)               |
| `h5`        | `<h5>`    | 작은 제목 (lg, bold)                 |
| `h6`        | `<h6>`    | 가장 작은 제목 (base, bold)          |
| `title`     | `<p>`     | 제목용 텍스트 (xl, normal)           |
| `body1`     | `<p>`     | 기본 본문 (base, normal)             |
| `body2`     | `<p>`     | 작은 본문 (sm, normal)               |
| `subtitle1` | `<p>`     | 보조 텍스트 (base, normal, muted)    |
| `subtitle2` | `<p>`     | 작은 보조 텍스트 (sm, normal, muted) |
| `caption`   | `<span>`  | 캡션/설명 (sm, normal, muted)        |
| `label`     | `<span>`  | 라벨 텍스트 (sm, semibold, muted)    |
| `text`      | `<p>`     | 일반 텍스트 (base, normal)           |

## Props

```tsx
interface TextProps extends React.HTMLAttributes<HTMLElement> {
  variant?:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'caption'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'title'
    | 'label'
    | 'text';
  as?: React.ElementType;
  children?: React.ReactNode;
  truncate?: boolean;
  lineClamp?: 1 | 2 | 3 | 4 | 5 | 6 | 'none';
  className?: string;
}
```

## 마이그레이션 가이드

기존 코드에서 다음과 같이 변경:

```tsx
// 이전
<p className="text-black text-xl">제목</p>

// 개선 후
<Text variant="title">제목</Text>
```

다크모드 문제가 있던 기존 텍스트들은 자동으로 해결됩니다.
