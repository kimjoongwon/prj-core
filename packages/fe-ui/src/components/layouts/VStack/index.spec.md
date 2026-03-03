# VStack Layout 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: layout
> 위치: packages/fe-ui/src/components/layouts/VStack/

## 역할

자식 요소들을 세로(수직) 방향으로 배치하는 Flex 컨테이너. cva 기반으로 정렬, 간격 등을 props로 제어한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 - alignItems=stretch, gap=4]
┌──────────────────────────────────┐
│  [자식 요소 A - 전체 너비]        │
│                                  │  ← gap-4 (16px)
│  [자식 요소 B - 전체 너비]        │
│                                  │
│  [자식 요소 C - 전체 너비]        │
└──────────────────────────────────┘

[alignItems=center - 중앙 정렬]
┌──────────────────────────────────┐
│         [자식 요소 A]            │  ← items-center
│         [자식 요소 B]            │
│         [자식 요소 C]            │
└──────────────────────────────────┘

[justifyContent=center - 수직 중앙]
┌──────────────────────────────────┐
│                                  │
│  [자식 요소 A]                   │
│  [자식 요소 B]                   │  ← justify-center (세로 방향)
│                                  │
└──────────────────────────────────┘

[justifyContent=between - 양끝 정렬]
┌──────────────────────────────────┐
│  [자식 요소 A]                   │  ← 상단
│                                  │
│                                  │  ← 빈 공간
│                                  │
│  [자식 요소 B]                   │  ← 하단
└──────────────────────────────────┘

[fullWidth=true]
├──────────────────────────────────┤  ← w-full 적용
│  [자식 요소 A]                   │
│  [자식 요소 B]                   │
├──────────────────────────────────┤
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | flex-col 세로 배치, gap-4, stretch |
| alignItems=center | 자식 요소 가로 중앙 정렬 |
| justifyContent=center | 자식 요소 세로 중앙 정렬 |
| justifyContent=between | 자식 요소 세로 양끝 정렬 |
| fullWidth=true | 전체 너비 사용 |

## Props

```typescript
type VStackProps = {
  /** 자식 요소들 */
  children?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 가로 정렬 (align-items) */
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  /** 세로 정렬 (justify-content) */
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 요소 간 간격 (Tailwind spacing 단위) @default 4 */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
};
```

## 기본 스타일

`flex flex-col` + gap/alignItems/justifyContent/fullWidth에 따른 Tailwind 클래스

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). cva 기반.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | `layouts` 디렉터리 이동에 맞춰 위치/타입 문구 정리 | codex |
