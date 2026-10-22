# Jenkinsfile.dolmen-api 기획서

> 생성일: 2026-10-19
> 타입: jenkins-pipeline
> 위치: devops/Jenkinsfile.dolmen-api

## 역할

`dolmen-api` 이미지를 원격 BuildKit(buildkitd)으로 빌드해 Harbor에 푸시하고,
GitOps 범프 잡(prj-deploy `{env}/dolmen-api.yaml`)을 트리거한다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 이미지 경로 | `harbor.onjitda.com/{prod\|stg}/dolmen-api` — SHA-12 커밋 태그 |
| 브랜치 정책 | Jenkinsfile은 `main`(prod), `stg`(stg)를 허용하며 해당 브랜치를 직접 체크아웃. 실제 배포 파일·Application은 stg만 존재 |
| GitOps 트리거 | `APP_NAME=dolmen-api`, `DEPLOY_ENV=ENV_NAME`, 빌드 성공 후 비동기 |
| 알림 | buzz #cicd 성공/실패 (성공 event_id로 범프 스레드 묶음, 실패 시 @ZCode) |

## 비고

- 2026-10-22 소스 기준 `prj-deploy stg/` 태그와 ArgoCD stg Application만 연결됩니다. `BRANCH_NAME=stg`로 수동 실행합니다. push-router는 main도 자동 호출하므로 이미지 push 후 prod 범프가 `Values file not found`로 실패할 수 있습니다. main 허용을 prod 배포 지원으로 해석하지 않습니다.
- GitOps 호출은 `wait: false`이므로 후속 범프 잡 실패는 앱 빌드 성공으로 전파되지 않습니다. 범프·ArgoCD·Buzz 결과를 별도 확인합니다.
- 잡 등록: prj-devops jenkins values `app-build-jobs` + `push-router` 배열 (2026-10-19 등록).
- stg 빌드는 수동 실행(BRANCH_NAME=stg) — 워크스페이스 AGENTS.md 파이프라인 참고.
