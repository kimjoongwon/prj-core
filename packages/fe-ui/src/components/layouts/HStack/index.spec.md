# HStack Layout 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: layout
> 위치: packages/fe-ui/src/components/layouts/HStack/

## 역할

자식 요소들을 가로(수평) 방향으로 배치하는 Flex 컨테이너. cva 기반으로 정렬, 간격 등을 props로 제어한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 - alignItems=center, gap=4]
┌──────────────────────────────────────────┐
│  [A]    [B]    [C]    [D]               │  ← flex, gap-4, items-center
└──────────────────────────────────────────┘

[justifyContent=between]
┌──────────────────────────────────────────┐
│  [A]               [B]              [C] │  ← justify-between
└──────────────────────────────────────────┘

[justifyContent=center]
┌──────────────────────────────────────────┐
│              [A]  [B]  [C]              │  ← justify-center
└──────────────────────────────────────────┘

[alignItems=start (상단 정렬)]
┌──────────────────────────────────────────┐
│  [A]  [B]         [C]                   │  ← items-start
│       (키 큰      (짧음)
│        요소)
└──────────────────────────────────────────┘

[fullWidth=true]
├──────────────────────────────────────────┤  ← w-full 적용
│  [A]    [B]    [C]                      │
├──────────────────────────────────────────┤
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | flex 수평 배치, gap-4, items-center |
| justifyContent=between | 양끝 정렬 |
| justifyContent=center | 중앙 정렬 |
| alignItems=start | 상단 정렬 |
| fullWidth=true | 전체 너비 사용 |

## Props

```typescript
interface HStackProps {
  /** 자식 요소들 */
  children?: ReactNode;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 세로 정렬 (align-items) */
  alignItems?: "start" | "center" | "end" | "stretch" | "baseline";
  /** 가로 정렬 (justify-content) */
  justifyContent?: "start" | "center" | "end" | "between" | "around" | "evenly";
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 요소 간 간격 (px 단위) @default 4 */
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;
}
```

## 기본 스타일

`flex` + gap/alignItems/justifyContent/fullWidth에 따른 Tailwind 클래스

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음). cva 기반.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | `layouts` 디렉터리 이동에 맞춰 위치/타입 문구 정리 | codex |
