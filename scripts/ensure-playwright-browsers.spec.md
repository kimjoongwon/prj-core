# ensure-playwright-browsers script 기획서

> 생성일: 2026-04-22
> 타입: script
> 위치: scripts/ensure-playwright-browsers.mjs

## 역할

현재 워크스페이스의 Playwright CLI를 사용해 필요한 브라우저를 user-level cache에 보장합니다.
`PLAYWRIGHT_BROWSERS_PATH`가 지정되면 그 값을 우선하며, 상대 경로는 현재 작업 디렉터리 기준 절대 경로로 정규화합니다.
현재 Playwright 버전의 설치 대상 경로를 `--dry-run`으로 먼저 계산한 뒤, 필요한 revision이 이미 있으면 실제 install을 생략합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 실행 | `node scripts/ensure-playwright-browsers.mjs` |
| 기본 브라우저 | 인자가 없으면 `chromium` |
| 다중 브라우저 | 인자로 `chromium firefox webkit` 등을 전달 |
| CLI 해석 | 호출한 워크스페이스의 `pnpm exec playwright install ...` 사용 |
| 설치 경로 | 기본은 Playwright 기본 user cache, `PLAYWRIGHT_BROWSERS_PATH` 지정 시 override |
| 상대 경로 처리 | `PLAYWRIGHT_BROWSERS_PATH=./tmp/pw` 같은 값은 호출 CWD 기준 절대 경로로 변환 |

## 구현 체크리스트

- [x] Playwright 기본 user cache 정책을 존중
- [x] `PLAYWRIGHT_BROWSERS_PATH` override를 그대로 전달
- [x] 상대 경로 override를 절대 경로로 정규화
- [x] 현재 워크스페이스의 Playwright 버전을 사용
- [x] 현재 revision이 이미 설치된 경우 실제 download/install을 생략

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-22 | `playwright install --dry-run` 결과를 이용해 현재 revision이 이미 있으면 실제 install을 건너뛰도록 최적화 | codex |
| 2026-04-22 | Playwright browser bootstrap을 user-level cache 기반으로 공용화하는 ensure 스크립트 신규 추가 | codex |
