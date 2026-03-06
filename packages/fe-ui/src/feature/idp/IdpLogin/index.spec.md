# IdpLogin Feature 기획서

> 생성일: 2026-02-18
> 타입: feature
> 위치: packages/fe-ui/src/feature/idp/IdpLogin/

## 역할

OIDC 로그인 화면 Feature 컴포넌트입니다.
OidcLoginForm Widget에 로그인 API 호출 로직(로그인 제출, 인터랙션 중단)을 연결합니다.
로그인 성공 시 서버에서 반환한 리다이렉트 URL로 이동하고, 실패 시 에러 응답을 Widget에 전달합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
┌──────────────────────────────────────────┐
│                                          │
│         [앱 로고 / 기본 아이콘]           │
│            MyApp 로그인                  │
│                                          │
│  이메일                                  │
│  ┌────────────────────────────────────┐  │
│  │ user@example.com                   │  │
│  └────────────────────────────────────┘  │
│                                          │
│  비밀번호                                │
│  ┌────────────────────────────────────┐  │
│  │ ••••••••••••                    👁 │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ☐ 로그인 상태 유지                      │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │              로그인                 │  │
│  └────────────────────────────────────┘  │
│                                          │
│              [취소]                      │
│                                          │
└──────────────────────────────────────────┘

[에러 상태]
│  ┌────────────────────────────────────┐  │
│  │ ⚠ 이메일 또는 비밀번호가 올바르지 않습니다 │
│  └────────────────────────────────────┘  │

[DEV 모드]
│  ┌────────────────────────────────────┐  │
│  │  DEV 빠른 로그인: [admin] [user]   │  │
│  └────────────────────────────────────┘  │
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 이메일/비밀번호 입력 + 로그인 버튼 + 취소 |
| 클라이언트 로고 있음 | 상단 클라이언트 logoUri 이미지 표시 |
| 제출 중 | 로그인 버튼 로딩 상태 |
| 로그인 실패 | 에러 메시지 배너 표시 |
| DEV 모드 | 하단에 빠른 로그인 버튼 그룹 추가 표시 |

## 의존성

| 타입 | 대상 | 용도 |
|------|------|------|
| API | `@cocrepo/api` > `useSubmitLogin` | 로그인 제출 API (mutation) |
| API | `@cocrepo/api` > `useAbortInteraction` | 인터랙션 중단 API (mutation) |
| API Type | `@cocrepo/api` > `LoginErrorDto` | 로그인 에러 응답 타입 |
| Library | `axios` > `AxiosError` | 에러 응답 타입 캐스팅 |
| Widget | `OidcLoginForm` | 로그인 폼 UI |

## Props

```typescript
interface IdpLoginProps {
  /** OIDC 인터랙션 UID */
  uid: string;
  /** 클라이언트 정보 */
  client?: {
    clientId: string;
    clientName: string;
    logoUri?: string;
  } | null;
  /** DEV 모드 여부 */
  isDev?: boolean;
}
```

## Store 연결

| Store | 속성/메서드 | 사용 방식 |
|-------|------------|----------|
| (없음) | - | API 훅을 직접 사용 (Store 불필요) |

## 이벤트

| 이벤트 | 발생 조건 | 부모 전달 |
|--------|----------|----------|
| (내부) `handleSubmit` | 로그인 폼 제출 시 | useSubmitLogin 호출, 성공 시 리다이렉트, 실패 시 에러 반환 |
| (내부) `handleAbort` | 취소 버튼 클릭 시 | useAbortInteraction 호출 후 리다이렉트 |

## 하위 컴포넌트

| 컴포넌트 | 타입 | 역할 |
|----------|------|------|
| `OidcLoginForm` | Widget | 로그인 폼 UI (이메일, 비밀번호, 기억하기, DEV 모드) |

## 구현 체크리스트

- [x] IdpLogin.tsx
- [x] index.ts (re-export)
- [x] observer 적용
- [x] API 연결 (useSubmitLogin, useAbortInteraction)
- [x] 에러 응답 처리 (AxiosError -> LoginErrorResponse)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 섹션 추가 | req-reverse-engineer |
