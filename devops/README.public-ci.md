# 공개 CI와 내부 배포 경계

외부 fork와 일반 Pull Request는 `Jenkinsfile.public-ci`만 실행합니다. 이 job에는 Jenkins credential, service account token, privileged container, registry push 또는 GitOps 권한을 연결하지 않습니다.

기존 서비스별 Jenkinsfile은 배포 전용입니다. Jenkins 관리자가 보호 브랜치 job에 다음 값을 주입해야 하며 SCM의 Pull Request job에는 설정하지 않습니다.

- `TRUSTED_DEPLOYMENT=true`: 승인된 내부 배포 job임을 나타내는 보호된 환경값
- `HARBOR_REGISTRY`: 내부 registry 주소
- `HARBOR_CREDENTIAL_ID`: Harbor push credential ID
- `GITOPS_UPDATE_JOB`: 승인된 GitOps 갱신 job 이름
- `GITOPS_CREDENTIAL_ID`: GitOps 저장소 쓰기 credential ID
- `BUZZ_NOTIFY_URL` (선택): Buzz #cicd 알림 게이트웨이 URL(예: `http://buzz-gateway.devops-tools.svc.cluster.local`). 주입하지 않으면 빌드/범프 파이프라인의 buzz 알림이 조용히 생략된다. 전송 자격증명은 Secret text credential `buzz-notify-token`(기본값, `BUZZ_NOTIFY_CREDENTIAL_ID` env로 재정의 가능). 전체 구성은 prj-devops `docs/buzz-ci-integration.md`.

서비스 배포는 `main` 또는 `stg` 보호 브랜치만 허용하고, Storybook은 `main`만 허용합니다. GitOps job도 `TRUSTED_DEPLOYMENT=true`가 없거나 PR 문맥이면 실행을 거부합니다. Jenkins 관리자는 배포 job의 Jenkinsfile 경로와 revision을 보호 브랜치로 고정하고 승인된 사용자만 수동 실행 또는 설정 변경이 가능하도록 권한을 제한해야 합니다.

## pnpm store 캐시

`Install and Validate` stage는 공유 PVC `pnpm-store-pvc`를 `/pnpm/store`에 마운트하고 `pnpm install --frozen-lockfile --store-dir /pnpm/store --prefer-offline`로 의존성을 설치해 네트워크 다운로드를 줄입니다. PVC 자체는 prj-devops 저장소에서 별도로 생성·관리하며 이 문서는 이름만 참조합니다. `disableConcurrentBuilds()`로 같은 job의 동시 실행은 막혀 있습니다.

미신뢰 PR도 공유 스토어에 쓰지만 pnpm 스토어는 content-addressed이므로 변조된 콘텐츠가 재사용되면 무결성 검증 실패로 빌드가 실패합니다. 즉 스토어 오염이 아닌 DoS만 가능하며, 비정상 사용으로 스토어가 가득 차면 PVC를 클리어해 복구합니다.

- 2026-10-03: buzz #cicd 알림 메시지에 빌드/범프/동기화 소요시간이 포함된다 (docs: prj-devops buzz-ci-integration.md).
