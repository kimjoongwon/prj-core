# RadioGroup Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/control/RadioGroup/

## 역할

MobX state와 연동하는 라디오 그룹 컴포넌트. `useFormField` 훅을 통해 단일 선택 값의 양방향 바인딩을 제공한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
기본 상태 (세로 방향)
┌──────────────────────────────┐
│ 성별                          │  ← label
│                               │
│  ○ 남성                       │  ← 미선택
│  ● 여성                       │  ← 선택됨 (파란 점)
│  ○ 선택 안 함                  │
│                               │
└──────────────────────────────┘

가로 방향 (orientation="horizontal")
┌────────────────────────────────────┐
│ 회원 등급                            │
│  ● 일반    ○ 실버    ○ 골드    ○ VIP  │
└────────────────────────────────────┘

오류 상태
┌──────────────────────────────┐
│ 성별                          │
│  ○ 남성                       │
│  ○ 여성                       │  ← 전체 항목 빨간 색상
│  ○ 선택 안 함                  │
│  ⚠ 성별을 선택해 주세요        │
└──────────────────────────────┘

비활성화 상태
┌──────────────────────────────┐
│ 성별                          │
│  ○ 남성  (비활성)              │  ← 흐린 텍스트, 클릭 불가
│  ● 여성  (비활성)              │
│  ○ 선택 안 함  (비활성)         │
└──────────────────────────────┘

개별 항목 비활성화
┌──────────────────────────────┐
│ 구독 유형                     │
│  ● 기본                       │
│  ○ 프리미엄                   │
│  ○ 엔터프라이즈 (비활성)        │  ← 특정 항목만 비활성
└──────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 세로 나열, 미선택 빈 원 / 선택 파란 원 |
| 가로 | `orientation="horizontal"` 가로 나열 |
| 오류 | 빨간 색상 + 하단 오류 메시지 |
| 비활성화 | 전체 또는 개별 항목 흐리게 처리 |

## Props

```typescript
interface RadioGroupProps<T> extends MobxProps<T>,
  Omit<BaseRadioGroupProps, "value" | "onValueChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `options`: `RadioOption[]` 선택지 목록
- 나머지 BaseRadioGroupProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `options`에서 `state[path]`와 일치하는 option의 value |
| 변경 시 | `formField.setValue(value)`로 state 업데이트 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
