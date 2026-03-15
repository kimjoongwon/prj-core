# webpack.config.js 기획서

> 생성일: 2026-03-15
> 타입: config
> 위치: apps/idp/api/webpack.config.js

## 역할

IDP API의 Nest webpack watch/HMR 실행 방식을 정의한다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| RunScriptWebpackPlugin | watch 빌드 후 번들 엔트리 실행을 담당한다. |
| `cwd: __dirname` | child process가 앱 디렉터리 기준으로 실행되어 `.env` 탐색이 깨지지 않도록 보장한다. |
| WatchPackagesPlugin | workspace 패키지의 `dist` 변경을 watch 대상으로 추가한다. |

## 의존성

| 모듈 | 용도 |
|------|------|
| path | workspace 패키지 경로 계산 |
| fs | watch 대상 디렉터리 존재 여부 확인 |
| run-script-webpack-plugin | watch 빌드 후 서버 프로세스 실행 |

## 구현 체크리스트

- [ ] watch 모드에서 번들 산출물 실행이 유지된다.
- [ ] child process가 앱 디렉터리 기준 env 파일을 읽는다.
- [ ] workspace 패키지 dist 변경이 rebuild를 유발한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | 이 설정 파일이 `start:dev` 전용이라는 전제에 맞춰 HMR/RunScript 플러그인을 항상 활성화해 watch child process가 실제 서버를 띄우도록 수정 | codex |
| 2026-03-15 | `RunScriptWebpackPlugin` child process에 `cwd: __dirname`를 지정해 루트 `pnpm start`에서도 `.env`를 올바르게 읽도록 수정 | codex |
