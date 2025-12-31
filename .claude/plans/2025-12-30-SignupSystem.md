# 📋 회원가입 시스템 기획서

## 개요

회원가입 플로우에서 약관 동의 이후 단계의 기획서입니다.

**작성일:** 2025-12-30

**플랫폼:**
- **Web**: 웹 브라우저 환경 (React)
- **Mobile**: 모바일 앱 환경 (React Native)

**선행 조건:**
- 약관 동의 완료 (`/signup/agreements`)

---

## 🛣️ 회원가입 플로우

```
[약관 동의] → [이메일 입력] → [패스워드 설정] → [이메일 인증] → [Ground 선택] → [완료]
    완료           Step 1          Step 2           Step 3          Step 4
```

---

## 📱 화면 기획

### Step 1: SignupEmailPage (이메일 입력)

**플랫폼:** Web + Mobile

**경로:**
- Web: `/signup/email`
- Mobile: `SignupEmailScreen`

#### 화면 개요

| 항목 | 내용 |
|------|------|
| 목적 | 사용자 이메일(ID) 입력 및 중복 확인 |
| 진입 조건 | 약관 동의 완료 |
| 이탈 조건 | 이메일 중복 확인 성공 시 다음 단계로 이동 |

#### 화면 구조

**Web:**
```
┌─────────────────────────────────────┐
│         회원가입                     │
├─────────────────────────────────────┤
│                                     │
│     ○ ─ ○ ─ ○ ─ ○                  │
│     1   2   3   4                   │
│    이메일 비밀번호 인증 지점선택      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 이메일 (아이디)              │   │
│  │ ┌─────────────────────────┐ │   │
│  │ │ example@email.com       │ │   │
│  │ └─────────────────────────┘ │   │
│  │ ✓ 사용 가능한 이메일입니다   │   │
│  └─────────────────────────────┘   │
│                                     │
│  ※ 이메일은 로그인 아이디로 사용됩니다 │
│                                     │
├─────────────────────────────────────┤
│  [  이전  ]          [  다음  ]      │
└─────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────┐
│  ← 회원가입          │
├─────────────────────┤
│                     │
│  ○ ─ ○ ─ ○ ─ ○     │
│  1   2   3   4      │
│                     │
│  이메일 (아이디)     │
│  ┌─────────────────┐│
│  │example@email.com││
│  └─────────────────┘│
│  ✓ 사용 가능        │
│                     │
│  이메일은 로그인    │
│  아이디로 사용됩니다 │
│                     │
│                     │
│                     │
├─────────────────────┤
│    [   다음   ]     │
└─────────────────────┘
```

