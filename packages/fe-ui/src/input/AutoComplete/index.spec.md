# AutoComplete Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/input/AutoComplete/

## 역할

MobX state와 연동하는 자동완성(AutoComplete) 입력 컴포넌트. `useFormField` 훅을 통해 state/path 기반 양방향 바인딩을 제공한다. 내부적으로 `BaseAutoComplete` Pure 컴포넌트를 래핑한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
[기본 상태 - 미입력]
┌─────────────────────────────────┐
│ 항목을 선택하세요...          ▼ │
└─────────────────────────────────┘

[입력 중 - 드롭다운 표시]
┌─────────────────────────────────┐
│ 서울                          ✕ │
└─────────────────────────────────┘
┌─────────────────────────────────┐
│ 서울특별시                       │
│ 서울 강남구                      │
│ 서울 마포구                      │
└─────────────────────────────────┘

[선택 완료]
┌─────────────────────────────────┐
│ 서울특별시                    ✕ │
└─────────────────────────────────┘

[비활성화]
┌─────────────────────────────────┐
│ 서울특별시                    ▼ │  (흐릿하게 표시)
└─────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 플레이스홀더 텍스트 + 화살표 아이콘 |
| 입력 중 | 입력 텍스트 + 클리어(X) 버튼 + 드롭다운 목록 |
| 선택 완료 | 선택된 항목 텍스트 + 클리어(X) 버튼 |
| 비활성화 | 흐릿한 표시, 상호작용 불가 |
| 에러 | 하단 빨간색 에러 메시지 |

## Props

```typescript
interface AutoCompleteProps<T> extends MobxProps<T>,
  Omit<BaseAutoCompleteProps, "onSelectionChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `defaultItems`: 자동완성 항목 목록 (`{ key, ... }[]`)
- 나머지 BaseAutoCompleteProps 전달

## 상태

| 상태 | 설명 |
|------|------|
| 초기값 | `defaultItems`에서 `state[path]`와 key가 일치하는 항목 |
| 선택 시 | `formField.setValue(value)`로 state 업데이트 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩
- `tools.get(state, path)`로 현재 값 읽기

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
