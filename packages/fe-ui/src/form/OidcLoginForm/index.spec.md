# OidcLoginForm Widget 기획서

> 생성일: 2026-02-18
> 수정일: 2026-03-23
> 타입: widget
> 위치: packages/fe-ui/src/form/OidcLoginForm/

## 역할

OIDC interaction 로그인 폼 위젯입니다.
이메일/비밀번호 입력, 로그인 상태 유지, 비밀번호 찾기, 취소를 제공하며 실패 상태를 즉시 복구 가능한 형태로 안내합니다.
이 위젯은 route shell을 소유하지 않고 primary panel 내부 콘텐츠만 담당합니다.

## 재사용 우선 점검

| 후보 | 판단 | 이유 |
|------|------|------|
| HeroUI `Input`, `Button`, `Checkbox`, `Link` | 재사용 | 기본 접근성과 입력 affordance가 충분하다. |
| `AlertBanner` | 재사용 | 잠금/실패/DEV 안내를 일관된 tone으로 표현할 수 있다. |
| `AuthCardHeader` | 단순화 후 재사용 | client logo와 제목/부제는 재사용 가능하지만, 과한 아이콘 장식은 축소한다. |
| 기존 `AuthCard` full-screen wrapper | 재사용 불가 | route layout이 배경/viewport 배치를 소유해야 하므로 widget 내부 full-screen wrapper는 제거 대상이다. |
| `packages/fe-ui/src/page/LoginPage/LoginPage.tsx` | 재사용 불가 | OIDC client context, 잠금 안내, recovery action, API 에러 구조를 지원하지 않는다. |

## 디자인 방향

- 장식성보다 가독성과 조작 확실성을 우선합니다.
- 첫 화면에서 필요한 정보는 세 가지로 제한합니다.
  - 누구에게 로그인하는가
  - 어떤 입력이 필요한가
  - 실패했을 때 어떻게 복구하는가
- 경고/실패 메시지는 폼 상단의 동일 위치에 고정해 눈의 이동을 줄입니다.
- secondary action은 링크 또는 text button 수준으로 유지하고 primary CTA는 단일 버튼으로 집중시킵니다.

## 디자인 목업

```
[Desktop / Tablet]
┌─────────────────────────────────────────────┐
│ [Client Logo]  Client Name                 │
│ 계정으로 계속 진행합니다                    │
│                                             │
│ [warning / danger / info banner]            │
│                                             │
│ 이메일                                      │
│ [_______________________________]           │
│ 비밀번호                                    │
│ [_______________________________]           │
│                                             │
│ ☐ 로그인 상태 유지   비밀번호 찾기          │
│                                             │
│ [            로그인 계속하기            ]   │
│                                             │
│ 취소하고 이전 서비스로 돌아가기             │
└─────────────────────────────────────────────┘

[Mobile]
┌───────────────────────────────────────┐
│ Client Name                           │
│ 계정으로 계속 진행합니다              │
│ [banner]                              │
│ [email]                               │
│ [password]                            │
│ ☐ 로그인 상태 유지                    │
│ 비밀번호 찾기                         │
│ [로그인 계속하기]                     │
│ 취소하고 돌아가기                     │
└───────────────────────────────────────┘
```

## 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 서비스명 + 입력 폼 + primary CTA |
| 클라이언트 로고 있음 | 로고 + 서비스명 + 짧은 설명 |
| 로그인 실패 | danger/info 배너 + 잔여 시도 안내 |
| 일시 잠금 | warning 배너 + 재설정 CTA |
| 영구 잠금 | danger 배너 + 관리자 문의/재설정 안내 |
| DEV 모드 | 낮은 우선순위 warning 배너 + 자동 입력 고지 |
| 제출 중 | primary button loading + 중복 제출 방지 |

## Props

```typescript
interface OidcLoginFormProps {
  onSubmit: (data: {
    email: string;
    password: string;
    remember: boolean;
  }) => Promise<LoginErrorResponse | null>;
  onAbort: () => void;
  client?: {
    clientId: string;
    clientName: string;
    logoUri?: string;
  } | null;
  isDev?: boolean;
}

interface LoginErrorResponse {
  error: string;
  remainingAttempts?: number;
  lockedUntil?: string;
  temporaryLockThreshold?: number;
  temporaryLockDurationMin?: number;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| `AuthCardHeader` 또는 후속 identity header | client logo, title, subtitle |
| `AlertBanner` | DEV/실패/잠금 안내 |
| HeroUI `Input` | 이메일, 비밀번호 |
| HeroUI `Checkbox` | 로그인 상태 유지 |
| HeroUI `Button` | primary submit CTA |
| HeroUI `Link` | 비밀번호 찾기, 취소 |

## 상태 관리

로컬 상태를 유지합니다.

- `email`, `password`, `remember`
- `error`
- `isSubmitting`
- `isLocked`

## UX 규칙

- 실패 후에도 `email` 값은 유지하고 focus만 적절히 복원합니다.
- 일반 로그인 실패는 잔여 시도 횟수를 함께 보여주되, 공포를 유발하는 문구는 사용하지 않습니다.
- 잠금 상태에서는 비밀번호 재설정 CTA를 banner 안에 직접 노출합니다.
- `clientName`이 없으면 "계정으로 계속 진행합니다" 수준의 중립 카피를 사용합니다.
- `logoUri`가 있으면 아이콘보다 우선합니다.
- 취소 액션은 text link로 두고 버튼 그룹에 넣지 않습니다.

## 슬롯

없음

## 구현 체크리스트

- [ ] widget이 full-screen wrapper, background orb, global footer를 직접 렌더링하지 않음
- [ ] 실패 상태별 안내 문구와 recovery action이 한 위치에서 일관되게 보임
- [ ] 모바일에서 checkbox, link, button의 터치 영역이 충분함
- [ ] DEV 모드 고지는 보조 정보로만 노출됨

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | 비교 대상 `LoginPage` 경로를 page 폴더 규칙에 맞게 갱신 | codex |
| 2026-03-23 | 로그인 UX 재기획에 맞춰 shell 책임 제거, 재사용 판단, 상태별 복구 UX 기준을 문서화 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/control/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
