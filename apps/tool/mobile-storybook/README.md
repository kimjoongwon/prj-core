# Mobile Storybook

Expo 기반 `@cocrepo/mo-ui` 온디바이스 Storybook입니다.

이 Storybook은 앱의 `AuthSessionGate`를 사용하지 않으며, API 401 응답이 발생해도 로그인 화면으로 리다이렉트하지 않도록 redirect target을 Storybook 전용 disabled URL로 고정합니다.

## 실행

```bash
pnpm start:mobile-storybook
pnpm ios:mobile-storybook
pnpm android:mobile-storybook
pnpm web:mobile-storybook
```

각 실행 스크립트는 8083 포트로 Expo Metro를 띄우고, 시작 전에 `.rnstorybook/storybook.requires.ts`를 자동 생성합니다. 스토리 목록만 갱신하려면 아래 명령을 사용합니다.

```bash
pnpm --filter=tool-mobile-storybook storybook:generate
```

## 스토리 위치

스토리는 `packages/fe-mo-ui/src/**/*.stories.tsx`를 수집합니다.

- 단일 컴포넌트 검증: 컴포넌트 폴더 옆에 `*.stories.tsx` 추가
- 여러 컴포넌트 묶음: `packages/fe-mo-ui/src/storybook/*.stories.tsx` 추가

## 확인

```bash
pnpm --filter=tool-mobile-storybook type-check
```
