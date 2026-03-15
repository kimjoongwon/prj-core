# fe-menu-builder.toml 기획서

> 생성일: 2026-03-15
> 타입: agent-config
> 위치: .codex/agents/fe-menu-builder.toml

## 역할

메뉴 시스템 builder agent가 Layout과 Page의 책임을 혼동하지 않도록 기준을 정의합니다.
공유 탭/서브네비게이션은 Layout에서, 페이지 제목은 `PageTitleBar`에서 담당하도록 고정합니다.

## 운영 규칙

- Layout은 `PageTabs` 같은 공유 네비게이션만 렌더하고 페이지별 헤더는 소유하지 않습니다.
- 페이지 본문 예시는 `Page + PageTitleBar` 구조를 기준으로 설명하고, 필요 시 본문 안에 `PageSurface`, `SectionSurface`를 표현 레이어로 둘 수 있습니다.
- `PageSurface`, `SectionSurface`는 메뉴 구조를 대체하는 컴포넌트로 설명하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | 메뉴 builder 문맥에서 Surface를 표현 레이어로만 사용하는 기준으로 정정 | codex |
| 2026-03-15 | 메뉴 builder 예시를 `PageSurface/SectionSurface`에서 `Page + PageTitleBar + Section` 패턴으로 정합화 | codex |
