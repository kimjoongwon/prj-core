# start.sh 기획서

> 생성일: 2026-03-08
> 타입: script
> 위치: scripts/start.sh

## 역할

로컬 개발용 대화형 서비스 런처입니다.
선택한 앱 목록을 Turbo `start:dev` 필터로 변환하고, 필요 시 API codegen 흐름까지 조율합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 기본 실행 | `pnpm start`로 대화형 선택 UI 표시 |
| 숫자 선택 | `1`~`6` 번호로 서비스 선택 |
| 이름 선택 | `core-api`, `admin-web`, `proposal-web`, `idp-api`, `idp-web`, `tool-storybook` 문자열 인자 허용 |
| 허용 별칭 | canonical workspace 이름과 대응하는 `start:*` 형태 인자 허용 |
| 실행 엔진 | 최종 실행은 `turbo start:dev <filters> --concurrency=20` |

## 구현 체크리스트

- [x] 숫자 선택과 서비스명 인자를 모두 지원
- [x] canonical workspace 이름을 기준으로 Turbo filter 생성
- [x] 구식 짧은 별칭 없이 canonical 이름과 `start:*` 인자만 수용
- [x] codegen 및 포트 정리 기존 흐름 유지

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-20 | `proposal-web`을 대화형/비대화형 시작 대상에 추가하고 포트/프로세스 정리 규칙을 확장 | codex |
| 2026-03-08 | 숫자 선택 외에 canonical workspace 이름과 `start:*` 별칭 인자를 받아 root 스크립트 체계와 정렬 | codex |
| 2026-03-08 | `server`, `admin`, `storybook` 같은 구식 짧은 별칭 인자를 제거 | codex |