#### API 요구사항

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | /api/v1/auth/check-email | 이메일 중복 확인 | Public |

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "data": {
    "available": true,
    "message": "사용 가능한 이메일입니다"
  }
}
```

#### 상태 관리

```typescript
{
  email: string              // 입력된 이메일
  isValidFormat: boolean     // 이메일 형식 유효성
  isAvailable: boolean | null // 중복 확인 결과 (null: 미확인)
  isChecking: boolean        // 중복 확인 중
  errorMessage: string       // 에러 메시지
}
```

#### 핸들러 정의

| 핸들러 | 파라미터 | 동작 |
|--------|----------|------|
| onChangeEmail | email: string | 이메일 입력, 형식 검증 |
| onBlurEmail | - | 포커스 아웃 시 중복 확인 API 호출 |
| onClickNextButton | - | 다음 단계로 이동 |
| onClickPrevButton | - | 이전 단계로 이동 |

#### 유효성 검증

- 이메일 형식 검증 (RFC 5322)
- 필수 입력 검증
- 중복 확인 필수

---

### Step 2: SignupPasswordPage (패스워드 설정)

**플랫폼:** Web + Mobile

**경로:**
- Web: `/signup/password`
- Mobile: `SignupPasswordScreen`

#### 화면 개요

| 항목 | 내용 |
|------|------|
| 목적 | 사용자 패스워드 설정 및 확인 |
| 진입 조건 | 이메일 입력 및 중복 확인 완료 |
| 이탈 조건 | 패스워드 유효성 검증 및 확인 일치 시 다음 단계로 이동 |

#### 화면 구조

**Web:**
```
┌─────────────────────────────────────┐
│         회원가입                     │
├─────────────────────────────────────┤
│                                     │
│     ● ─ ○ ─ ○ ─ ○                  │
│     1   2   3   4                   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 비밀번호                     │   │
│  │ ┌─────────────────────────┐ │   │
│  │ │ ••••••••••••    [👁]    │ │   │
│  │ └─────────────────────────┘ │   │
│  │ ■■■■□□ 보통                 │   │
│  │ ✓ 8자 이상  ✓ 영문  ✓ 숫자 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 비밀번호 확인                │   │
│  │ ┌─────────────────────────┐ │   │
│  │ │ ••••••••••••    [👁]    │ │   │
│  │ └─────────────────────────┘ │   │
│  │ ✓ 비밀번호가 일치합니다      │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [  이전  ]          [  다음  ]      │
└─────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────┐
│  ← 회원가입          │
├─────────────────────┤
│                     │
│  ● ─ ○ ─ ○ ─ ○     │
│  1   2   3   4      │
│                     │
│  비밀번호           │
│  ┌─────────────────┐│
│  │••••••••••  [👁] ││
│  └─────────────────┘│
│  ■■■■□□ 보통        │
│  ✓8자 ✓영문 ✓숫자  │
│                     │
│  비밀번호 확인      │
│  ┌─────────────────┐│
│  │••••••••••  [👁] ││
│  └─────────────────┘│
│  ✓ 일치합니다       │
│                     │
├─────────────────────┤
│    [   다음   ]     │
└─────────────────────┘
```

#### 상태 관리

```typescript
{
  password: string           // 입력된 패스워드
  passwordConfirm: string    // 패스워드 확인
  showPassword: boolean      // 패스워드 표시 여부
  showPasswordConfirm: boolean // 패스워드 확인 표시 여부
  passwordStrength: 'weak' | 'medium' | 'strong' // 강도
  isPasswordValid: boolean   // 패스워드 유효성
  isPasswordMatch: boolean   // 패스워드 일치 여부
  validationErrors: {
    minLength: boolean       // 8자 이상
    hasLetter: boolean       // 영문 포함
    hasNumber: boolean       // 숫자 포함
    hasSpecial: boolean      // 특수문자 포함 (선택)
  }
}
```

#### 핸들러 정의

| 핸들러 | 파라미터 | 동작 |
|--------|----------|------|
| onChangePassword | password: string | 패스워드 입력, 강도 검증 |
| onChangePasswordConfirm | password: string | 패스워드 확인 입력, 일치 검증 |
| onClickTogglePassword | - | 패스워드 표시/숨김 토글 |
| onClickTogglePasswordConfirm | - | 패스워드 확인 표시/숨김 토글 |
| onClickNextButton | - | 다음 단계로 이동 |
| onClickPrevButton | - | 이전 단계로 이동 |

#### 유효성 검증

- 최소 8자 이상
- 영문 포함 필수
- 숫자 포함 필수
- 특수문자 포함 권장
- 패스워드와 패스워드 확인 일치

---

### Step 3: SignupVerifyEmailPage (이메일 인증)

**플랫폼:** Web + Mobile

**경로:**
- Web: `/signup/verify-email`
- Mobile: `SignupVerifyEmailScreen`

#### 화면 개요

| 항목 | 내용 |
|------|------|
| 목적 | 이메일 인증 코드 발송 및 확인 |
| 진입 조건 | 패스워드 설정 완료 |
| 이탈 조건 | 이메일 인증 성공 시 다음 단계로 이동 |

#### 화면 구조

**Web:**
```
┌─────────────────────────────────────┐
│         회원가입                     │
├─────────────────────────────────────┤
│                                     │
│     ● ─ ● ─ ○ ─ ○                  │
│     1   2   3   4                   │
│                                     │
│          📧                         │
│     이메일 인증                      │
│                                     │
│  user@example.com 으로               │
│  인증 코드를 발송했습니다             │
│                                     │
│  ┌───┬───┬───┬───┬───┬───┐        │
│  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │        │
│  └───┴───┴───┴───┴───┴───┘        │
│                                     │
│  남은 시간: 04:32                    │
│                                     │
│  코드를 받지 못하셨나요?              │
│  [인증 코드 재발송]                  │
│                                     │
├─────────────────────────────────────┤
│  [  이전  ]          [  확인  ]      │
└─────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────┐
│  ← 회원가입          │
├─────────────────────┤
│                     │
│  ● ─ ● ─ ○ ─ ○     │
│  1   2   3   4      │
│                     │
│       📧            │
│   이메일 인증       │
│                     │
│ user@example.com    │
│ 으로 인증 코드를    │
│ 발송했습니다        │
│                     │
│ ┌──┬──┬──┬──┬──┬──┐│
│ │1 │2 │3 │4 │5 │6 ││
│ └──┴──┴──┴──┴──┴──┘│
│                     │
│  남은 시간: 04:32   │
│                     │
│ [인증 코드 재발송]  │
│                     │
├─────────────────────┤
│    [   확인   ]     │
└─────────────────────┘
```

#### API 요구사항

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | /api/v1/auth/send-verification-code | 인증 코드 발송 | Public |
| POST | /api/v1/auth/verify-email-code | 인증 코드 확인 | Public |

**발송 Request:**
```json
{
  "email": "user@example.com"
}
```

**발송 Response:**
```json
{
  "data": {
    "expiresAt": "2025-12-30T12:05:00Z",
    "message": "인증 코드가 발송되었습니다"
  }
}
```

**확인 Request:**
```json
{
  "email": "user@example.com",
  "code": "123456"
}
```

**확인 Response:**
```json
{
  "data": {
    "verified": true,
    "verificationToken": "temp-token-uuid"
  }
}
```

#### 상태 관리

```typescript
{
  email: string              // 인증 대상 이메일
  verificationCode: string   // 입력된 6자리 코드
  isSending: boolean         // 코드 발송 중
  isVerifying: boolean       // 코드 확인 중
  isSent: boolean            // 코드 발송 완료
  isVerified: boolean        // 인증 완료
  remainingTime: number      // 남은 시간 (초)
  canResend: boolean         // 재발송 가능 여부
  errorMessage: string       // 에러 메시지
  verificationToken: string  // 인증 완료 토큰 (다음 단계 전달용)
}
```

#### 핸들러 정의

| 핸들러 | 파라미터 | 동작 |
|--------|----------|------|
| onChangeCode | code: string | 인증 코드 입력 |
| onClickResendButton | - | 인증 코드 재발송 |
| onClickConfirmButton | - | 인증 코드 확인 후 다음 단계 |
| onClickPrevButton | - | 이전 단계로 이동 |

#### 유효성 검증

- 6자리 숫자 입력 필수
- 유효 시간 내 입력 (5분)
- 재발송은 30초 후 가능

---

### Step 4: SignupGroundSelectPage (Ground 선택)

**플랫폼:** Web + Mobile

**경로:**
- Web: `/signup/ground`
- Mobile: `SignupGroundSelectScreen`

#### 화면 개요

| 항목 | 내용 |
|------|------|
| 목적 | 사용자가 이용할 Ground(지점) 선택 |
| 진입 조건 | 이메일 인증 완료 |
| 이탈 조건 | Ground 선택 후 회원가입 완료 |

#### 화면 구조

**Web:**
```
┌─────────────────────────────────────┐
│         회원가입                     │
├─────────────────────────────────────┤
│                                     │
│     ● ─ ● ─ ● ─ ○                  │
│     1   2   3   4                   │
│                                     │
│  이용하실 지점을 선택해주세요         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🔍 지점 검색...              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ○ 강남점                    │   │
│  │   서울특별시 강남구 테헤란로  │   │
│  │   123번길 45                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ● 서초점                    │   │
│  │   서울특별시 서초구 강남대로  │   │
│  │   456번길 78                 │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ ○ 잠실점                    │   │
│  │   서울특별시 송파구 올림픽로  │   │
│  │   789번길 12                 │   │
│  └─────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│  [  이전  ]       [  가입 완료  ]    │
└─────────────────────────────────────┘
```

**Mobile:**
```
┌─────────────────────┐
│  ← 회원가입          │
├─────────────────────┤
│                     │
│  ● ─ ● ─ ● ─ ○     │
│  1   2   3   4      │
│                     │
│  이용하실 지점을    │
│  선택해주세요       │
│                     │
│  ┌─────────────────┐│
│  │🔍 지점 검색...   ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │○ 강남점         ││
│  │  서울특별시 강남구││
│  │  테헤란로 123번길││
│  │  45             ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │● 서초점         ││
│  │  서울특별시 서초구││
│  │  강남대로 456번길││
│  │  78             ││
│  └─────────────────┘│
│                     │
│  ┌─────────────────┐│
│  │○ 잠실점         ││
│  │  서울특별시 송파구││
│  │  올림픽로 789번길││
│  │  12             ││
│  └─────────────────┘│
│                     │
├─────────────────────┤
│   [  가입 완료  ]   │
└─────────────────────┘
```

#### API 요구사항

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| GET | /api/v1/grounds | 전체 Ground 목록 조회 | Public |
| POST | /api/v1/auth/sign-up | 회원가입 완료 | Public |

**Ground 목록 Response:**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "name": "강남점",
      "address": "서울특별시 강남구 테헤란로 123번길 45",
      "logoImageFileId": "file-uuid"
    },
    {
      "id": "uuid-2",
      "name": "서초점",
      "address": "서울특별시 서초구 강남대로 456번길 78",
      "logoImageFileId": "file-uuid"
    }
  ]
}
```

