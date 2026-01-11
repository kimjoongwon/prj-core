# 기술 고려사항

## 1. 템플릿 키 (Key) 규칙

| 키 | 타입 | 설명 |
|----|------|------|
| `email_verification` | EMAIL | 이메일 인증 |
| `password_reset` | EMAIL | 비밀번호 재설정 |
| `user_withdrawal` | EMAIL | 회원 탈퇴 안내 |
| `reservation_confirmed` | EMAIL/SMS/PUSH | 예약 확인 |
| `reservation_cancelled` | EMAIL/SMS/PUSH | 예약 취소 |
| `payment_receipt` | EMAIL | 결제 영수증 |
| `inquiry_answered` | EMAIL/PUSH | 문의 답변 등록 |

---

## 2. 템플릿 렌더링 엔진

### Handlebars 사용

```handlebars
<h1>안녕하세요, {{userName}}님!</h1>
<p>인증 코드는 <strong>{{verificationCode}}</strong>입니다.</p>
<p>만료 시간: {{expiresAt}}</p>
```

### 변수 치환 예시

```typescript
const template = "안녕하세요, {{userName}}님!";
const variables = { userName: "홍길동" };
const result = Handlebars.compile(template)(variables);
// "안녕하세요, 홍길동님!"
```

---

## 3. 템플릿 버전 관리

- 템플릿 수정 시 이전 버전 보관 (TemplateHistory 테이블)
- 롤백 기능 제공 (향후 고려)

---

## 4. 보안 고려사항

| 항목 | 대응 방안 |
|------|----------|
| HTML Injection | HTML 템플릿 저장 시 XSS 방지 sanitize |
| 변수 검증 | 허용된 변수만 사용 가능하도록 검증 |
| 테스트 발송 제한 | 일일 테스트 발송 횟수 제한 (예: 10회) |
| 권한 확인 | `menu:templates:*` Subject 권한 체크 |

---

## 5. 성능 고려사항

| 항목 | 대응 방안 |
|------|----------|
| 템플릿 목록 조회 | 페이지네이션 적용 (기본 20개) |
| 미리보기 렌더링 | 서버 사이드 렌더링, 캐싱 |
| HTML 에디터 | 코드 에디터 lazy loading |
