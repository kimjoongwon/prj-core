# 빌드·배포 토폴로지 런북

> 소스 대조일: 2026-10-22. `prj-core` Jenkinsfile·Dockerfile, `prj-devops` Job DSL·ArgoCD·Helm, `prj-deploy` 태그 파일 기준이다. 실행 중인 Jenkins·클러스터·OpenBao 값·Buzz 도착 여부는 별도 실측이 필요하다.

## 1. 소유권과 브랜치

| 관심사 | 소유 저장소·경로 | 변경이 반영되는 곳 |
|---|---|---|
| 앱 소스·이미지 빌드 | `prj-core/devops/Dockerfile.*`, `Jenkinsfile.*` | Jenkins 앱 빌드 잡 |
| Jenkins 잡·기본 파라미터·웹훅 경로 필터 | `prj-devops/helm/development-tools/jenkins/values.yaml`의 `app-build-jobs`, `push-router-job` | Jenkins 차트는 ArgoCD 밖이므로 별도 `helm upgrade` 필요 |
| 차트·환경별 values·Application | `prj-devops/helm/`, `environments/argocd/` | ArgoCD가 `main`을 추적 |
| 환경별 배포 이미지 태그 | `prj-deploy/{prod,stg}/<앱>.yaml` | Jenkins 범프 잡이 `main`에 커밋·푸시, ArgoCD가 소비 |
| 시크릿 값·소비처·동기화 관계 | OpenBao `secret/docs/*`, 특히 `credentials-map` | 환경별 ExternalSecret → Kubernetes Secret → 앱 env |

`prj-core`의 `stg`/`main`은 PR을 거친다. feature → stg PR·리뷰·사용자 병합 승인 → stg 검증 → stg→main PR·사용자 병합 승인이 기본 흐름이다. 앱 소스의 `stg` 브랜치와 인프라 저장소의 환경 선택을 혼동하지 않는다. **prod/stg Application 모두 `prj-devops main`과 `prj-deploy main`을 읽고**, `values-prod.yaml`/`values-stg.yaml` 및 `prod/`/`stg/` 디렉터리로 환경을 구분한다. 두 저장소에 `stg` 브랜치가 있어도 현재 ArgoCD의 추적 대상은 바뀌지 않는다.

## 2. 빌드와 배포 대상

| 앱 | Jenkinsfile 허용 소스 브랜치 | 존재하는 태그 파일·ArgoCD 환경 | 자동 트리거 |
|---|---|---|---|
| `core-api`, `admin-web`, `idp-api`, `idp-web` | `main` → prod, `stg` → stg | prod + stg | main push 경로 매칭. stg 빌드는 수동 |
| `proposal-web`, `design-web`, `live-web` | `main` | prod | main push 경로 매칭 |
| `tool-storybook` | `main` | prod | 수동 예비 잡(push-router 대상 제외) |
| `dolmen-api`, `dolmen-web` | `main` → prod, `stg` → stg | **stg만 존재** | 라우터에는 main 대상으로도 등록됨. 아래 구성 차이 주의 |

현재 태그 파일은 prod 8개, stg 6개다. `values-stg.yaml` 또는 `values-prod.yaml`이 차트에 있다는 이유만으로 해당 환경의 배포가 존재하는 것은 아니다. ArgoCD Application과 `prj-deploy` 태그 파일을 함께 확인한다.

**Dolmen 구성 차이:** Jenkinsfile·push-router는 main 빌드를 허용하지만 `prod/dolmen-api.yaml`, `prod/dolmen-web.yaml`과 prod Application은 없다. main 자동 빌드가 성공해도 후속 범프 스크립트는 `Values file not found`로 실패할 수 있다. 현재 연결된 배포 경로는 수동 `BRANCH_NAME=stg` 빌드다. 이 문서 갱신은 해당 소스를 변경하지 않는다.

### 빌드 → 범프 → 배포

1. `push-router`가 `kimjoongwon/prj-core`의 `refs/heads/main` push만 받는다. `commits[].added/modified/removed` 경로를 Job DSL의 정규식과 비교해 앱 빌드 잡을 비동기로 호출한다. 루트 README·AGENTS, `docs/`, `devops/*.ops.md`만 바뀌면 매칭 앱이 없다. 앱 디렉터리의 README나 Dolmen 데모 문서는 해당 경로 식에 매칭될 수 있다. 자세한 경계는 [웹훅 라우팅 노트](ci-webhook-router-note.md)에 둔다.
2. 앱 잡은 PR 실행을 거부하고 `TRUSTED_DEPLOYMENT=true` 및 내부 설정을 검사한다. 6개 main/stg 지원 잡은 `BRANCH_NAME` 브랜치를 직접 체크아웃하고, prod 전용 4개 잡은 잡 SCM의 main을 체크아웃한다. Jenkinsfile 정의를 읽는 SCM 자체는 모든 잡에서 main이다.
3. 체크아웃한 커밋 SHA 앞 12자로 `harbor.onjitda.com/<환경>/<앱>:<SHA-12>`를 빌드·푸시한다. 앱 잡은 `latest`를 푸시하지 않는다.
4. 빌드 성공 알림의 Buzz event ID를 받은 뒤 `/gitops-prod-image-bump`를 `wait: false`로 호출한다. `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV`, `SOURCE_BUILD_URL`, `SOURCE_COMMIT`, `SOURCE_BUZZ_EVENT_ID`를 전달한다.
5. `Jenkinsfile.gitops-update`는 `prj-devops main`에서 범프 스크립트를 읽고 `prj-deploy main`의 기존 `<환경>/<앱>.yaml` 태그만 수정한다. push에는 prj-deploy 전용 deploy key를 사용한다. 같은 태그면 no-op이며, 없는 태그 파일을 생성하지 않는다.
6. ArgoCD가 차트의 환경별 values 뒤에 `$values/<환경>/<앱>.yaml`을 병합하고 자동 동기화한다(`prune`, `selfHeal`). 범프 알림은 빌드 event ID에 reply하고, 배포 알림은 범프 커밋 linkKey로 같은 스레드에 연결하는 구조다. 알림은 best-effort다.

