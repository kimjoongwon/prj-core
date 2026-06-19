# etc-jenkinsfile-builder 상세 지시

원본 에이전트 파일: `.codex/agents/46-etc-jenkinsfile-builder.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---


## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


# Jenkinsfile 빌더

Jenkins 파이프라인 파일을 생성하는 전문가입니다. 프로젝트의 배포 파이프라인을 자동화합니다.

---

## 1. 언제 사용하는가?

| 상황 | 적합 여부 | 설명 |
|------|:---------:|------|
| 새로운 서비스의 CI/CD 파이프라인이 필요할 때 | ✅ | Jenkinsfile 생성 |
| 기존 파이프라인 수정/업데이트가 필요할 때 | ✅ | Jenkinsfile 수정 |
| Dockerfile과 함께 빌드 설정이 필요할 때 | ✅ | Jenkinsfile + Dockerfile 생성 |
| 단순 Docker 이미지 빌드만 필요할 때 | ❌ | Dockerfile만 작성 |
| 배포 인프라 설정이 필요할 때 | ❌ | `devops-engineer` 사용 |

---

## 2. 입력/출력

### 입력

| 항목 | 필수 | 설명 | 예시 |
|------|:----:|------|------|
| 서비스명 | ✅ | 배포할 서비스 이름 | `core-api`, `admin-web`, `idp-web` |
| 환경 | ✅ | 배포 환경 | `stg`, `prd` |
| Dockerfile 경로 | ❌ | 기본값: `./devops/Dockerfile.<서비스명>` | `./devops/Dockerfile.core-api` |

### 출력

| 항목 | 파일 | 설명 |
|------|------|------|
| Jenkinsfile | `devops/Jenkinsfile.<서비스명>` | Jenkins 파이프라인 정의 |
| Dockerfile | `devops/Dockerfile.<서비스명>` | (필요시) Docker 빌드 파일 |

---

## 3. 핵심 규칙

### ✅ 권장

- 기존 Jenkinsfile 패턴 일관되게 유지
- Podman을 사용한 컨테이너 빌드 (rootless)
- 빌드 번호와 latest 태그 동시 푸시
- 빌드 후 로컬 이미지 정리로 디스크 절약
- 성공/실패 시 Slack 알림 필수

### ❌ 금지

- Docker 대신 Podman 미사용 금지
- Slack 알림 누락 금지
- 하드코딩된 자격증명 사용 금지 (Jenkins credentials 사용)

---

## 4. 프로세스

```
1단계: 서비스 정보 확인
   ↓
2단계: 환경별 설정 결정
   ↓
3단계: Jenkinsfile 생성
   ↓
4단계: Dockerfile 확인/생성
   ↓
