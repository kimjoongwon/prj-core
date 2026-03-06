# ability index widget 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/widget/ability/index.ts

## 역할

권한 관리 관련 widget을 `widgets/ability` 하위에서 단일 진입점으로 공개합니다.

## 핵심 동작

- 능력 규칙 관리용 모달/목록/매트릭스/조건 편집기를 함께 export 합니다.
- 기존 `widgets/ability`와 `widgets/ability`에 분산된 공개 대상을 하나의 배럴로 통합합니다.

## 의존성

| 모듈 | 용도 |
|------|------|
| `./AbilityFormModal` | 권한 규칙 생성/수정 모달 |
| `./AbilityMatrixView` | 권한 매트릭스 표시 |
| `./AbilityRuleList` | 권한 규칙 목록 |
| `./ActionConfigEditor` | 액션 설정 편집 |
| `./ConditionEditor` | 조건식 편집 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-06 | `widgets/ability`와 `widgets/ability` export를 병합 | codex |
| 2026-03-06 | widget 경로를 widgets로 통합 | codex |
