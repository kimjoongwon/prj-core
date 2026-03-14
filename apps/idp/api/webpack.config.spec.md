# webpack.config.js Spec

## 목적

- `idp-api`의 Nest Webpack 빌드 동작을 정의한다.
- 개발 감시 모드에서는 HMR과 번들 결과 실행을 허용한다.
- 일반 빌드 모드에서는 산출물 생성만 수행하고 서버 프로세스를 실행하지 않는다.

## 동작 규칙

- `options.watch === true`일 때만 `webpack/hot/poll?100` 엔트리를 추가한다.
- `options.watch === true`일 때만 `HotModuleReplacementPlugin`을 등록한다.
- `options.watch === true`일 때만 `RunScriptWebpackPlugin`으로 번들 결과를 실행한다.
- `options.watch === true`일 때만 workspace 패키지 `dist` 감시 플러그인을 등록한다.
- watch 모드가 아니면 externals 규칙만 유지한 순수 서버 번들 빌드를 수행한다.
- `@cocrepo/prisma`는 Prisma generated client 런타임을 보존하기 위해 watch/build 여부와 무관하게 external 처리한다.

## 기대 효과

- `pnpm build:idp-api`는 `dist` 생성만 수행하고 포트를 점유하지 않는다.
- `pnpm start:idp-api`는 기존과 동일하게 watch + HMR 개발 루프를 유지한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Prisma generated client가 webpack 번들 안에서 깨지지 않도록 `@cocrepo/prisma`를 external 처리 | codex |
| 2026-03-08 | 일반 build에서 서버가 실행되지 않도록 watch 모드에서만 HMR/RunScript 플러그인을 활성화하는 규칙 추가 | Codex |
