# IdpLogin feature 기획서

> 생성일: 2026-03-03
> 타입: feature
> 위치: packages/fe-ui/src/feature/idp/IdpLogin/IdpLogin.tsx

## 역할

이 파일은 feature 계층에서 `OidcLoginForm`에 API 로직을 연결합니다.
폼 입력 state는 feature가 소유하고, form에는 외부 state만 주입합니다.
submit/abort 이벤트는 feature wrapper가 native event로 연결합니다.
feature 로컬 state는 `IdpLoginFeatureState` MobX class 하나가 소유합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| IdpLoginProps | 공개 계약 요소 |
| IdpLogin | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/idp/interaction | 기능 구현 의존성 |
| axios | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| ../../../form/OidcLoginForm/OidcLoginForm | 기능 구현 의존성 |

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