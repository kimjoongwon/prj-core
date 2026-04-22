# OidcConsentPanel widget 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/form/OidcConsentPanel/OidcConsentPanel.tsx

## 역할

OIDC consent 상태를 시각화하는 form/widget 컴포넌트입니다.
상위 page/feature가 소유한 `OidcConsentPanelState`를 받아 scope 목록, 에러, 로딩 상태를 렌더링합니다.
confirm/abort 이벤트 연결은 상위 wrapper가 소유하고 이 컴포넌트는 `data-action` 기반 action element만 제공합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcConsentPanelState | 공개 계약 요소 |
| OidcConsentPanelProps | 공개 계약 요소 |
| OidcConsentPanel | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/constant | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| ../../control | 기능 구현 의존성 |
| ../../../display/feedback/AlertBanner/AlertBanner | 기능 구현 의존성 |
| ../../../widget/AuthCard/AuthCard | 기능 구현 의존성 |
| ../../../widget/AuthCard/AuthCardHeader | 기능 구현 의존성 |

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. 필요한 의존 모듈을 호출해 데이터를 조합합니다.
3. 결과를 렌더링/반환/전파합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | local state와 handler props를 제거하고 external `OidcConsentPanelState` + `data-action` contract로 정리 | codex |
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-06 | AlertBanner 의존 경로를 `../../../display/*`로 변경 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
| 2026-03-13 | API 의존을 root barrel에서 split subpath import로 전환 | codex |
