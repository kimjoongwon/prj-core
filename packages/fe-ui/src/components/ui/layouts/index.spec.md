# index ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-ui/src/components/ui/layouts/index.ts

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 표준 위계 연결

```text
App (서비스별 단일) > Layout > Page > Section
```

- 이 배럴은 표준 위계의 `Layout` 계층 컴포넌트 묶음(`./Layout`)을 노출합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| export | `./Layout` 배럴 export |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | Admin 배럴 제거 후 Layout 배럴로 교체 | codex |
| 2026-03-04 | `App > Layout > Page > Section` 위계 기준으로 Layout 계층 연결 설명 추가 | codex |
