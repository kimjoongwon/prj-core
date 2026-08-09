---
name: "dev-service-starter"
description: "이 skill은 `dev-service-starter` 역할로 일할 때 사용합니다. 개발 서버와 로컬 서비스를 시작하는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# dev-service-starter

# 서비스 시작 에이전트 (Service Starter)

개발 환경에서 필요한 서비스를 시작하는 에이전트입니다. 사용자가 어떤 서비스를 실행할지 질문하고 적절한 스크립트를 실행합니다.

---

## 1. 사용 가능한 서비스

| 서비스 | 스크립트 | 설명 | 주의사항 |
|--------|---------|------|---------|
| Admin Full | `pnpm start:admin:full` | 어드민 + 백엔드 서버 함께 실행 | 가장 일반적인 개발 환경. 백엔드 의존성 포함 |
| Admin Only | `pnpm start:admin` | 어드민 프론트엔드만 실행 | 백엔드가 이미 실행 중일 때 사용 |
| Server | `pnpm start:server` | 백엔드 서버만 실행 | DB, Redis 연결 필요 |
| Server Dev | `pnpm start:server:dev` | 서버 + Redis 포트 포워딩 | K8s 환경에서 Redis 접근 시 사용 |
| Storybook | `pnpm start:storybook` | Storybook 실행 | 컴포넌트 독립 개발/테스트 |
| Proposal | `pnpm start:proposal` | Proposal 앱 실행 | 기획서 확인용 |

---

## 2. 프로세스

### 단계 1: 서비스 선택 질문

`request_user_input` 도구를 사용하여 실행할 서비스를 질문합니다:

```
🚀 어떤 서비스를 시작할까요?

1. Admin Full (어드민 + 서버) - 권장
2. Admin Only (어드민만)
3. Server (백엔드 서버)
4. Server Dev (서버 + Redis 포워딩)
5. Storybook (컴포넌트 개발)
6. Proposal (기획서)
```

### 단계 2: 포트 사전 점검 및 정리 (필수)

선택된 서비스의 기본 포트를 먼저 점검하고, 점유 프로세스를 정리한 뒤 실행합니다.

- 포트 매핑: `server(3006)`, `admin(3000)`, `idp-server(3007)`, `idp-client(3008)`, `storybook(6006)`, `proposal(3001)`, `opencode-studio(3010)`
- 포트 점유 PID 확인: `lsof -nP -iTCP:<PORT> -sTCP:LISTEN`
- 점유 PID 종료 순서:
  1. `TERM`으로 정상 종료 시도
  2. 재확인 후 남아 있으면 `KILL`로 강제 종료
- 자동 재점유 방지:
  - 점유 PID의 부모/루트 프로세스가 `pnpm`, `turbo`, `nest ... --watch`, `scripts/start.sh` 계열이면 부모 체인까지 종료
- 최종 검증: 대상 포트가 모두 비어 있는 상태를 3회 연속 확인 후 다음 단계 진행

### 단계 3: 서비스 실행

선택된 서비스에 맞는 스크립트를 실행합니다.

### 단계 4: 실행 확인 안내

```
✅ 서비스 시작됨

📋 실행 정보:
- 서비스: Admin Full
- 명령어: pnpm start:admin:full
- 상태: 백그라운드 실행 중

🔗 접속 URL:
- Admin: http://localhost:3000
- Server: http://localhost:4000
- Swagger: http://localhost:4000/api

💡 팁:
- 로그 확인: 터미널 출력 확인
- 종료: Ctrl+C 또는 터미널 종료
```

---

## 3. 자연어 매핑

사용자가 자연어로 요청할 때의 매핑:

| 사용자 요청 예시 | 실행 서비스 |
|----------------|------------|
| "어드민 실행해줘", "어드민 프로젝트 실행", "admin 시작" | Admin Full |
| "어드민만 실행", "프론트만 실행" | Admin Only |
| "서버 실행", "백엔드 실행", "API 서버 시작" | Server |
| "스토리북 실행", "컴포넌트 확인" | Storybook |
| "기획서 확인", "proposal 실행" | Proposal |

---

## 4. 주의사항

### Admin Full (start:admin:full)
- **가장 일반적인 개발 환경**
- 백엔드 서버 + 어드민 프론트엔드 동시 실행
- PostgreSQL, Redis가 실행 중이어야 함
- 첫 실행 시 DB 마이그레이션 필요할 수 있음

### Admin Only (start:admin)
- 백엔드 서버가 **이미 실행 중**일 때만 사용
- API 호출 실패 시 서버 상태 확인 필요

### Server (start:server)
- PostgreSQL 연결 필수
- Redis 연결 필수 (세션, 캐시)
- `.env` 파일 설정 확인

### Server Dev (start:server:dev)
- Kubernetes 환경에서 Redis 포트 포워딩 자동 설정
- `kubectl` 설치 및 클러스터 연결 필요

### Storybook (start:storybook)
- 컴포넌트 독립 개발/테스트용
- 백엔드 불필요

### Proposal (start:proposal)
- 기획서 문서 확인용
- 백엔드 불필요

---

## 5. 에러 대응

### PostgreSQL 연결 실패
```
❌ 에러: PostgreSQL 연결 실패

해결 방법:
1. PostgreSQL 실행 확인: brew services list
2. 시작: brew services start postgresql
3. .env 파일의 DATABASE_URL 확인
```

### Redis 연결 실패
```
❌ 에러: Redis 연결 실패

해결 방법:
1. Redis 실행 확인: brew services list
2. 시작: brew services start redis
3. 또는 start:server:dev로 포트 포워딩 사용
```

### 포트 충돌 (EADDRINUSE)
```
❌ 에러: listen EADDRINUSE

재시도 프로토콜(필수):
1. 에러 로그에서 충돌 포트 추출 (예: 3006, 3007)
2. 충돌 포트 점유 PID 확인: lsof -nP -iTCP:<PORT> -sTCP:LISTEN
3. PID 종료: TERM -> 재확인 -> 필요 시 KILL
4. 부모/루트 프로세스 확인 후 자동 재시작 주체까지 종료
   - 확인: ps -p <PID> -o pid,ppid,command
5. 포트 free 상태 3회 연속 확인
6. 동일 명령으로 재실행
7. 최대 3회까지 반복하고, 실패 시 점유 프로세스/부모 프로세스 정보를 함께 보고
```

---

## 6. 실행 예시

### 자동 질문 모드

```bash
# 사용자 요청
"서비스 시작해줘"

# 에이전트 응답
🚀 어떤 서비스를 시작할까요?
[request_user_input으로 선택지 제공]

# 선택 후 실행
✅ Admin Full 서비스 시작됨
```

### 직접 지정 모드

```bash
# 사용자 요청
"어드민 프로젝트 실행해줘"

# 에이전트 응답 (질문 없이 바로 실행)
✅ Admin Full 서비스 시작됨
📋 명령어: pnpm start:admin:full
```

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 skill이 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
