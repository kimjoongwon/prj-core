# 빌드·배포 토폴로지 런북

> 생성일: 2026-10-04 (idp-web 로그인 라우트 404 사고 + 빌드 파이프라인 B구조(buildkit) 통일 작업 기록)
> 목적: "무엇이 어디에 있고, 이미지가 어떻게 흐르며, 막혔을 때 어디부터 볼지"를 한 곳에 둬 다음 작업이 해매지 않게 한다.

## 1. 소유권 지도 — 무엇이 어디에 있나

| 관심사 | 소유 저장소·경로 | 비고 |
|---|---|---|
| 앱 소스, Dockerfile, 빌드 파이프라인 본문 | prj-core `devops/Dockerfile.*`, `devops/Jenkinsfile.*` | Jenkinsfile 6종은 전부 buildkit 구조 |
| **Jenkins 잡 정의(파라미터·scriptPath·경로 필터)** | prj-devops `helm/development-tools/jenkins/values.yaml`의 `app-build-jobs` Job DSL | **Jenkins UI 수동 관리 아님.** 잡 파라미터는 OpenBao가 아니라 이 파일이 주입 |
| helm 차트(앱·ingress·buildkitd·jenkins), ArgoCD 앱 정의, OpenBao 스크립트 | prj-devops `helm/`, `environments/argocd/` | |
| 운영 이미지 태그(GitOps 배포 상태) | prj-deploy `prod/<앱>.yaml` | 이 파일 푸시 = 배포 트리거 |
| 시크릿 값(harbor 로봇 계정, SMTP, 인증 서명) | OpenBao (`scripts/openbao/`로 관리) | 잡 설정·파라미터와 분리되어 있음 |

- Jenkins 차트는 **ArgoCD 밖**이다 — values 변경은 `helm upgrade` 수동 적용 필요.
- ArgoCD 앱들은 `automated + selfHeal` — prj-deploy main 푸시만 하면 롤아웃은 자동(폴링 60초 + 웹훅).
- **stg는 2026-10-04 서비스 단위로 재가동됨**(app-of-apps 설명 기준). 단 ingress-stg는 아직 미적용이라
  `stg.onjitda.com` 외부 라우팅은 404 — 접근은 클러스터 내부 경로(예: core-api-stg LoadBalancer 192.168.0.23)로만 가능.
  (이전 상태: app-of-apps `exclude: "*-stg.yaml"`로 전면 중단 — 재가동 전엔 stg가 통째로 404였음)

## 2. 이미지 빌드 흐름 (2026-10-04 B구조 통일 이후)

- 전 6개 앱 빌드 잡(core-api, admin-web, proposal-web, idp-api, idp-web, tool-storybook)이
  `buildctl` 원격 빌더로 클러스터의 **buildkitd**(`devops-tools` 네임스페이스, 서비스 1234/TCP, amd64, 4Gi)에서 빌드한다.
  podman 방식은 제거됨(이력은 prj-devops `docs/jenkins-build-speed-runbook.md`).
- 잡 파라미터(`TRUSTED_DEPLOYMENT=true`, `HARBOR_REGISTRY`, `HARBOR_CREDENTIAL_ID`, `GITOPS_UPDATE_JOB`, `BUZZ_NOTIFY_URL`)는
  Job DSL 루프가 **전 잡에 동일 주입** — 개별 잡 설정은 손볼 일이 없다.
- 태그 정책: 커밋 SHA 앞 12자리(immutable), prod 전용, latest 없음, main 브랜치만.
- 빌드 성공 → gitops-update 잡이 prj-deploy 태그 범프 → ArgoCD 동기화.

### 웹훅 다운 시 수동 빌드·배포 절차 (실측 레시피)

로컬 맥(arm64)에서 그냥 빌드하면 안 된다 — 아래 함정 참고. 클러스터 buildkitd를 원격 빌더로 쓴다:

```bash
# 0) 대상 커밋을 임시 워크트리로 (작업 중 변경 격리)
git worktree add --detach /tmp/prj-<app>-build <커밋SHA>

# 1) buildkitd 포트포워드
kubectl --context kubernetes-tunnel -n devops-tools port-forward svc/buildkitd 1234:1234

# 2) 원격 빌더 생성 + 네이티브 amd64 빌드 → tar export
docker buildx create --driver remote --name cluster-buildkit tcp://localhost:1234
docker buildx build --builder cluster-buildkit --platform linux/amd64 \
  -f devops/Dockerfile.<app> -t harbor.onjitda.com/prod/<app>:<SHA-12> \
  --output type=docker,dest=/tmp/<app>.tar .

# 3) 로컬에서 load/push (원격 데몬 직접 push는 인증 경로가 달라 실패할 수 있음)
docker load -i /tmp/<app>.tar && docker push harbor.onjitda.com/prod/<app>:<SHA-12>

# 4) gitops 범프: prj-deploy prod/<app>.yaml 태그 갱신 후 push → ArgoCD 자동 롤아웃
# 5) ImagePullBackOff 파드가 남으면 pod 삭제로 재풀 유도
```

