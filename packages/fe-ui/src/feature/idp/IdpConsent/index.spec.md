# IdpConsent Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/idp/IdpConsent/

## 역할

OIDC 동의(Consent) 화면 Feature 컴포넌트입니다.
OidcConsentPanel Widget에 실제 API 호출 로직(동의 확인, 인터랙션 중단)을 연결합니다.
동의 확인 시 서버로 확인 요청을 보내고 리다이렉트 URL로 이동합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
┌──────────────────────────────────────────┐
│                                          │
│         [앱 로고 / 기본 아이콘]           │
│                                          │
│      MyApp 이(가) 다음 권한을            │
│      요청하고 있습니다                   │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  요청된 권한                       │  │
│  │  ✔ openid   - 기본 사용자 정보    │  │
│  │  ✔ email    - 이메일 주소         │  │
│  │  ✔ profile  - 프로필 정보         │  │
│  └────────────────────────────────────┘  │
│                                          │
│    [거부]              [동의하기]         │
│                                          │
└──────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 클라이언트 정보 + 스코프 목록 + 동의/거부 버튼 |
| 로고 있음 | 클라이언트 logoUri 이미지 표시 |
| 로고 없음 | 기본 앱 아이콘 표시 |
| 처리 중 | 동의/거부 버튼 로딩 상태 |

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
    name: string;
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
| 2026-03-28 | OIDC 클라이언트 표시 필드명을 name으로 정리하고 관련 계약을 동기화 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
