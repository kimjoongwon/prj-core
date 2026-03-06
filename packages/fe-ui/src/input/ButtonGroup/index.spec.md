# ButtonGroup Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/input/ButtonGroup/

## 역할

좌측/우측에 버튼 그룹을 배치하는 레이아웃 컴포넌트. 각 버튼은 선택적으로 Link 래핑이 가능하다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 레이아웃 - 좌우 버튼 배치]
┌─────────────────────────────────────────────────────────┐
│  [← 이전]  [취소]              [저장]  [저장 후 닫기]   │
│  (leftButtons)                         (rightButtons)   │
└─────────────────────────────────────────────────────────┘

[leftButtons만 있는 경우]
┌─────────────────────────────────────────────────────────┐
│  [← 목록으로]                                           │
└─────────────────────────────────────────────────────────┘

[rightButtons만 있는 경우]
┌─────────────────────────────────────────────────────────┐
│                                   [취소]  [저장 (blue)] │
└─────────────────────────────────────────────────────────┘

[href 있는 버튼 (Link 래핑)]
┌───────────────────┐
│  → 상세 페이지    │  (primary 색상, Link 래핑)
└───────────────────┘

[href 없는 버튼 (일반)]
┌───────────────────┐
│  저장             │  (sm 크기, 일반 버튼)
└───────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 좌우 모두 | 양쪽에 버튼 그룹 배치, 가운데 공간으로 분리 |
| 좌측만 | 좌측 버튼 그룹만 표시, 우측 빈 공간 |
| 우측만 | 우측 정렬 버튼 그룹만 표시 |
| href 버튼 | primary 색상 + Link 컴포넌트로 감싸짐 |
| 일반 버튼 | size="sm" Button으로 렌더링 |

## Props

```typescript
interface GroupButton extends ButtonProps {
  href?: LinkProps["href"];
}

interface ButtonGroupProps {
  leftButtons?: GroupButton[];
  rightButtons?: GroupButton[];
}
```

## 동작 규칙

| 조건 | 렌더링 |
|------|------|
| `href` 존재 | Link로 감싸서 color="primary" Button 렌더링 |
| `href` 없음 | size="sm" Button 직접 렌더링 |

## 레이아웃

- `flex flex-1 justify-between`
- 좌측 영역: `leftButtons` 렌더링
- 우측 영역: `rightButtons` 렌더링

## 의존성

- `Button` (내부 컴포넌트)
- HeroUI `Link`

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
