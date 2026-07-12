# AppModalHost

## 역할

- 앱 최상단 `App.GlobalLayer`에서 단일 HeroUI Modal shell을 렌더링합니다.
- `app.modal.current`의 title과 content를 Header와 Body에 연결합니다.
- component와 render callback content 모두 동일한 `ModalState`를 받습니다.

## 소유 경계

- Host는 Backdrop, Container, Dialog, Header, Body만 소유합니다.
- domain content는 Body 내부 UI와 action을 소유하며 `ModalState.close()`로 닫습니다.
- Footer는 공통 shell 계약에 포함하지 않습니다.