앱 잡의 `SUCCESS`는 이미지 빌드 성공을 뜻한다. 범프 호출 자체가 실패하면 해당 stage가 `UNSTABLE`로 표시되지만 빌드 결과는 `SUCCESS`로 유지된다. 비동기 범프 잡의 이후 실패와 ArgoCD 배포 실패는 앱 빌드로 전파되지 않으므로 각각 확인해야 한다.

### BuildKit과 캐시·인증

전 10개 앱 잡은 `buildctl`로 `tcp://buildkitd.devops-tools.svc.cluster.local:1234`에 접속한다. buildctl 컨테이너는 digest 고정 `moby/buildkit:v0.33.0-rootless`이며 privileged·PVC 마운트가 없다. buildkitd는 `devops-tools`의 단일 데몬으로 50Gi PVC와 4Gi 메모리 limit을 사용한다. 데몬은 UID 1000이지만 차트의 `privileged: true`를 사용하므로 클라이언트와 구분한다.

- **원격 push 인증은 클라이언트가 전달한다.** buildctl의 `/home/user/.docker/config.json`은 `buildkit-client-config`에서 온다. `HARBOR_CREDENTIAL_ID`는 필수 설정 검사의 대상이지만 현재 앱 Jenkinsfile에 registry login 단계는 없다. 데몬의 `buildkit-registry-config`만 갱신해서는 충분하지 않다. 실제 로테이션은 OpenBao `credentials-map`의 소비처·동기화 짝을 따른다.
- Dockerfile의 `/cache/pnpm-store`, `/cache/turbo`는 현재 대부분 일반 이미지 레이어 경로다. Jenkins 에이전트가 여기에 별도 PVC를 마운트하지 않고, `tool-storybook` Dockerfile만 명시적인 `RUN --mount=type=cache`를 쓴다. 데몬의 레이어 캐시와 가변 cache mount를 구분하며 캐시 적중 여부는 실제 빌드 로그로 확인한다.
- 클러스터용 이미지는 amd64다. 로컬 arm64 기본 빌드를 운영 태그로 올리지 않는다. `scripts/rancher-build.sh`는 로컬 확인 도구이며 지원 대상은 해당 스크립트의 `resolve_target`을 확인한다. 운영 배포는 Jenkins 경로를 사용한다.

## 3. 자동 트리거가 없을 때의 수동 절차

웹훅 문제와 이미지 빌드 문제를 분리한다. 이미지가 아직 없으면 Jenkins에서 대상 `<앱>-build` → **Build with Parameters**를 열고 다음을 지정한다.

| 필드 | 값 |
|---|---|
| `BRANCH_NAME` | stg 지원 앱 검증은 `stg`, prod는 `main` |
| `TRUSTED_DEPLOYMENT` | `true` |
| `HARBOR_REGISTRY` | `harbor.onjitda.com` |
| `HARBOR_CREDENTIAL_ID` | `harbor`(내부 잡 기본값) |
| `GITOPS_UPDATE_JOB` | `/gitops-prod-image-bump` |
| `BUZZ_NOTIFY_URL` | 내부 게이트웨이 기본값 유지 |

이미지 push가 끝났는데 범프만 실패했다면 `gitops-prod-image-bump`를 재실행한다. `APP_NAME`, 해당 이미지의 `IMAGE_TAG`, `DEPLOY_ENV`를 지정하고 소스 빌드 URL·커밋을 함께 남긴다. Dolmen prod나 정적 웹 stg처럼 태그 파일이 없는 조합은 실행 대상이 아니다. 태그를 임의로 만들거나 로컬에서 운영 이미지·태그를 덮어쓰는 절차로 우회하지 않는다.

## 4. 라우팅과 환경 변수