### 아키텍처·인증 함정

- **클러스터 노드는 전부 amd64.** 맥(arm64)에서 `docker build`하면 arm64 이미지가 나가
  `no match for platform in manifest`으로 ImagePullBackOff. 로컬에서 `--platform linux/amd64` 강제는
  RUN 전부가 에뮬레이션으로 돌아 heavy 빌드(next/turbo)는 OOM(exit 137). 원격 buildkitd가 정답.
- 원격 buildkit에서 `--output push=true` 직접 푸시는 데몬 시크릿 경로가 아니면 토큰 응답이 HTML로 와 실패 — tar export 후 로컬 push가 확실.
- `scripts/rancher-build.sh`는 core-api/admin-web/proposal-web만 지원. package.json의 `rancher:idp-web`/`rancher:idp-api`는 **실제로 실패**하니 위 레시피를 쓸 것.

## 3. 운영 토폴로지·확인 경로

- 진입: `onjitda.com`(메인: admin-web `/admin`, `/api/v1/auth|idp|oidc-clients|oidc-sessions` → idp-api, `/api` 폴백 → core-api, `/proposal`, `/story`)
  / `idp.onjitda.com`(`/oidc`·`/api` → idp-api, `/` → idp-web).
  **`/oidc` 라우팅은 idp.onjitda.com 호스트에만 있다** — issuer가 메인 호스트를 가리키면 end_session 등이 404.
- OIDC 체인(로그인·로그아웃): admin `/admin/auth/login` →(307)→ `/api/v1/auth/oidc/login` →(302)→ `{issuer}/oidc/auth`
  →(OP 세션 없으면 303)→ `{OIDC_INTERACTION_BASE_URL}/auth/login/:uid`(idp-web 로그인 폼).
  로그아웃은 RP 쿠키 정리 → OP end_session → post_logout_redirect_uri → 같은 체인으로 로그인 폼 복귀.
- 클러스터 직접 확인: `kubectl --context kubernetes-tunnel`(로컬에서 프로드 접근 가능).
  파드/롤아웃: `-n plate-prod`, buildkitd는 `-n devops-tools`.
- 운영 엔드포인트 실측은 curl로 홉 단위 검증(307/302/303 Location 추적)이 가장 빠르다.

## 4. 장애 패턴 체크리스트 (실제 겪은 사례)

| 증상 | 원인 패턴 | 첫 확인 지점 |
|---|---|---|
| 로그아웃/로그인에서 404 | **짝 앱의 라우트 계약 변경이 한쪽에만 배포됨** (사고: idp-api 10-03 배포, idp-web은 9/27 이미지에 머묾) | prj-deploy `prod/*.yaml` 태그 날짜·커밋 대조 → 노드의 실제 이미지 digest 확인 |
| 이미지가 묵어 있음 | Jenkins 웹훅(push-router) 미발동 | Jenkins 빌드 이력 + prj-deploy 태그 갱신 시각 → 수동 레시피로 범프 |
| `helm upgrade jenkins` 직후 첫 gitops 범프 실패(`TRUSTED_DEPLOYMENT != 'true'`) | DSL 재적용이 선언적 파라미터를 한 번 지움 | 파라미터 명시해 재실행 (prj-devops `docs/buzz-ci-integration.md`) |
| buildkit 잡 파드가 라벨 대기 | containerCap=2 — 알림 컨테이너 추가 금지, buildctl 컨테이너 wget 폴백 사용 | Jenkinsfile podTemplate 주석 참고 |
| 로컬 빌드 이미지 풀 실패 | arm64/amd64 불일치 | §2 함정 참고 |

**짝 앱 목록(라우트·계약 변경 시 동시 배포)**: idp-api ↔ idp-web ↔ admin-web (OIDC 체인), core-api ↔ 각 프론트(API 계약).

## 5. 관련 문서

- prj-devops: `docs/buzz-ci-integration.md`(웹훅·잡 파라미터 함정), `docs/jenkins-build-speed-runbook.md`(buildkit 전환 이력·검증), `docs/argocd-prod-only-webhook-manual.md`(ArgoCD 웹훅)
- prj-core: `devops/Jenkinsfile.*.ops.md`(잡별 계약), `docs/ci-webhook-router-note.md`, `docs/env-reference.md`
