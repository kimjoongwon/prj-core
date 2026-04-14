# space-scope.interceptor util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-common/src/context/space-scope.interceptor.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| SpaceScopeInterceptor | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-11 | lint 에러 대응을 위한 `intercept` 반환 타입 명시(`Observable<unknown>`) | codex |
| 2026-04-14 | Space scope 계산 설명을 x-space-id header 기반 current tenant 규칙으로 갱신 | codex |
