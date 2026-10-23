# Jenkinsfile.dolmen-web 기획서

> 생성일: 2026-10-19
> 타입: jenkins-pipeline
> 위치: devops/Jenkinsfile.dolmen-web

## 역할

`dolmen-web`(Next.js 채팅 화면) 이미지를 빌드·푸시하고 GitOps 범프 잡을 트리거한다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 이미지 경로 | `harbor.onjitda.com/{prod\|stg}/dolmen-web` — SHA-12 커밋 태그 |
| 브랜치 정책 | Jenkinsfile은 `main`(prod), `stg`(stg)를 허용하며 해당 브랜치를 직접 체크아웃. 실제 배포 파일·Application은 stg만 존재 |
| GitOps 트리거 | `APP_NAME=dolmen-web`, `DEPLOY_ENV=ENV_NAME` |

## 비고

- 2026-10-22 소스 기준 `prj-deploy stg/` 태그와 ArgoCD stg Application만 연결됩니다. `BRANCH_NAME=stg`로 수동 실행합니다. push-router는 main도 자동 호출하므로 이미지 push 후 prod 범프가 `Values file not found`로 실패할 수 있습니다. main 허용을 prod 배포 지원으로 해석하지 않습니다.
- GitOps 호출은 `wait: false`이므로 후속 범프 잡 실패는 앱 빌드 성공으로 전파되지 않습니다. 범프·ArgoCD·Buzz 결과를 별도 확인합니다.
- 이미지 빌드 상세(turbo prune + standalone)는 `Dockerfile.dolmen-web.ops.md` 참고.
- 런타임에 `DOLMEN_API_URL`(Next.js `src/app/api/[...path]/route.ts` 프록시 대상)은 차트 extraEnv로 주입한다.
