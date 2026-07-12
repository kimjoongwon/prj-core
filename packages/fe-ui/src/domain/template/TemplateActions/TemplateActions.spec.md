# TemplateActions domain 컴포넌트 기획서

> 생성일: 2026-03-03
> 타입: domain/template
> 위치: packages/fe-ui/src/domain/template/TemplateActions/TemplateActions.tsx

## 역할

`TemplateActions`는 템플릿 상세 action을 표시합니다.
`TemplatePreviewModal`과 `TemplateSendTestModal`은 각각 독립 폴더에서 `AppModalHost`가 전달한 `ModalState`를 사용하며 API 호출과 상태별 body를 직접 소유합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| TemplateActionsProps | 공개 계약 요소 |
| TemplateActions | 공개 계약 요소 |
| TemplatePreviewModal / TemplatePreviewModalState | 미리보기 Modal content와 상태 |
| TemplateSendTestModal / TemplateSendTestModalState | 테스트 발송 Modal content와 상태 |

## Modal 상태 계약

- route는 `app.modal.open()`으로 title, 전용 state, content component만 연결합니다.
- 미리보기와 테스트 발송 API는 각 Modal content가 직접 호출합니다.
- 입력값, 진행 상태, 성공·실패 결과는 각 `*ModalState`가 소유합니다.
- HeroUI `Modal` shell은 `AppModalHost`만 렌더링합니다.

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/templates | 미리보기·테스트 발송 API |
| @cocrepo/store | App Modal content 계약 |
| mobx / mobx-react-lite | Modal domain state와 반응형 렌더링 |
| @heroui/react | 미리보기 진행 Spinner |
| VariableInputForm / Button | 변수 입력과 Modal action |

## 동작 흐름

1. route가 템플릿 정보로 전용 Modal state를 생성합니다.
2. `app.modal.open()`이 state와 content component를 `AppModalHost`에 전달합니다.
3. Modal content가 API를 호출하고 state에 성공·실패 결과를 확정합니다.
4. 닫기 action은 전달받은 `ModalState.close()`를 호출합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함
