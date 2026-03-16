# nextNavigationMock.ts Spec

## 목적
- `react-vite` 기반 Storybook에서 `next/navigation` 의존 컴포넌트를 안전하게 렌더링합니다.

## 핵심 동작
- `useRouter`, `usePathname`, `useSearchParams`를 브라우저 `history` 기반 mock으로 제공합니다.
- Storybook iframe 안에서 쿼리스트링/경로를 변경해도 Next.js 런타임 없이 스토리를 계속 렌더링합니다.
- `redirect`, `notFound` 호출은 Storybook 환경에서 즉시 드러나도록 명시적 예외를 던집니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-16 | Storybook react-vite 환경용 `next/navigation` mock을 추가 | codex |
