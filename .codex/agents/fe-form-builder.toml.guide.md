# fe-form-builder.toml 기획서

> 생성일: 2026-03-21
> 타입: agent-config
> 위치: .codex/agents/fe-form-builder.toml

## 역할

`form` 재사용 계층 전용 builder입니다.
Create/Edit 페이지가 소비하는 입력 form 계층을 `feature`와 같은 위계의 page 밖 재사용 UI로 정리하는 규칙을 담당합니다.

## 운영 규칙

- 생성/수정 본문 입력 UI는 `form`이 소유합니다.
- `AiForm`은 상단 보조 feature이고, 실제 입력 필드 조합은 이 builder가 정리합니다.
- 도메인별 widget 폴더에 흩어진 폼 위젯은 `form`으로 통합합니다.
- form은 반드시 `packages/fe-ui/src/control`의 control component를 사용합니다.
- 필요한 control이 없으면 `fe-control-component-builder` 기준으로 control을 먼저 생성한 뒤 form을 조합합니다.
- form은 field state를 소유하지 않고 외부에서 받은 `state` slice만 사용합니다.
  - page root state 설계는 `fe-page-builder`
  - form은 `loginForm`, `resetPasswordForm` 같은 form slice만 소비
  - form slice는 page MobX class 내부에 선언된 observable field를 기본 계약으로 사용합니다.
- form은 submit/cancel/click handler props를 직접 받지 않습니다.
  - action은 `type="submit"` 또는 `data-action` 같은 signal만 배치합니다.
  - 실제 이벤트 binding은 page/feature가 wrapper에서 소유합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | form state source를 page MobX class 내부 field 기준으로 정리 | codex |
| 2026-04-22 | form이 받는 `state` slice는 plain object가 아니라 MobX observable object여야 한다는 규칙을 추가 | codex |
| 2026-04-22 | form이 이벤트 handler props를 직접 받지 않고 상위 page/feature가 native event를 소유한다는 규칙을 추가 | codex |
| 2026-04-22 | form이 control-only 조합과 external state slice 소비만 담당하도록 운영 규칙을 보강 | codex |
| 2026-03-25 | agent 이름을 `fe-form-builder`로 단순화하고 `form`을 `feature`와 같은 위계의 루트 계층으로 승격 | codex |
| 2026-03-21 | form 재사용 계층 전용 builder 신규 추가 | codex |
| 2026-03-23 | role 메타데이터(name/description)와 config 등록 기준을 반영해 로컬 role 인식 조건을 명시 | codex |
