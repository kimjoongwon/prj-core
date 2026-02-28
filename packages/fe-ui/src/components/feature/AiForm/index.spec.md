# AiForm Feature 기획서

> 생성일: 2026-02-28
> 타입: feature
> 위치: `packages/fe-ui/src/components/feature/AiForm/`

## 목적

Create/Update 화면 상단에서 AI 자동 채움 UX를 제공합니다.

- `aiSchemas`에서 채움 스키마를 선택합니다.
- `fieldMeta[path].ai.fillable` 및 `ui(readOnly/hidden/disabled)` 규칙으로 필드 선택 가능 여부를 판정합니다.
- 체크박스로 선택한 path만 AI 요청 대상으로 보냅니다.
- 응답 patch는 허용 path만 적용하고, 적용 후 `onRevalidate`를 호출합니다.

## Props

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `formState` | `TForm` | ✅ | 현재 폼 상태 |
| `fieldMeta` | `Record<string, AiFormFieldMeta>` | ✅ | 경로별 AI/라벨 메타 |
| `aiSchemas` | `AiFormSchema[]` | ✅ | AI 스키마 목록 |
| `ui` | `AiFormUiPaths` | ✅ | `readOnly/hidden/disabled` 경로 집합 |
| `options` | `Record<string, AiFormOptionItem[]>` | ✅ | 경로별 Select 옵션 메타 |
| `onFill` | `(input) => Promise<{ patches }>` | ✅ | AI patch 생성 API 호출 |
| `applyPatch` | `(patches) => void` | ✅ | 폼 상태 patch 적용 |
| `onRevalidate` | `() => void` | ❌ | patch 적용 후 검증 재실행 |
| `disabled` | `boolean` | ❌ | 전체 비활성화 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-28 | 초기 생성 | Codex |
