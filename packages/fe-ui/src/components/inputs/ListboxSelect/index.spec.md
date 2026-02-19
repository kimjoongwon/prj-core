# ListboxSelect Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/ListboxSelect/

## 역할

MobX state와 연동하는 Listbox 기반 선택 컴포넌트. single/multiple 선택 모드를 지원한다. `useFormField` 훅을 통해 양방향 바인딩을 제공한다. `ListboxWrapper`도 함께 export한다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
단일 선택 모드 (selectionMode="single")
┌──────────────────────────────┐
│ ● 관리자                      │  ← 선택됨 (파란 배경/체크 표시)
│   일반 사용자                  │
│   게스트                       │
│   뷰어                        │
└──────────────────────────────┘

다중 선택 모드 (selectionMode="multiple")
┌──────────────────────────────┐
│ ☑ 알림 받기                   │  ← 선택됨
│ ☑ 이메일 수신                  │  ← 선택됨
│ ☐ SMS 수신                    │  ← 미선택
│ ☐ 앱 푸시                     │  ← 미선택
└──────────────────────────────┘

hover 상태
┌──────────────────────────────┐
│ ● 관리자                      │
│░░░일반 사용자░░░░░░░░░░░░░░░│  ← hover 하이라이트
│   게스트                       │
└──────────────────────────────┘

ListboxWrapper 사용 예시
┌──────────────────────────────────┐
│ ┌──────────────────────────────┐ │  ← border, rounded
│ │ 권한 선택                    │ │
│ │ ───────────────────────────  │ │
│ │ ☑ 읽기                      │ │
│ │ ☑ 쓰기                      │ │
│ │ ☐ 삭제                      │ │
│ └──────────────────────────────┘ │
└──────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| single | 라디오 스타일, 선택 항목 파란 배경 |
| multiple | 체크박스 스타일, 복수 선택 가능 |
| hover | 항목에 마우스 올리면 배경 하이라이트 |
| ListboxWrapper | 테두리 + 둥근 모서리 래퍼 |

## Props

```typescript
interface ListboxSelectProps<T> extends MobxProps<T>,
  Omit<BaseListboxSelectProps<T>, "defaultSelectedKeys" | "onSelectionChange"> {}
```

- `state`: MobX observable 객체
- `path`: state 내 바인딩 경로
- `selectionMode`: "single" | "multiple" (기본값: "multiple")
- 나머지 BaseListboxSelectProps 전달

## 상태

| 모드 | 변경 시 |
|------|------|
| single | 선택된 첫 번째 키를 string으로 저장 |
| multiple | 선택된 모든 키를 string[]로 저장 |

## MobX 연동

- `observer`로 래핑
- `useFormField` 훅으로 양방향 바인딩
- `Set` 기반 defaultSelectedKeys 관리

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
