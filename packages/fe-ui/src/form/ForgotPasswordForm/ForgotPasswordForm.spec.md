# ForgotPasswordForm widget 기획서

> 생성일: 2026-03-03
> 타입: widget
> 위치: packages/fe-ui/src/form/ForgotPasswordForm/ForgotPasswordForm.tsx

## 역할

비밀번호 찾기 field state를 상위 page/feature가 소유하도록 두고, form은 `control` 조합과 단계별 시각 표현만 담당합니다.
submit 이벤트 연결은 상위 page/feature wrapper가 소유하고, form은 handler props를 직접 받지 않습니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| ForgotPasswordFormState | 공개 계약 요소 |
| ForgotPasswordFormProps | 공개 계약 요소 |
| ForgotPasswordForm | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
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
| 2026-04-22 | submit handler prop 없이 state와 링크 정보만 받도록 contract를 정리 | codex |
| 2026-04-22 | field state와 제출 상태를 상위에서 주입받고 form 내부는 control-only 조합으로 재정의 | codex |
| 2026-03-06 | AlertBanner 의존 경로를 `../../../display/*`로 변경 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
| 2026-03-13 | API 의존을 root barrel에서 split subpath import로 전환 | codex |
