# OidcConsentPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/form/OidcConsentPanel/

## 역할

OIDC 동의(Consent) 패널입니다. 클라이언트가 요청하는 권한(스코프) 목록을 표시하고, 허용/거부를 선택할 수 있습니다. SCOPE_LABELS, SCOPE_ICONS 상수로 스코프별 아이콘과 한글 라벨을 표시합니다.

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
  ┌─────────────────────────────────────────────┐
  │                                             │
  │          [클라이언트 로고]                   │
  │         My Service App                      │
  │     다음 권한에 대한 접근을 요청합니다       │
  │                                             │
  │  ┌───────────────────────────────────────┐  │
  │  │  👤 기본 프로필 (profile)              │  │
  │  │  ✉  이메일 주소 (email)               │  │
  │  │  🔓 OpenID Connect 인증 (openid)      │  │
  │  └───────────────────────────────────────┘  │
  │                                             │
  │  [에러 배너 - 허용 실패 시 표시]             │
  │                                             │
  │  ┌────────────────────┐ ┌────────────────┐  │
  │  │     거부           │ │   허용          │  │
  │  └────────────────────┘ └────────────────┘  │
  │         (flat)                (success)     │
  └─────────────────────────────────────────────┘

  --- 로딩 중 (허용 버튼 클릭 후) ---

  ┌─────────────────────────────────────────────┐
  │             ...동일 레이아웃...              │
  │  ┌─────────────────┐  ┌──────────────────┐  │
  │  │      거부        │  │  [스피너] 처리중  │  │
  │  └─────────────────┘  └──────────────────┘  │
  └─────────────────────────────────────────────┘
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| 기본 | 스코프 목록 + 허용/거부 버튼 |
| 클라이언트 로고 있음 | AuthCardHeader에 로고 이미지 표시 |
| 로딩 중 (isSubmitting=true) | 허용 버튼 비활성화 + 스피너 |
| 에러 발생 | AuthCard 상단에 에러 AlertBanner 표시 |

## Props

```typescript
interface OidcConsentPanelProps {
  onConfirm: () => Promise<string | null>;
  onAbort: () => void;
  client?: {
    clientId: string;
    clientName: string;
    logoUri?: string;
  } | null;
  missingScopes: string[];
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| AuthCard | 인증 카드 컨테이너 |
| AuthCardHeader | 클라이언트 정보, 로고, 아이콘 헤더 |
| AlertBanner | 에러 메시지 표시 |
| HeroUI Button | 허용(success), 거부(flat) 버튼 |

## 상태 관리

로컬: error (useState), isSubmitting (useState)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
