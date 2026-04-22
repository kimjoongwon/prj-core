# fe-mo-page-builder.toml 기획서

> 생성일: 2026-04-13
> 타입: agent-config
> 위치: .codex/agents/mobile/fe-mo-page-builder.toml

## 역할

`fe-mo-page-builder`를 Expo route screen `index.tsx` 전용 builder로 정의합니다.
이 role은 `apps/mobile/src/app/**/index.tsx`에서 실제 화면 UI, interaction wiring, route-level composition을 구현합니다.

## 운영 규칙

- 기본 출력 대상은 `apps/mobile/src/app/**/index.tsx`와 같은 위치의 `index.spec.md` 입니다.
- v1에서는 route file 자체를 화면 owner 로 간주하며, `packages/fe-mo-ui/src/page/**` pure page 분리는 기본값이 아닙니다.
- 화면 구현은 `_layout.spec.md`의 shell 계약을 소비하고 route-level content 만 담당합니다.
- 화면 코드에는 RN gesture, keyboard, safe-area, modal/bottom sheet UX 제약을 반영합니다.
- 필요할 때만 `packages/fe-mo-ui/**` 공유 primitive 를 호출하고, route 전용 구조는 앱 파일에 유지합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-13 | Expo route screen active builder 로 승격하고 route file owner 규칙을 추가 | codex |
