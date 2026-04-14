# storybookMock.ts Spec

## 목적
- `packages/fe-ui/src/page` Storybook에서 복합 prop fixture가 아직 세밀하지 않은 페이지도 canvas에서 안전하게 렌더되도록 deep mock 유틸리티를 제공합니다.
- scaffold 제거 후에도 imported object/function prop 때문에 story가 즉시 깨지지 않게 방어합니다.

## 핵심 동작
- 함수 호출, 배열 메서드, iterator 접근을 모두 안전한 기본값으로 처리합니다.
- 알 수 없는 중첩 property 접근은 다시 mock을 반환해 deep object처럼 동작합니다.
- Promise처럼 오인되지 않도록 `then`은 `undefined`를 반환합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | page Storybook bulk fixture 생성을 위한 deep mock 유틸리티 추가 | Codex |