**회원가입 완료 Request:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123!",
  "groundId": "uuid-2",
  "verificationToken": "temp-token-uuid",
  "agreementConsents": [
    { "agreementId": "agreement-1", "agreed": true },
    { "agreementId": "agreement-2", "agreed": true },
    { "agreementId": "agreement-3", "agreed": false }
  ]
}
```

**회원가입 완료 Response:**
```json
{
  "data": {
    "id": "user-uuid",
    "email": "user@example.com",
    "message": "회원가입이 완료되었습니다"
  }
}
```

#### 상태 관리

```typescript
{
  grounds: Ground[]           // Ground 목록
  filteredGrounds: Ground[]   // 검색 필터링된 목록
  selectedGroundId: string | null // 선택된 Ground ID
  searchQuery: string         // 검색어
  isLoading: boolean          // 로딩 상태
  isSubmitting: boolean       // 회원가입 제출 중
  errorMessage: string        // 에러 메시지
}

interface Ground {
  id: string
  name: string                // 지점명 (필수 표시)
  address: string             // 주소 (필수 표시)
  logoImageFileId?: string
}
```

#### 핸들러 정의

| 핸들러 | 파라미터 | 동작 |
|--------|----------|------|
| onChangeSearch | query: string | 검색어 입력, 목록 필터링 |
| onClickGroundCard | groundId: string | Ground 선택 |
| onClickSubmitButton | - | 회원가입 완료 API 호출 |
| onClickPrevButton | - | 이전 단계로 이동 |

#### 유효성 검증

- Ground 선택 필수
- 모든 이전 단계 데이터 유효성 확인

---

## 🧩 신규 컴포넌트

### 1. StepIndicator (진행 단계 표시)

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/StepIndicator/`

