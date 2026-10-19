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
| 브랜치 정책 | `main`(prod), `stg`(stg) 지원 — `Jenkinsfile.core-api` 패턴 복제 |
| GitOps 트리거 | `APP_NAME=dolmen-web`, `DEPLOY_ENV=ENV_NAME` |

## 비고

- 이미지 빌드 상세(turbo prune + standalone)는 `Dockerfile.dolmen-web.ops.md` 참고.
- 런타임에 `DOLMEN_API_URL`(rewrites 프록시 대상)은 차트 extraEnv로 주입한다.
