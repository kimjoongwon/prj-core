# DatePicker Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/input/DatePicker/

## 역할

MobX state와 연동하는 날짜 선택 컴포넌트. ISO 문자열을 `@internationalized/date`의 `ZonedDateTime`으로 변환하여 관리한다. `useFormField` 훅을 통해 양방향 바인딩을 제공한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
기본 상태 (닫힘)
┌─────────────────────────────┐
│ 날짜 선택                    │
│ ┌───────────────────────[📅]│
│ │ 2026. 02. 18             │ │
│ └──────────────────────────┘│
└─────────────────────────────┘

열린 상태 (달력 팝오버)
┌─────────────────────────────┐
│ 날짜 선택                    │
│ ┌───────────────────────[📅]│
│ │ 2026. 02. 18             │ │
│ └──────────────────────────┘│
│ ┌──────────────────────────┐│
│ │  < 2026년 2월  >          ││
│ │  일  월  화  수  목  금  토 ││
│ │              1   2   3   4 ││
│ │   5   6   7   8   9  10  11││
│ │  12  13  14  15  16  17  18││
│ │  19  20  21  22  23  24  25││
│ │  26  27  28                ││
│ └──────────────────────────┘│
└─────────────────────────────┘

오류 상태
┌─────────────────────────────┐
│ 날짜 선택                    │
│ ┌───────────────────────[📅]│  ← 빨간 테두리
│ │                           │ │
│ └──────────────────────────┘│
│  ⚠ 날짜를 선택해 주세요       │
└─────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 입력 필드 + 달력 아이콘 버튼 |
| 열림 | 달력 팝오버 표시 |
| 비활성화 | 흐린 배경, 커서 불가 |
| 오류 | 빨간 테두리 + 오류 메시지 |

## Props

```typescript
interface DatePickerProps<T> extends MobxProps<T>,
  Omit<BaseDatePickerProps, "value" | "onChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- 나머지 BaseDatePickerProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `tools.get(state, path)` ISO 문자열 -> `parseAbsoluteToLocal()` |
| 변경 시 | ISO 문자열 -> `parseAbsoluteToLocal()` -> `formField.setValue()` |

## 의존성

- `@internationalized/date` - `parseAbsoluteToLocal`

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
