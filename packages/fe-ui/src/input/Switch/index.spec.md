# Switch Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/input/Switch/

## 역할

MobX state와 연동하는 스위치(토글) 컴포넌트. `useFormField` 훅을 통해 boolean 값의 양방향 바인딩을 제공한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
꺼진 상태 (false)
┌──────────────────────────┐
│ 알림 활성화               │
│ [○──────]                │  ← 회색 배경, 동그라미 왼쪽
└──────────────────────────┘

켜진 상태 (true)
┌──────────────────────────┐
│ 알림 활성화               │
│ [──────●]                │  ← 파란 배경, 동그라미 오른쪽
└──────────────────────────┘

라벨 우측 배치
┌─────────────────────────────────┐
│ [──────●]  알림을 받겠습니다      │  ← 라벨이 스위치 오른쪽
└─────────────────────────────────┘

비활성화 상태 (켜짐)
┌──────────────────────────┐
│ 시스템 설정               │
│ [──────●]  (비활성)       │  ← 흐린 색상, 클릭 불가
└──────────────────────────┘

비활성화 상태 (꺼짐)
┌──────────────────────────┐
│ 시스템 설정               │
│ [○──────]  (비활성)       │  ← 흐린 회색, 클릭 불가
└──────────────────────────┘

크기 변형 (size="sm" / "md" / "lg")
[○──]  sm - 소형
[○────]  md - 기본 (default)
[○──────]  lg - 대형
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 꺼짐(false) | 회색 배경, 원형 버튼 왼쪽 위치 |
| 켜짐(true) | 파란 배경, 원형 버튼 오른쪽 위치 + 슬라이드 애니메이션 |
| 비활성화 | 흐린 색상, 클릭 불가 |
| sm / md / lg | 크기별 스위치 너비/높이 다름 |

## Props

```typescript
interface SwitchProps<T> extends MobxProps<T>,
  Omit<BaseSwitchProps, "value" | "onValueChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- 나머지 BaseSwitchProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `tools.get(state, path, false)` (boolean) |
| 변경 시 | `formField.setValue(isSelected)`로 state 업데이트 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
