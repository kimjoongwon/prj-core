# fe-route-layout-builder.toml 기획서

> 생성일: 2026-03-21
> 타입: agent-config
> 위치: .codex/agents/fe-route-layout-builder.toml

## 역할

`fe-route-layout-builder`를 Next.js App Router `apps/**/layout.tsx` 전용 builder로 정의합니다.
이 agent는 서버 `layout.tsx`에서 route 단위 화면 skeleton, surface ownership, named slot topology를 구현합니다.

## 운영 규칙

- `layout.tsx`는 기본적으로 서버 컴포넌트로 유지합니다.
- route skeleton의 `Page`, `PageSurface`, `Section`, `SectionSurface`, `Surface` 조합은 `layout.tsx`에서 소유합니다.
- named slot은 예외 패턴으로만 사용하며, 사용 시 `@slot/default.tsx` fallback을 반드시 둡니다.
- slot 이름은 구조적 의미만 사용하고, `page.tsx` / `@slot/**/page.tsx`는 skeleton이 아니라 콘텐츠만 소유합니다.
- `page.tsx`는 해당 skeleton 안의 콘텐츠만 담당하며 route-level layout primitive를 다시 만들지 않습니다.
- `layout.spec.md`가 route skeleton의 1차 계약 문서입니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-21 | route `layout.tsx` 전용 builder 신규 추가 및 서버 skeleton ownership 규칙 정의 | codex |
| 2026-03-21 | parallel routes / slots 도입 기준과 fallback 규칙을 추가 | codex |
