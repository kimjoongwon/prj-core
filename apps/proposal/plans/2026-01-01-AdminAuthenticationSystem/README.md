# 관리자 인증 시스템

**작성일:** 2026-01-01
**수정일:** 2026-01-11
**플랫폼:** Admin Web
**버전:** 1.0

---

## 5단계 개발 플로우 현황

```
Stage 1: 데이터 설계     ⏳ 대기
Stage 2: 스키마 구현     ⏳ 대기
Stage 3: 백엔드 로직     ⏳ 대기
Stage 4: 컴포넌트 구현   ⏳ 대기
Stage 5: 페이지 통합     ⏳ 대기
```

**다음 단계:**
```bash
/orch-stage start stage=1 plan=2026-01-01-AdminAuthenticationSystem
```

---

## 문서 구조

```
2026-01-01-AdminAuthenticationSystem/
├── README.md                 <- 현재 문서 (개요 + 목차)
│
├── 01-overview.md            <- 화면 개요 및 인증 흐름
├── 02-screens.md             <- 화면 구조 (LoginPage, Space Alert)
├── 03-data-requirements.md   <- 데이터 요구사항 (API, Store)
├── 04-interactions.md        <- 인터랙션 정의 (슈퍼매니저, 로그인 흐름)
├── 05-implementation.md      <- 구현 명세 (상세 코드)
├── 06-testing.md             <- 테스트 시나리오
│
└── design/                   <- 기술 설계서 (추후 생성)
```

---

## 문서 목차

### 기획 문서 (이 폴더)

| 문서 | 설명 |
|------|------|
| [01-overview.md](./01-overview.md) | 화면 목적, 인증 흐름 다이어그램 |
| [02-screens.md](./02-screens.md) | LoginPage, Space 선택 Alert UI |
| [03-data-requirements.md](./03-data-requirements.md) | API 엔드포인트, 토큰 관리, Store 구조 |
| [04-interactions.md](./04-interactions.md) | 슈퍼매니저 권한, 로그인 흐름, Space 선택 |
| [05-implementation.md](./05-implementation.md) | 훅, 컴포넌트 상세 구현 명세 |
| [06-testing.md](./06-testing.md) | 단위/통합/E2E 테스트 시나리오 |

---

## 핵심 개념

### 인증 흐름

```
[앱 진입] → [인증 상태 확인] → [토큰 유효?]
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
              [토큰 없음/만료]                 [토큰 유효]
                    │                               │
                    ▼                               ▼
              [LoginPage]                    [Space 확인]
                    │                               │
                    ▼                    ┌──────────┴──────────┐
              [로그인 성공]               ▼                    ▼
                    │             [spaceId 있음]        [spaceId 없음]
                    │                    │                    │
                    ▼                    ▼                    ▼
              [토큰 저장]            [대시보드]         [Space 선택]
                    │                                        │
                    └────────────────────────────────────────┘
```

### httpOnly 쿠키 환경

| 저장 위치 | 항목 | 비고 |
|----------|------|------|
| Cookie (httpOnly) | accessToken, refreshToken | JS 접근 불가 |
| localStorage | 만료 시간, spaceId | PersistStore 관리 |

### 슈퍼매니저 권한

| 권한 레벨 | "전체" 선택 | X-Space-ID 헤더 |
|----------|------------|----------------|
| 슈퍼매니저 | 가능 | undefined (미포함) |
| 일반 매니저 | 불가 | 필수 |

---

## 구현 우선순위

### 백엔드 (선행 조건)

| 순서 | 작업 |
|:----:|------|
| 0-1 | Prisma 스키마 수정: `User.selectedSpaceId` 필드 추가 |
| 0-2 | Login API 응답 수정: 토큰 만료 시간, selectedSpaceId 추가 |
| 0-3 | Space 변경 API 추가: `PATCH /api/v1/users/me/selected-space` |

### 프론트엔드

| 순서 | 작업 |
|:----:|------|
| 1 | PersistStore 수정 (토큰 만료 시간 + spaceId null 지원) |
| 2 | useAuthLoginPage 수정 (selectedSpaceId 우선 선택) |
| 3 | x-space-id 인터셉터 추가 |
| 4-8 | SpaceSelector, useChangeSpace, useSpaceGuard 등 |
| 9 | Admin Layout에 Space Guard 적용 |
| 10 | 테스트 코드 작성 |

---

## 관련 문서

- [5단계 분할 개발 플로우 가이드](../../../docs/STAGE-DEVELOPMENT-FLOW.md)
- [CASL 권한 시스템](../2025-12-30-CASL-Permission-System/)