**Props:**
```typescript
{
  steps: Array<{ label: string }>  // 단계 라벨 배열
  currentStep: number              // 현재 단계 (0-based)
  variant?: 'horizontal' | 'vertical' // 배치 방향
}
```

**기능:**
- 현재 진행 단계 시각적 표시
- 완료/현재/대기 단계 구분
- 단계 라벨 표시

**Storybook:** 필요

---

### 2. VerificationCodeInput (인증 코드 입력)

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/VerificationCodeInput/`

**Props:**
```typescript
{
  length: number              // 코드 자릿수 (기본: 6)
  value: string               // 입력된 값
  onChange: (code: string) => void
  disabled?: boolean
  error?: boolean
  autoFocus?: boolean
}
```

**기능:**
- 개별 숫자 입력 박스
- 자동 다음 칸 이동
- 붙여넣기 지원
- 백스페이스 이전 칸 이동

**Storybook:** 필요

---

### 3. GroundSelectCard (Ground 선택 카드)

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/GroundSelectCard/`

**Props:**
```typescript
{
  ground: {
    id: string
    name: string           // 지점명 (필수)
    address: string        // 주소 (필수)
    logoImageFileId?: string
  }
  isSelected: boolean
  onPress: () => void
}
```

**기능:**
- Ground 정보 표시 (지점명, 주소 필수)
- 선택/미선택 상태 시각적 표시
- 라디오 버튼 스타일