| 호스트·경로 | 소스에 정의된 대상 |
|---|---|
| `onjitda.com`, `stg.onjitda.com`의 `/admin`, 기본 `/` | 각 환경 admin-web |
| 같은 호스트의 `/api/v1/auth`, `/api/v1/idp`, `/api/v1/oidc-clients`, `/api/v1/oidc-sessions` | 각 환경 idp-api |
| 같은 호스트의 `/api` 폴백 | 각 환경 core-api |
| `idp.onjitda.com`, `idp-stg.onjitda.com`의 `/oidc`, `/api` | 각 환경 idp-api |
| IDP 호스트의 `/` | 각 환경 idp-web |
| prod 메인 `/proposal`, `/design`, `/live`, `/story`, `/storybook` | 해당 prod 웹. Storybook 정규 prefix는 `/story`, `/storybook`은 legacy |
| prod 메인 `/live-stream` | SRS 미디어 서버(`prj-devops`가 관리하며 prj-deploy 이미지 범프 대상 아님) |
| stg 메인 `/dolmen` | dolmen-web-stg. `/dolmen/api/*`는 Next.js route handler가 런타임 `DOLMEN_API_URL`로 프록시 |

`/oidc`는 IDP 호스트에서 라우팅한다. idp-api의 `OIDC_ISSUER`·`OIDC_INTERACTION_BASE_URL`은 prod에서 `https://idp.onjitda.com`, stg에서 `https://idp-stg.onjitda.com`으로 차트가 지정한다. idp-web의 로그인·동의 SSR은 `IDP_API_INTERNAL_URL=http://idp-api-<환경>`을 사용한다. prod/stg 모두 standalone 이미지에는 개발용 Next rewrite가 없고 ingress가 공개 API 라우팅을 맡는다.

공용 시크릿과 앱별 시크릿, 명시적 `extraEnv`의 경계는 [환경 변수 참조](env-reference.md#kubernetes-배포-환경-변수)에 둔다. 차트 소스에 키가 있다는 사실은 현재 OpenBao 값이나 파드 env를 증명하지 않는다.

## 5. 검증과 장애 확인

배포 완료는 다음 근거를 같은 앱·환경·커밋으로 확인한다.

1. 앱 잡의 빌드·Harbor push 성공과 체크아웃 커밋/SHA-12 태그 일치.
2. 범프 잡 성공 또는 동일 태그 no-op, `prj-deploy main`의 대상 파일 태그 일치.
3. ArgoCD 대상 Application이 `Synced` + `Healthy`, 실제 파드 이미지 일치.
4. 변경에 필요한 env가 파드에서 의도한 출처·값으로 반영됐는지 확인하고 Buzz #cicd 배포 알림 도착 확인. 민감한 값은 기록에 노출하지 않는다.

| 증상 | 먼저 확인할 곳 |
|---|---|
| main push 뒤 빌드 없음 | push-router 빌드 이력·payload ref·변경 경로. Storybook은 수동 잡. Jenkins 재시작 후 GWT 트리거 재등록 여부 |
| stg 이미지가 main 커밋 | 실행한 Jenkinsfile 버전과 `Checkout` 로그의 `BRANCH_NAME`·GIT_COMMIT |
| `TRUSTED_DEPLOYMENT != 'true'` | DSL 적용 후 선언적 파라미터 초기화 여부. 기본값과 파라미터를 명시해 재실행 |
| push `unauthorized` | 클라이언트 `buildkit-client-config`와 데몬 설정, OpenBao의 자격증명 짝 |
| 빌드 성공인데 이전 이미지 | 비동기 범프 잡 결과·태그 파일·ArgoCD를 순서대로 확인 |
| Dolmen prod 범프 `Values file not found` | §2의 main 라우터와 stg 전용 배포 구성 차이 |
| 로그인·로그아웃 404 또는 실패 화면 | idp-api ↔ idp-web ↔ admin-web 이미지 계약, issuer 호스트, ingress, idp-web 내부 API env |
| `ImagePullBackOff` | 실제 태그 존재·pull secret·이미지 아키텍처를 이벤트로 확인 |

라우트·API 계약을 바꿀 때는 idp-api ↔ idp-web ↔ admin-web, core-api ↔ 소비 프론트, dolmen-api ↔ dolmen-web의 배포 호환성을 함께 확인한다. 롤백은 `prj-deploy`의 해당 앱·환경 태그를 검증된 이전 태그로 되돌리는 커밋을 사용하고 동일 완료 기준을 확인한다.

## 6. 관련 문서

- [웹훅 라우팅 노트](ci-webhook-router-note.md), [환경 변수 참조](env-reference.md), 잡별 `../devops/Jenkinsfile.*.ops.md`
- [prj-devops 파이프라인](https://github.com/kimjoongwon/prj-devops/blob/main/docs/ai-autonomous-pipeline.md), [Buzz 연동](https://github.com/kimjoongwon/prj-devops/blob/main/docs/buzz-ci-integration.md), [BuildKit 운영](https://github.com/kimjoongwon/prj-devops/blob/main/docs/jenkins-build-speed-runbook.md)
- [prj-deploy 배포 상태](https://github.com/kimjoongwon/prj-deploy)
