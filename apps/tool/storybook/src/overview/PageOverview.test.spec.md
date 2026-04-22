# PageOverview.test.tsx Spec

## 목적
- overview workspace가 Storybook/JSDOM 환경에서 안정적으로 렌더링되고 핵심 탐색 동작이 유지되는지 검증합니다.

## 핵심 동작
- React Flow가 요구하는 `ResizeObserver`, element size, `getBoundingClientRect`를 테스트 시작 시 mock 합니다.
- `[React Flow]:` 접두어를 가진 console noise만 억제하고, 나머지 `console.error`/`console.warn`는 원래 동작대로 유지합니다.
- app filter, catalog 검색, detail panel 선택 흐름이 사용자 기준으로 동작하는지 검증합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | React Flow 경고만 선택적으로 억제하는 console mock 규칙과 overview test 목적을 문서화하는 sidecar 신규 추가 | codex |