**Storybook:** 필요

---

### 4. PasswordStrengthIndicator (패스워드 강도 표시)

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/PasswordStrengthIndicator/`

**Props:**
```typescript
{
  password: string
  showRequirements?: boolean  // 요구사항 체크리스트 표시
}
```

**기능:**
- 강도 바 (약함/보통/강함)
- 요구사항 체크리스트
  - ✓/✗ 8자 이상
  - ✓/✗ 영문 포함
  - ✓/✗ 숫자 포함
  - ✓/✗ 특수문자 포함

**Storybook:** 필요

---

## 📊 회원가입 데이터 흐름

### 임시 저장 전략

회원가입 중 이탈 대비 데이터 임시 저장:

```typescript
// sessionStorage (Web) / AsyncStorage (Mobile)
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

## 🔐 보안 고려사항

1. **패스워드 보안**
   - 클라이언트에서 최소 요구사항 검증
   - 서버에서 추가 검증 (강도 체크)
   - bcrypt 해싱 저장

2. **이메일 인증**
   - 인증 코드 5분 유효
   - 동일 이메일 인증 시도 제한 (5회/시간)
   - 인증 코드 6자리 랜덤 숫자

3. **임시 데이터**
   - 24시간 후 자동 삭제
   - 패스워드는 암호화 저장 권장
   - 완료 시 즉시 삭제

4. **Rate Limiting**
   - 이메일 중복 확인: 10회/분
   - 인증 코드 발송: 3회/10분
   - 인증 코드 확인: 5회/5분
   - 회원가입 완료: 3회/시간

---

## ✅ 체크리스트

- [x] Step 1: 이메일 입력 화면 기획 완료
- [x] Step 2: 패스워드 설정 화면 기획 완료
- [x] Step 3: 이메일 인증 화면 기획 완료
- [x] Step 4: Ground 선택 화면 기획 완료
- [x] 신규 컴포넌트 명세 완료
- [x] API 엔드포인트 정의 완료
- [x] 보안 고려사항 정리 완료
- [ ] 백엔드 API 구현 필요
- [ ] 컴포넌트 구현 필요
- [ ] Web 페이지 구현 필요
- [ ] Mobile 화면 구현 필요

---

## 📝 다음 단계

### 1. 백엔드 개발

**API 빌더에게 전달:**
- `POST /api/v1/auth/check-email` - 이메일 중복 확인
- `POST /api/v1/auth/send-verification-code` - 인증 코드 발송
- `POST /api/v1/auth/verify-email-code` - 인증 코드 확인
- `POST /api/v1/auth/sign-up` - 회원가입 완료 (기존 API 확장)

### 2. 컴포넌트 개발

**컴포넌트 빌더에게 전달:**
- StepIndicator 컴포넌트
- VerificationCodeInput 컴포넌트
- GroundSelectCard 컴포넌트
- PasswordStrengthIndicator 컴포넌트

### 3. Web 페이지 개발

**페이지 빌더에게 전달:**
- SignupEmailPage
- SignupPasswordPage
- SignupVerifyEmailPage
- SignupGroundSelectPage

### 4. Mobile 화면 개발

**페이지 빌더에게 전달:**
- SignupEmailScreen
- SignupPasswordScreen
- SignupVerifyEmailScreen
- SignupGroundSelectScreen

---

## 🚨 주의사항

### Ground 표시 규칙
- **지점명(name)**: 필수 표시, 굵은 글씨
- **주소(address)**: 필수 표시, 지점명 아래 회색 글씨
- 모든 Ground 목록을 표시 (필터링/페이지네이션 없음, 단 검색 기능 제공)

### 플랫폼별 차이점

| 항목 | Web | Mobile |
|------|-----|--------|
| 이전 버튼 | 하단 좌측 | 헤더 뒤로가기 |
| 스텝 인디케이터 | 가로 배치 (라벨 포함) | 가로 배치 (라벨 축약) |
| Ground 카드 | 3열 그리드 (대화면) | 1열 리스트 |
| 키보드 | 일반 키보드 | 키보드 회피 레이아웃 적용 |
