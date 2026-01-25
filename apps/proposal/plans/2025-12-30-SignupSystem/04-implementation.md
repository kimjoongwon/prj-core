# 구현 가이드

회원가입 시스템 구현을 위한 체크리스트와 에이전트 실행 가이드입니다.

---

## 체크리스트

### 기획 단계

- [x] Step 1: 이메일 입력 화면 기획 완료
- [x] Step 2: 패스워드 설정 화면 기획 완료
- [x] Step 3: 이메일 인증 화면 기획 완료
- [x] Step 4: Ground 선택 화면 기획 완료
- [x] 신규 컴포넌트 명세 완료
- [x] API 엔드포인트 정의 완료
- [x] 보안 고려사항 정리 완료

### 구현 단계

- [ ] 백엔드 API 구현
- [ ] 컴포넌트 구현
- [ ] Web 페이지 구현
- [ ] Mobile 화면 구현

---

## 다음 단계

### 1. 백엔드 개발

**API 빌더에게 전달:**

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /api/v1/auth/check-email | 이메일 중복 확인 |
| POST | /api/v1/auth/send-verification-code | 인증 코드 발송 |
| POST | /api/v1/auth/verify-email-code | 인증 코드 확인 |
| POST | /api/v1/auth/sign-up | 회원가입 완료 (기존 API 확장) |

### 2. 컴포넌트 개발

**컴포넌트 빌더에게 전달:**

| 컴포넌트 | 우선순위 |
|----------|----------|
| StepIndicator | 1 (모든 화면에서 사용) |
| PasswordStrengthIndicator | 2 |
| VerificationCodeInput | 3 |
| GroundSelectCard | 4 |

### 3. Web 페이지 개발

**페이지 빌더에게 전달:**

| 페이지 | 경로 |
|--------|------|
| SignupEmailPage | `/signup/email` |
| SignupPasswordPage | `/signup/password` |
| SignupVerifyEmailPage | `/signup/verify-email` |
| SignupGroundSelectPage | `/signup/ground` |

### 4. Mobile 화면 개발

**페이지 빌더에게 전달:**

| 화면 | 파일명 |
|------|--------|
| SignupEmailScreen | `SignupEmailScreen.tsx` |
| SignupPasswordScreen | `SignupPasswordScreen.tsx` |
| SignupVerifyEmailScreen | `SignupVerifyEmailScreen.tsx` |
| SignupGroundSelectScreen | `SignupGroundSelectScreen.tsx` |

---

## 에이전트 실행 가이드

### 5단계 분할 개발 플로우

```bash
# Stage 1: 데이터 설계 (기획서 → 기술 설계서)
/stage-orchestrator run stage=1 plan=2025-12-30-SignupSystem

# Stage 2: 스키마 구현 (Prisma 스키마, Entity, DTO)
/stage-orchestrator run stage=2 plan=2025-12-30-SignupSystem

# Stage 3: 백엔드 로직 (Repository, Service, Controller)
/stage-orchestrator run stage=3 plan=2025-12-30-SignupSystem

# Stage 4: 컴포넌트 구현 (UI, Widget, Feature)
/stage-orchestrator run stage=4 plan=2025-12-30-SignupSystem

# Stage 5: 페이지 통합 (Page 빌더, 리뷰어)
/stage-orchestrator run stage=5 plan=2025-12-30-SignupSystem
```

### 전체 실행

```bash
# Stage 1부터 순차 실행 (각 단계별 리뷰)
/stage-orchestrator full plan=2025-12-30-SignupSystem
```

---

## 개별 에이전트 실행

필요시 개별 에이전트를 직접 실행할 수 있습니다.

### 기획/설계

```bash
# 기술 설계서 생성
/technical-designer plan=2025-12-30-SignupSystem
```

### 백엔드

```bash
# Repository 생성
/repository-builder domain=auth feature=signup

# Service 생성
/service-builder domain=auth feature=signup

# Controller 생성
/controller-builder domain=auth feature=signup
```

### 프론트엔드

```bash
# UI 컴포넌트 생성
/ui-component-builder component=StepIndicator

# 페이지 생성
/page-builder page=SignupEmailPage path=/signup/email
```

---

## 테스트 계획

### 단위 테스트

| 대상 | 테스트 항목 |
|------|-------------|
| 이메일 중복 확인 | 존재하는 이메일, 새 이메일, 형식 오류 |
| 패스워드 강도 검증 | weak/medium/strong 각 케이스 |
| 인증 코드 생성 | 6자리 숫자, 유효 시간 |
| 인증 코드 확인 | 일치/불일치, 만료 |

### 통합 테스트

| 시나리오 | 검증 항목 |
|----------|-----------|
| 정상 회원가입 | 전체 플로우 성공 |
| 이메일 중복 | Step 1에서 오류 메시지 |
| 인증 코드 만료 | Step 3에서 재발송 유도 |
| Rate Limit 초과 | 적절한 에러 메시지 |

### E2E 테스트

| 플랫폼 | 테스트 도구 |
|--------|------------|
| Web | Playwright |
| Mobile | Detox |

---

## 릴리즈 전 확인사항

- [ ] 모든 API Rate Limit 설정 완료
- [ ] 이메일 발송 서비스 연동 완료
- [ ] 에러 메시지 한글화 완료
- [ ] 접근성(a11y) 검증 완료
- [ ] 반응형 레이아웃 테스트 완료
- [ ] 보안 감사 완료
