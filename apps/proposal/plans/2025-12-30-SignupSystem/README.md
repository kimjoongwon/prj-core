# 회원가입 시스템 기획서

**작성일:** 2025-12-30
**플랫폼:** Web + Mobile

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
/orch-stage start stage=1 plan=2025-12-30-SignupSystem
```

---

## 개요

회원가입 플로우에서 약관 동의 이후 단계의 기획서입니다.

**선행 조건:**
- 약관 동의 완료 (`/signup/agreements`)

---

## 회원가입 플로우

```
[약관 동의] → [이메일 입력] → [패스워드 설정] → [이메일 인증] → [Ground 선택] → [완료]
    완료           Step 1          Step 2           Step 3          Step 4
```

---

## 문서 구조

```
2025-12-30-SignupSystem/
├── README.md                 ← 현재 문서 (개요 + 목차)
│
├── 01-screens.md             ← 화면 기획 (Step 1~4)
├── 02-components.md          ← 신규 컴포넌트 명세
├── 03-data-flow.md           ← 데이터 흐름 + 보안 고려사항
└── 04-implementation.md      ← 체크리스트 + 다음 단계 가이드
```

---

## 문서 목차

| 문서 | 설명 | 내용 |
|------|------|------|
| [01-screens.md](./01-screens.md) | 화면 기획 | 이메일/패스워드/인증/Ground 선택 화면 |
| [02-components.md](./02-components.md) | 신규 컴포넌트 | StepIndicator, VerificationCodeInput 등 |
| [03-data-flow.md](./03-data-flow.md) | 데이터 흐름 | 임시 저장, 보안 고려사항 |
| [04-implementation.md](./04-implementation.md) | 구현 가이드 | 체크리스트, 에이전트 실행 가이드 |

---

## 핵심 개념

### 4단계 회원가입 플로우

| Step | 화면 | 목적 | 경로 (Web) |
|------|------|------|-----------|
| 1 | 이메일 입력 | 이메일(ID) 입력 및 중복 확인 | `/signup/email` |
| 2 | 패스워드 설정 | 패스워드 설정 및 강도 검증 | `/signup/password` |
| 3 | 이메일 인증 | 인증 코드 발송 및 확인 | `/signup/verify-email` |
| 4 | Ground 선택 | 이용할 지점 선택 | `/signup/ground` |

### 플랫폼별 차이점

| 항목 | Web | Mobile |
|------|-----|--------|
| 이전 버튼 | 하단 좌측 | 헤더 뒤로가기 |
| 스텝 인디케이터 | 가로 배치 (라벨 포함) | 가로 배치 (라벨 축약) |
| Ground 카드 | 3열 그리드 (대화면) | 1열 리스트 |
| 키보드 | 일반 키보드 | 키보드 회피 레이아웃 적용 |

---

## API 엔드포인트 요약

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/v1/auth/check-email | 이메일 중복 확인 |
| POST | /api/v1/auth/send-verification-code | 인증 코드 발송 |
| POST | /api/v1/auth/verify-email-code | 인증 코드 확인 |
| GET | /api/v1/grounds | Ground 목록 조회 |
| POST | /api/v1/auth/sign-up | 회원가입 완료 |

---

## 관련 문서

- [5단계 분할 개발 플로우 가이드](../../../docs/STAGE-DEVELOPMENT-FLOW.md)
- [기획자 에이전트](../../agents/etc-planner.md)
