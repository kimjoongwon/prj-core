# 데이터 흐름 및 보안 고려사항

회원가입 플로우의 데이터 관리 및 보안 요구사항입니다.

---

## 회원가입 데이터 흐름

### 단계별 데이터 전달

```
Step 1 (이메일)
    ↓ email
Step 2 (패스워드)
    ↓ email, password
Step 3 (이메일 인증)
    ↓ email, password, verificationToken
Step 4 (Ground 선택)
    ↓ email, password, verificationToken, groundId, agreementConsents
    ↓
[회원가입 API 호출]
```

---

## 임시 저장 전략

회원가입 중 이탈 대비 데이터 임시 저장:

### 저장소

- **Web**: sessionStorage
- **Mobile**: AsyncStorage

### 저장 데이터 구조

```typescript
interface SignupTempData {
  step: number
  email: string
  password: string  // 암호화 저장 권장
  verificationToken: string
  selectedGroundId: string | null
  agreementConsents: Array<{
    agreementId: string
    agreed: boolean
  }>
  expiresAt: string  // 24시간 후 만료
}
```

### 저장/복원 타이밍

| 시점 | 동작 |
|------|------|
| 단계 이동 시 | 현재까지 데이터 저장 |
| 페이지 진입 시 | 저장된 데이터 복원, 해당 단계로 이동 |
| 회원가입 완료 시 | 저장 데이터 삭제 |
| 24시간 경과 시 | 저장 데이터 자동 만료 |

### 구현 예시

```typescript
// 저장
function saveSignupProgress(data: SignupTempData) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  sessionStorage.setItem('signup_progress', JSON.stringify({
    ...data,
    expiresAt,
  }));
}

// 복원
function loadSignupProgress(): SignupTempData | null {
  const saved = sessionStorage.getItem('signup_progress');
  if (!saved) return null;

  const data = JSON.parse(saved) as SignupTempData;
  if (new Date(data.expiresAt) < new Date()) {
    sessionStorage.removeItem('signup_progress');
    return null;
  }

  return data;
}

// 삭제
function clearSignupProgress() {
  sessionStorage.removeItem('signup_progress');
}
```

---

## 보안 고려사항

### 1. 패스워드 보안

| 계층 | 요구사항 |
|------|----------|
| 클라이언트 | 최소 요구사항 검증 (8자, 영문, 숫자) |
| 서버 | 추가 강도 체크, 취약 패스워드 목록 확인 |
| 저장 | bcrypt 해싱 (cost factor 12 이상) |

### 2. 이메일 인증

| 항목 | 값 |
|------|-----|
| 인증 코드 형식 | 6자리 랜덤 숫자 |
| 코드 유효 시간 | 5분 |
| 시도 제한 | 동일 이메일 5회/시간 |
| 재발송 대기 | 30초 |

### 3. 임시 데이터 보안

| 항목 | 요구사항 |
|------|----------|
| 만료 시간 | 24시간 후 자동 삭제 |
| 패스워드 저장 | 클라이언트 측 암호화 권장 |
| 완료 시 처리 | 즉시 삭제 |
| 민감 정보 | 디버그 로그에 출력 금지 |

### 4. Rate Limiting

| 엔드포인트 | 제한 |
|-----------|------|
| 이메일 중복 확인 | 10회/분 |
| 인증 코드 발송 | 3회/10분 |
| 인증 코드 확인 | 5회/5분 |
| 회원가입 완료 | 3회/시간 |

### 5. 추가 보안 권장사항

- **HTTPS 필수**: 모든 API 통신은 HTTPS로 암호화
- **CORS 설정**: 허용된 도메인만 API 접근 가능
- **CAPTCHA**: 봇 방지를 위해 회원가입 완료 시 CAPTCHA 적용 권장
- **IP 기반 차단**: 의심스러운 활동 감지 시 IP 차단

---

## 에러 처리

### 공통 에러 코드

| 코드 | 메시지 | 원인 |
|------|--------|------|
| EMAIL_ALREADY_EXISTS | 이미 사용 중인 이메일입니다 | 이메일 중복 |
| INVALID_EMAIL_FORMAT | 올바른 이메일 형식이 아닙니다 | 이메일 형식 오류 |
| WEAK_PASSWORD | 비밀번호가 너무 약합니다 | 패스워드 강도 부족 |
| INVALID_VERIFICATION_CODE | 인증 코드가 올바르지 않습니다 | 인증 코드 불일치 |
| VERIFICATION_CODE_EXPIRED | 인증 코드가 만료되었습니다 | 5분 초과 |
| TOO_MANY_ATTEMPTS | 너무 많은 시도입니다. 잠시 후 다시 시도해주세요 | Rate limit 초과 |
| GROUND_NOT_FOUND | 선택한 지점을 찾을 수 없습니다 | Ground ID 오류 |
| INVALID_VERIFICATION_TOKEN | 인증 토큰이 유효하지 않습니다 | 토큰 만료/변조 |

### 에러 응답 형식

```json
{
  "statusCode": 400,
  "message": "이미 사용 중인 이메일입니다",
  "error": "EMAIL_ALREADY_EXISTS"
}
```
