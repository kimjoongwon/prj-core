# ConditionEditor Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/ability/ConditionEditor/

## 역할

CASL Ability의 conditions(JSON 조건)를 편집하는 위젯입니다. Textarea 기반 JSON 편집기로, 실시간 JSON 유효성 검사와 템플릿 변수(${user.id}, ${user.spaceId} 등) 삽입 기능을 제공합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
  조건 (Conditions)                                    ℹ
  ┌─────────────────────────────────────────────────┐
  │ {                                               │
  │   "authorId": "${user.id}"                      │
  │ }                                               │
  │                                                 │
  └─────────────────────────────────────────────────┘
  템플릿 변수: [${user.id}] [${user.spaceId}] [${user.roleId}]

  --- 에러 상태 ---

  조건 (Conditions)                                    ℹ
  ┌─────────────────────────────────────────────────┐
  │ { invalid json                                  │
  │                                                 │
  └─────────────────────────────────────────────────┘
  ⚠ 유효하지 않은 JSON 형식입니다
  템플릿 변수: [${user.id}] [${user.spaceId}] [${user.roleId}]

  --- 비활성 상태 ---

  조건 (Conditions)                                    ℹ
  ┌─────────────────────────────────────────────────┐
  │ (편집 불가)                                      │
  └─────────────────────────────────────────────────┘
  [${user.id}] [${user.spaceId}]  (클릭 불가)
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 (유효한 JSON) | Textarea에 포맷된 JSON 표시, 에러 없음 |
| JSON 파싱 에러 | Textarea 하단에 ⚠ 에러 메시지 표시 |
| 외부 에러 (error prop) | error prop 문자열을 에러 메시지로 표시 |
| 비활성 (isDisabled=true) | Textarea 및 변수 버튼 모두 비활성화 |
| 필드 목록 있음 | 필드명 기반 변수 버튼 추가 표시 |

## Props

```typescript
interface ConditionEditorProps {
  value: Record<string, unknown> | null;
  onChange: (conditions: Record<string, unknown> | null) => void;
  subjectFields?: string[];
  error?: string;
  isDisabled?: boolean;    // 기본값: false
  label?: string;          // 기본값: "조건 (Conditions)"
  className?: string;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| Textarea (커스텀) | JSON 코드 편집 (font-mono) |
| HeroUI Chip | 템플릿 변수 삽입 버튼 |
| HeroUI Tooltip | 필드 목록 안내, 변수 라벨 표시 |
| lucide-react 아이콘 | AlertCircle(에러), Info(안내) |
| VStack, HStack | 레이아웃 |

## 상태 관리

로컬: textValue (JSON 문자열, useState), internalError (파싱 에러, useState). 외부 value 변경 시 useEffect로 동기화.

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
