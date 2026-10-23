# CI 웹훅 라우팅 노트

> 2026-10-22 소스 대조. 라우터 원본은 `prj-devops/helm/development-tools/jenkins/values.yaml`의 `push-router-job`이다. 이 문서는 실제 웹훅 도착·잡 실행을 확인한 기록이 아니다.

GitHub push → `onjitda.com/api/jenkins-webhook/generic-webhook-trigger/invoke` → ingress의 `argocd-webhook` 프록시 → Jenkins GWT → `push-router` → 앱 빌드 잡 순서로 연결된다. GWT 토큰은 OpenBao에서 동기화한 Jenkins Secret으로 주입하며 문서·저장소에 값이나 토큰이 든 URL을 남기지 않는다.

- 저장소는 `kimjoongwon/prj-core`, ref는 `refs/heads/main`만 처리한다. stg push는 자동 빌드를 시작하지 않으며 지원 앱 잡에서 `BRANCH_NAME=stg`로 수동 실행한다.
- push payload의 각 `commits[].added`, `modified`, `removed`를 합쳐 경로 정규식과 전체 매칭한다. 경로가 없거나 매칭 앱이 없으면 종료한다.
- 자동 대상은 core-api, admin-web, idp-api, idp-web, proposal-web, design-web, live-web, dolmen-api, dolmen-web의 9개 잡이다. tool-storybook은 DSL에 등록된 수동 예비 잡이다.
- 주요 매칭은 앱 디렉터리, frontend의 `packages/(fe-.*|common-.*)`, backend의 `packages/(be-.*|common-.*)`, 앱 Dockerfile, 루트 `pnpm-lock.yaml`·`pnpm-workspace.yaml`·`package.json`·`turbo.json`·`biome.json`이다. Dolmen API는 `apps/dolmen/demo-doc/`도 포함한다. 정확한 식은 DSL을 확인한다.
- **현재 식에는 루트 `docs/`, 루트 `README.md`·`AGENTS.md`, `devops/*.ops.md`, `devops/Jenkinsfile.*` 경로가 없다.** 이 노트만 수정하면 앱 빌드는 매칭되지 않는다. Jenkinsfile 수정도 자동 빌드로 검증되지 않으므로 필요한 잡을 수동 실행한다.
- `app-build-jobs`의 includedRegions와 `push-router-job`의 배열은 별개이므로 경로 정책 변경 시 두 곳을 대조한다. 앱 잡에는 SCM 폴링 트리거가 없으며 실제 자동 호출은 push-router가 수행한다.
- Dolmen은 라우터가 main 빌드도 호출하지만 현재 태그 파일·ArgoCD Application은 stg만 존재한다. main 빌드 성공 뒤 prod 범프가 실패할 수 있다. [런북의 대상 표](build-deploy-runbook.md#2-빌드와-배포-대상)를 따른다.

Jenkins 차트는 ArgoCD 밖이므로 values 커밋만으로 잡 설정 적용을 단정하지 않는다. 차트 적용·Jenkins 재시작 뒤에는 push-router의 GWT 트리거 등록과 최초 실행을 확인한다. 이미지 빌드·범프·ArgoCD 배포는 비동기로 이어지므로 각 단계의 성공을 따로 확인한다.
