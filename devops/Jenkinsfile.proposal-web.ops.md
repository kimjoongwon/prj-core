# Jenkinsfile.proposal-web 기획서

> 생성일: 2026-03-20  
> 타입: jenkins-pipeline  
> 위치: devops/Jenkinsfile.proposal-web

## 역할

`proposal-web` 이미지를 빌드하고 Harbor에 푸시합니다.  
프로덕션 브랜치(`main`)에서는 GitOps 반영 작업을 별도 Job으로 비동기 트리거합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 빌드 대상 | `proposal-web` |
| 이미지 경로 | `HARBOR_REGISTRY/{prod|stg}/proposal-web` |
| Podman 실행 이미지 | `quay.io/podman/stable:v5.8.4` multi-arch manifest를 digest로 고정 |
| pull 정책 | agent 시작 시 `alwaysPullImage: false`, 이미지 빌드 시 `--pull=newer` 사용(로컬 캐시 우선, 원본이 더 최신일 때만 재풀) |
| 격리 경계 | 동적 Jenkins agent Pod 안에서 실행하고 hostPath 대신 builder 전용 PVC만 마운트 |
| 실행 Stage | `Checkout` → `Build and Push Image` → `Trigger GitOps Update Job` |
| GitOps 트리거 | 보호된 내부 job이 주입하는 `GITOPS_UPDATE_JOB` 환경변수 |
| 트리거 파라미터 | `APP_NAME`, `IMAGE_TAG`, `DEPLOY_ENV`, `SOURCE_BUILD_URL`, `SOURCE_COMMIT` |
| 실패 전파 정책 | GitOps 트리거 실패 시 stage만 `UNSTABLE`, 빌드 결과는 `SUCCESS` 유지 |

## 구현 체크리스트

- [x] `podman build/push`를 기존과 동일하게 수행함
- [x] Podman agent를 안전 버전과 검증된 multi-arch digest로 고정함
- [x] `podman build --pull=always`를 제거해 베이스 이미지를 노드 로컬 캐시에서 재사용함
- [x] `main` 브랜치에서만 GitOps Job 트리거함
- [x] GitOps Job은 `wait: false` 비동기로 실행함
- [x] GitOps 트리거 실패가 이미지 빌드 성공을 실패로 바꾸지 않음

## 잔여 위험

`privileged: true`는 현재 Jenkins Podman 스토리지 드라이버와 PVC 운영 계약을 실제 환경에서 검증하기 전까지 배포 전용 job에서만 유지합니다. 외부 PR은 `Jenkinsfile.public-ci`의 비특권 컨테이너만 사용합니다.
digest 고정은 실행 이미지 변조 위험을 낮추지만 privileged 컨테이너의 노드 탈출 영향을 제거하지 않으므로, 전용 namespace와 격리된 builder node pool에서 운용하고 rootless Podman 전환 검증 후 권한을 제거해야 합니다.
`alwaysPullImage: false`와 `podman build --pull=always` 제거로 노드 로컬 캐시 이미지를 재사용하므로 실행 이미지 신선도는 노드 캐시 상태를 따릅니다.
