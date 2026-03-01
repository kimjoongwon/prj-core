# AiForm Feature 기획서

> 생성일: 2026-02-28
> 타입: feature
> 위치: `packages/fe-ui/src/components/feature/AiForm/`

## 목적

Create/Update 화면 상단에서 AI 자동 채움 UX를 제공합니다.

- `aiSchemas`에서 채움 스키마를 선택합니다.
- `fieldMeta[path].ai.fillable` 및 `ui(readOnly/hidden/disabled)` 규칙으로 필드 선택 가능 여부를 판정합니다.
- 펼침 패널의 compact chip 토글로 선택한 path만 AI 요청 대상으로 보냅니다.
- 응답 patch는 허용 path만 적용하고, 적용 후 `onRevalidate`를 호출합니다.
- 적용 필드 선택 UI는 기본 접힘 상태이며, `적용 필드 선택` 버튼으로 펼쳐서 compact 목록에서 선택합니다.
- 펼침 패널은 `max-height/opacity` 전환 애니메이션으로 부드럽게 열고 닫습니다.
- 필드 chip은 선택/터치 시 scale 모션으로 상태 변화를 강조합니다.
- 헤더 타이틀은 `지능형 채움`으로 표기합니다.

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
| 2026-03-01 | 적용 필드 선택 영역을 버튼 기반 접기/펼치기 + compact 2열 목록으로 변경해 화면 점유 높이 축소 | codex |
| 2026-03-01 | 기본 레이아웃을 스키마/필드/채우기 1줄 중심으로 재구성하고 추가 요청사항을 펼침 패널 내부로 이동해 기본 높이를 추가 축소 | codex |
| 2026-03-01 | 필드 선택 방식을 chip 토글로 압축하고 펼침 패널 열림/닫힘 애니메이션 및 한국어 타이틀(`지능형 채움`) 적용 | codex |
| 2026-03-01 | 펼침 패널을 framer-motion 기반 전환으로 강화하고 chip 선택/탭 scale 모션 추가 | codex |
