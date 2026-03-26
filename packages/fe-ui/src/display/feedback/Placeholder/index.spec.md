# Placeholder UI 컴포넌트 기획서

> 생성일: 2026-02-18
> 타입: ui
> 위치: packages/fe-ui/src/display/feedback/Placeholder/

## 역할

데이터가 없을 때 "데이터가 존재하지 않습니다." 메시지를 중앙에 표시하는 간단한 컴포넌트.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 (유일한 형태)]
┌──────────────────────────────────────┐
│                                      │
│                                      │
│      데이터가 존재하지 않습니다.      │  ← 고정 텍스트 (text-gray-500, 중앙)
│                                      │
│                                      │
└──────────────────────────────────────┘
  수직/수평 중앙 정렬 (VStack alignItems="center" justifyContent="center")
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (단일 형태) | "데이터가 존재하지 않습니다." 중앙 표시, 회색 텍스트 |

## Props

```typescript
// Props 없음
```

## 고정 출력

"데이터가 존재하지 않습니다." (text-gray-500)

## 내부 의존성

- `Text` (data-display/Text)
- `VStack` (rhythm/VStack)

## 관련 컴포넌트

더 풍부한 빈 상태 UI가 필요하면 `EmptyState` 사용.

## HeroUI 매핑

순수 구현 (HeroUI 기반 없음)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
| 2026-03-03 | 내부 의존성 경로 표기를 `rhythm/VStack` 기준으로 정리 | codex |
