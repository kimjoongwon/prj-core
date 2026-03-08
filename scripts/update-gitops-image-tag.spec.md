# update-gitops-image-tag script 기획서

> 생성일: 2026-03-08
> 타입: script
> 위치: scripts/update-gitops-image-tag.sh

## 역할

Jenkins 파이프라인에서 GitOps 저장소의 애플리케이션 이미지 태그를 갱신하고 커밋/푸시합니다.
외부 저장소 내부 스크립트 경로에 의존하지 않도록 `prj-core` 로컬 스크립트로 동작합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 지원 앱 | `idp-api`, `idp-web`, `core-api`, `admin-web`, `spring-api` |
| 지원 환경 | `prod`/`production` |
| 대상 파일 | `helm/applications/<app>/values-prod.yaml` |
| 업데이트 키 | `<app>.image.tag` |
| 입력 인자 | `--app --tag --env --repo-url --workdir --branch --git-user-name --git-user-email --push-retries` |
| 출력 | 태그 갱신 후 Git commit/push 수행 결과 로그 |

## 구현 체크리스트

- [ ] 필수 인자(`--app`, `--tag`)를 검증함
- [ ] 지원 앱/환경 외 입력은 즉시 실패함
- [ ] `--workdir`가 있으면 해당 체크아웃을 재사용함
- [ ] `values-prod.yaml`에서 해당 앱 블록의 `tag`만 갱신함
- [ ] 변경이 있으면 commit/push, 없으면 종료함
- [ ] push 실패 시 `--push-retries` 횟수만큼 재시도함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-08 | Jenkins가 `prj-devops` 내부 스크립트 경로 부재로 실패하지 않도록 로컬 GitOps 태그 업데이트 스크립트 신규 추가 | codex |
| 2026-03-08 | push 실패 원인 가시성을 위해 원격 에러 메시지(토큰 마스킹) 출력 추가, non-fast-forward 충돌 시 fetch+rebase 자동 재시도 로직 추가 | codex |
