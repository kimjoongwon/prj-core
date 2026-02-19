# IdpConsent Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/components/feature/idp/IdpConsent/

## 역할

OIDC 동의(Consent) 화면 Feature 컴포넌트입니다.
OidcConsentPanel Widget에 실제 API 호출 로직(동의 확인, 인터랙션 중단)을 연결합니다.
동의 확인 시 서버로 확인 요청을 보내고 리다이렉트 URL로 이동합니다.

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| API | `@cocrepo/api` > `useConfirmConsent` | 동의 확인 API (mutation) |
| API | `@cocrepo/api` > `useAbortInteraction` | 인터랙션 중단 API (mutation) |
| Widget | `OidcConsentPanel` | 동의 화면 UI |

## Props

```typescript
interface IdpConsentProps {
  /** OIDC 인터랙션 UID */
  uid: string;
  /** 클라이언트 정보 */
  client?: {
    clientId: string;
    clientName: string;
    logoUri?: string;
  } | null;
  /** 요청된 스코프 목록 */
  missingScopes: string[];
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| (없음) | - | API 훅을 직접 사용 (Store 불필요) |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| (내부) `handleConfirm` | 동의 버튼 클릭 시 | useConfirmConsent 호출 후 window.location.href 리다이렉트 |
| (내부) `handleAbort` | 거부 버튼 클릭 시 | useAbortInteraction 호출 후 리다이렉트 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `OidcConsentPanel` | Widget | 동의 화면 UI (클라이언트 정보, 스코프 목록, 동의/거부 버튼) |

## 구현 체크리스트

- [x] IdpConsent.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] API 연결 (useConfirmConsent, useAbortInteraction)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
