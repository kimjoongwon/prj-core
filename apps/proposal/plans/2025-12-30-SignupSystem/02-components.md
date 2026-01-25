# 신규 컴포넌트

회원가입 플로우에서 필요한 신규 컴포넌트 명세입니다.

---

## 1. StepIndicator (진행 단계 표시)

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/StepIndicator/`

### Props

```typescript
{
  steps: Array<{ label: string }>  // 단계 라벨 배열
  currentStep: number              // 현재 단계 (0-based)
  variant?: 'horizontal' | 'vertical' // 배치 방향
}
```

### 기능

- 현재 진행 단계 시각적 표시
- 완료/현재/대기 단계 구분
- 단계 라벨 표시

### 상태별 스타일

| 상태 | 원형 | 라벨 | 연결선 |
|------|------|------|--------|
| 완료 (●) | primary 색상, 채움 | primary 색상 | primary 색상 |
| 현재 (○) | primary 색상, 테두리 | 기본 색상, 굵게 | default 색상 |
| 대기 (○) | default 색상, 테두리 | default-400 색상 | default 색상 |

### Storybook

- 필요

---

## 2. VerificationCodeInput (인증 코드 입력)

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/VerificationCodeInput/`

### Props

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

### 기능

- 개별 숫자 입력 박스
- 자동 다음 칸 이동
- 붙여넣기 지원
- 백스페이스 이전 칸 이동

### 동작 상세

| 동작 | 설명 |
|------|------|
| 숫자 입력 | 현재 칸에 입력 후 다음 칸으로 포커스 이동 |
| 붙여넣기 | 클립보드에서 숫자만 추출하여 각 칸에 분배 |
| 백스페이스 | 현재 칸 비움 후 이전 칸으로 포커스 이동 |
| 전체 삭제 | Ctrl/Cmd + A → Delete 로 전체 초기화 |

### 에러 상태

- `error` prop이 true일 때 모든 박스에 danger 테두리 적용
- 흔들림 애니메이션 (shake animation) 적용

### Storybook

- 필요

---

## 3. GroundSelectCard (Ground 선택 카드)

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/GroundSelectCard/`

### Props

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

### 기능

- Ground 정보 표시 (지점명, 주소 필수)
- 선택/미선택 상태 시각적 표시
- 라디오 버튼 스타일

### 레이아웃

```
┌─────────────────────────────────────┐
│ ○ 강남점                            │
│   서울특별시 강남구 테헤란로 123번길 45 │
└─────────────────────────────────────┘
```

### 스타일

| 상태 | 테두리 | 배경 | 라디오 버튼 |
|------|--------|------|-------------|
| 미선택 | divider | content1 | 빈 원 |
| 선택 | primary | primary/10 | 채운 원 (primary) |

### Storybook

- 필요

---

## 4. PasswordStrengthIndicator (패스워드 강도 표시)

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/PasswordStrengthIndicator/`

### Props

```typescript
{
  password: string
  showRequirements?: boolean  // 요구사항 체크리스트 표시
}
```

### 기능

- 강도 바 (약함/보통/강함)
- 요구사항 체크리스트
  - ✓/✗ 8자 이상
  - ✓/✗ 영문 포함
  - ✓/✗ 숫자 포함
  - ✓/✗ 특수문자 포함

### 강도 계산 로직

```typescript
function calculateStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[a-zA-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score <= 2) return 'weak';
  if (score <= 4) return 'strong';
  return 'medium';
}
```

### 강도별 스타일

| 강도 | 바 채움 | 색상 | 라벨 |
|------|---------|------|------|
| weak | 1/3 | danger | 약함 |
| medium | 2/3 | warning | 보통 |
| strong | 3/3 | success | 강함 |

### 요구사항 체크리스트

```
✓ 8자 이상  (충족 시 success 색상)
✗ 영문 포함 (미충족 시 default-400 색상)
✓ 숫자 포함
✗ 특수문자 포함 (선택 사항)
```

### Storybook

- 필요

---

## 컴포넌트 개발 우선순위

| 순위 | 컴포넌트 | 사용 화면 |
|------|----------|----------|
| 1 | StepIndicator | 모든 화면 |
| 2 | PasswordStrengthIndicator | Step 2 |
| 3 | VerificationCodeInput | Step 3 |
| 4 | GroundSelectCard | Step 4 |
