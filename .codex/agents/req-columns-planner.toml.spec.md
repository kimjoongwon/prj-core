# req-columns-planner.toml 기획서

> 생성일: 2026-03-28
> 타입: agent-config
> 위치: .codex/agents/req-columns-planner.toml

## 역할

`req-columns-planner`는 `packages/fe-ui/src/columns` 레이어의 선언 계약을 기획합니다.
`columns`가 UI를 직접 소유하지 않고 `src/cell` 자산만 조합하도록 spec 기준을 고정합니다.

## 운영 규칙

- `fe-columns-builder` 문서를 먼저 읽고 출력 경로, 필수 규칙, 금지 규칙, 검증 명령을 반영합니다.
- 기본 산출물은 `packages/fe-ui/src/columns/master/[Domain]Columns.spec.md`입니다.
- 공용 helper/factory 변경이 필요하면 `packages/fe-ui/src/columns/internal/masterFactory.spec.md`를 함께 갱신합니다.
- 공개 배럴이 바뀌면 `packages/fe-ui/src/columns/index.spec.md`도 함께 갱신합니다.
- `columns`는 Cell UI를 직접 정의하지 않고 `packages/fe-ui/src/cell/**` 공개 컴포넌트만 조합해야 합니다.
- `columns/raw/**`와 `rawFactory.*`는 신규 계획 대상이 아닙니다.
- 목록/테이블 화면의 `page.spec.md`와 같은 데이터 블록을 기준으로 column 계약을 맞춥니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-28 | `fe-columns-builder` 대응 columns planner role을 신설 | codex |
