# layouts 배럴 기획서

> 생성일: 2026-03-03
> 타입: layout
> 위치: packages/fe-ui/src/components/layouts/index.ts

## 역할

`@cocrepo/ui`의 layout 컴포넌트 export 진입점을 관리합니다.
공용으로 노출할 layout만 선택적으로 re-export 합니다.

## 표준 위계

```text
App (서비스별 단일) > Layout > Page > Section
```

- `Layout` 계층은 `packages/fe-ui/src/components/ui/layouts/Layout`에서 제공합니다.
- 이 배럴은 위계 중 `App`, `Page`, `Section` 레벨을 노출합니다.

## 동작

- `App`, `Page`, `Section` 등 현재 표준 layout 컴포넌트를 export합니다.
- 제거된 컴포넌트(`Main`, `Header`)는 export하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | Shell 접미사 제거 및 불필요한 `Main`/`Header` export 제거 | codex |
| 2026-03-04 | `App > Layout > Page > Section` 위계 설명 및 Layout 계층 위치 명시 | codex |
