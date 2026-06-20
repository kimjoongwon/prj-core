# HeaderSpaceSelector feature 기획서

> 생성일: 2026-03-03
> 타입: feature
> 위치: packages/fe-ui/src/feature/HeaderSpaceSelector/HeaderSpaceSelector.tsx

## 역할

이 파일은 feature 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| HeaderSpaceSelector | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| mobx-react-lite | 기능 구현 의존성 |
| ../../widget/SpaceSelectorDropdown | 기능 구현 의존성 |
| ./type | 기능 구현 의존성 |

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. `SpaceSelectorDropdown`으로 props를 그대로 전달합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.
- 내부 widget이 선택 가능한 Space가 아직 없을 때도 disabled placeholder를 렌더링하므로 헤더 레이아웃이 갑자기 비지 않습니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함