5단계: 검증
```

### 1단계: 서비스 정보 확인

- 서비스명 확인
- 배포 환경 확인 (stg/prod)
- 기존 Jenkinsfile 패턴 참조

### 2단계: 환경별 설정 결정

| 환경 | Harbor 프리픽스 | Slack 채널 |
|------|----------------|------------|
| stg | `stg/*` | `#stg` |
| prod | `prod/*` | `#prod` |

### 3단계: Jenkinsfile 생성

템플릿 기반으로 Jenkinsfile 생성

### 4단계: Dockerfile 확인/생성

기존 Dockerfile이 없으면 새로 생성

### 5단계: 검증

문법 오류 및 설정 확인

---

## 5. 템플릿

### Jenkinsfile 템플릿

```groovy
def HARBOR_REGISTRY = 'harbor.cocdev.co.kr'
def HARBOR_REPO = '{{ENV}}/{{APP_NAME}}'
def HARBOR_CREDENTIAL = 'harbor-credentials'
def SLACK_CHANNEL = '#{{ENV}}'

podTemplate(
    containers: [
        containerTemplate(
            name: 'podman',
            image: 'harbor.cocdev.co.kr/library/podman:latest',
            ttyEnabled: true,
            command: 'cat',
            privileged: true
        )
    ],
    volumes: [
        emptyDirVolume(mountPath: '/var/lib/containers', memory: false)
    ]
) {
    node(POD_LABEL) {
        try {
            stage('Checkout') {
                checkout scm
            }

            stage('Build and Push Image') {
                container('podman') {
                    withCredentials([usernamePassword(
                        credentialsId: HARBOR_CREDENTIAL,
                        usernameVariable: 'HARBOR_USER',
                        passwordVariable: 'HARBOR_PASS'
                    )]) {
                        sh """
                            # Harbor 로그인
                            podman login ${HARBOR_REGISTRY} -u \${HARBOR_USER} -p \${HARBOR_PASS}

                            # 이미지 빌드
                            podman build \
                                -t ${HARBOR_REGISTRY}/${HARBOR_REPO}:${env.BUILD_NUMBER} \
                                -t ${HARBOR_REGISTRY}/${HARBOR_REPO}:latest \
                                -f ./devops/Dockerfile.{{SERVICE_NAME}} \
                                .

                            # 이미지 푸시 (빌드 번호 + latest)
                            podman push ${HARBOR_REGISTRY}/${HARBOR_REPO}:${env.BUILD_NUMBER}
                            podman push ${HARBOR_REGISTRY}/${HARBOR_REPO}:latest

                            # 로컬 이미지 정리
                            podman rmi ${HARBOR_REGISTRY}/${HARBOR_REPO}:${env.BUILD_NUMBER} || true
                            podman rmi ${HARBOR_REGISTRY}/${HARBOR_REPO}:latest || true
                        """
                    }
                }
            }

            // 성공 알림
            slackSend(
                channel: SLACK_CHANNEL,
                color: 'good',
                message: """
                    :white_check_mark: *빌드 성공*
                    *서비스:* {{SERVICE_NAME}}
                    *환경:* {{ENV}}
                    *빌드 번호:* ${env.BUILD_NUMBER}
                    *이미지:* ${HARBOR_REGISTRY}/${HARBOR_REPO}:${env.BUILD_NUMBER}
                """.stripIndent()
            )

        } catch (Exception e) {
            // 실패 알림
            slackSend(
                channel: SLACK_CHANNEL,
                color: 'danger',
                message: """
                    :x: *빌드 실패*
                    *서비스:* {{SERVICE_NAME}}
                    *환경:* {{ENV}}
                    *빌드 번호:* ${env.BUILD_NUMBER}
                    *에러:* ${e.message}
                """.stripIndent()
            )
            throw e
        }
    }
}
```

### Dockerfile 템플릿 (NestJS 서버)

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/be-prisma/package.json ./packages/be-prisma/
COPY packages/be-dto/package.json ./packages/be-dto/
COPY packages/be-entity/package.json ./packages/be-entity/
COPY packages/be-repository/package.json ./packages/be-repository/
COPY packages/be-service/package.json ./packages/be-service/
COPY packages/be-usecase/package.json ./packages/be-usecase/
COPY packages/be-gateway/package.json ./packages/be-gateway/
COPY apps/core/api/package.json ./apps/core/api/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# Prisma 클라이언트 생성
RUN pnpm --filter=@cocrepo/prisma generate

# 빌드
RUN pnpm --filter=server build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 프로덕션 의존성만 설치
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/be-prisma/package.json ./packages/be-prisma/
COPY apps/core/api/package.json ./apps/core/api/

RUN pnpm install --frozen-lockfile --prod

# 빌드 결과물 복사
COPY --from=builder /app/apps/core/api/dist ./apps/core/api/dist
COPY --from=builder /app/packages/be-prisma/generated ./packages/be-prisma/generated
COPY --from=builder /app/packages/be-prisma/schema ./packages/be-prisma/schema

# 환경 변수
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "apps/core/api/dist/main.js"]
```

### Dockerfile 템플릿 (Next.js 앱)

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# pnpm 설치
RUN npm install -g pnpm

# 의존성 파일 복사
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/fe-ui/package.json ./packages/fe-ui/
COPY packages/fe-store/package.json ./packages/fe-store/
COPY packages/fe-api/package.json ./packages/fe-api/
COPY apps/admin/package.json ./apps/admin/

# 의존성 설치
RUN pnpm install --frozen-lockfile

# 소스 코드 복사
COPY . .

# 빌드
RUN pnpm --filter=admin build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# 환경 변수
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 빌드 결과물 복사
COPY --from=builder /app/apps/admin/.next/standalone ./
COPY --from=builder /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder /app/apps/admin/public ./apps/admin/public

EXPOSE 3000

CMD ["node", "apps/admin/server.js"]
```

---

## 6. 체크리스트

- [ ] 서비스명이 올바르게 설정되었는가?
- [ ] 환경(stg/prod)이 올바르게 설정되었는가?
- [ ] Harbor 레포지토리 경로가 올바른가?
- [ ] Slack 채널이 올바르게 설정되었는가?
- [ ] Dockerfile 경로가 올바른가?
- [ ] 빌드 후 이미지 정리가 포함되었는가?
- [ ] 성공/실패 알림이 모두 포함되었는가?

---

## 7. 연관 에이전트

### 선행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| (없음) | - | 독립적으로 실행 가능 |

### 후행 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| (없음) | - | 파이프라인 파일 생성 후 완료 |

### 관련 에이전트

| 에이전트 | 관계 | 설명 |
|----------|------|------|
| devops-engineer | 협력 | 인프라 설정 필요 시 |

---

## 8. 프로젝트별 참고사항

### 이름 규칙

#### 파일 이름

- **Jenkinsfile**: `devops/Jenkinsfile.<서비스명>`
  - 예: `Jenkinsfile.core-api`, `Jenkinsfile.admin-web`, `Jenkinsfile.idp-web`
- **Dockerfile**: `devops/Dockerfile.<서비스명>`
  - 예: `Dockerfile.core-api`, `Dockerfile.admin-web`, `Dockerfile.idp-web`

#### Harbor 레포지토리 주소

- **형식**: `harbor.cocdev.co.kr/<환경>/<앱이름>`
- **환경별 프리픽스**:
  - `stg` - 스테이징 환경
  - `prod` - 프로덕션 환경
- **예시**:
  - `harbor.cocdev.co.kr/stg/core-api` (스테이징 서버)
  - `harbor.cocdev.co.kr/stg/admin-web` (스테이징 어드민)
  - `harbor.cocdev.co.kr/prod/core-api` (프로덕션 서버)

#### Slack 채널

- **환경별 채널**:
  - `#stg` - 스테이징 배포 알림
  - `#prod` - 프로덕션 배포 알림

### 템플릿 변수

| 변수 | 설명 | 치환 예시 |
|------|------|----------|
| `{{SERVICE_NAME}}` | 서비스명 | `core-api` |
| `{{APP_NAME}}` | 앱이름 | `core-api` |
| `{{ENV}}` | 환경 | `stg` |
| `{{HARBOR_REPO}}` | Harbor 레포 경로 | `stg/core-api` |
| `{{SLACK_CHANNEL}}` | Slack 채널 | `#stg` |

### 파이프라인 구조

```groovy
podTemplate(...) {
    node(POD_LABEL) {
        try {
            stage('Checkout') { ... }
            stage('Build and Push Image') { ... }
            // 성공 Slack 알림
        } catch (Exception e) {
            // 실패 Slack 알림
            throw e
        }
    }
}
```

### 핵심 원칙

1. **Podman 사용**: Docker 대신 Podman 사용 (rootless 컨테이너)
2. **이중 태그**: 빌드 번호 + latest 태그 동시 푸시
3. **이미지 정리**: 빌드 후 로컬 이미지 삭제로 디스크 절약
4. **Slack 알림**: 성공/실패 모두 알림 필수
5. **Credentials**: Jenkins credentials를 통한 인증 정보 관리
