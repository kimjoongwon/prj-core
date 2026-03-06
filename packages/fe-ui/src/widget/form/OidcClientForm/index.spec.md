# OidcClientForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/widget/form/OidcClientForm/

## 역할

OIDC 클라이언트 등록/수정 폼입니다. 4개 섹션 영역로 구성됩니다: 기본 정보(Client ID, 이름, Secret, Public 여부), 인증 설정(인증 방식, Grant Types, Response Types, 스코프), Redirect URIs, 추가 정보(로고/정책/약관 URI).

## 디자인 목업

> 컴포넌트의 시각적 구조와 변형(variant)별 모습을 ASCII로 표현합니다.

```
  ┌─────────────────────────────────────────────────────┐
  │ [섹션 1] 기본 정보                                   │
  │                                                     │
  │  Client ID                                          │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ my-app-client                  (수정 시 읽기전용) │
  │  └───────────────────────────────────────────────┘  │
  │                                                     │
  │  클라이언트 이름                                     │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ 내 서비스 앱                                   │  │
  │  └───────────────────────────────────────────────┘  │
  │                                                     │
  │  Client Secret               [🔄 자동 생성]         │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ ••••••••••••••••••••••                        │  │
  │  └───────────────────────────────────────────────┘  │
  │                                                     │
  │  ☐ Public 클라이언트 (Secret 없음)                  │
  └─────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────┐
  │ [섹션 2] 인증 설정                                   │
  │                                                     │
  │  Token Endpoint Auth Method                         │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ client_secret_basic                        ▼  │  │
  │  └───────────────────────────────────────────────┘  │
  │                                                     │
  │  Grant Types                                        │
  │  ☑ authorization_code  ☐ refresh_token  ☐ implicit │
  │                                                     │
  │  Response Types                                     │
  │  ☑ code  ☐ token  ☐ id_token                       │
  │                                                     │
  │  스코프                                              │
  │  ┌───────────────────────────────────────────────┐  │
  │  │ openid profile email                          │  │
  │  └───────────────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────┐
  │ [섹션 3] Redirect URIs                               │
  │                                                     │
  │  ┌──────────────────────────────────────────┐ [–]  │
  │  │ https://myapp.com/callback               │      │
  │  └──────────────────────────────────────────┘      │
  │  ┌──────────────────────────────────────────┐ [–]  │
  │  │ http://localhost:3000/callback           │      │
  │  └──────────────────────────────────────────┘      │
  │  [+ URI 추가]                                       │
  └─────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────┐
  │ [섹션 4] 추가 정보 (선택)                             │
  │                                                     │
  │  로고 URI  ┌─────────────────────────────────────┐  │
  │            │                                     │  │
  │            └─────────────────────────────────────┘  │
  │  정책 URI  ┌─────────────────────────────────────┐  │
  │            │                                     │  │
  │            └─────────────────────────────────────┘  │
  │  약관 URI  ┌─────────────────────────────────────┐  │
  │            │                                     │  │
  │            └─────────────────────────────────────┘  │
  └─────────────────────────────────────────────────────┘

  [취소]                                      [💾 저장]
```

### 변형별 외형

| 변형 | 미리보기 |
|------|---------|
| create 모드 | Client ID 편집 가능, 버튼 텍스트 "등록" |
| edit 모드 | Client ID 읽기 전용, 버튼 텍스트 "저장" |
| 제출 중 | 저장 버튼 비활성화 + 로딩 인디케이터 |
| 유효성 에러 | 각 필드 하단에 에러 메시지 표시 |

## Props

```typescript
interface OidcClientFormProps {
  mode: "create" | "edit";
  state: OidcClientFormState;
  onSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;           // 기본값: false
  readonlyClientId?: string;
}

interface OidcClientFormState {
  clientId: string;
  clientName: string;
  clientSecret: string;
  isPublic: boolean;
  tokenEndpointAuthMethod: string;
  grantTypes: string[];
  responseTypes: string[];
  scope: string;
  redirectUris: string[];
  logoUri: string;
  policyUri: string;
  tosUri: string;
  errors: Record<string, string>;
  redirectUriErrors: Record<number, string>;
}
```

## 하위 UI 컴포넌트

| 컴포넌트 | 역할 |
|----------|------|
| 섹션 영역 | 4개 섹션 컨테이너 |
| HeroUI Input | Client ID, 이름, Secret, 스코프, URI 입력 |
| HeroUI Select | 인증 방식 선택 |
| HeroUI Checkbox + CheckboxGroup | Grant Types, Response Types, Public 여부 |
| RedirectUriListInput | Redirect URI 동적 목록 |
| HeroUI Button | 취소, 등록/저장, Secret 자동 생성 |
| lucide-react 아이콘 | RefreshCw(자동생성), Save(저장) |
| VStack | 레이아웃 |

## 상태 관리

**없음** (외부에서 MobX observable state 객체를 관리, 직접 mutation)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | 폴더 네이밍을 단수형(feature/input/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-02-19 | 디자인 목업 추가 | req-reverse-engineer |
| 2026-03-03 | Scaffold 제거 및 페이지 헤더 영역/섹션 영역 용어 정리 | codex |
| 2026-03-06 | widget 디렉토리를 widgets로 통합하며 위치 경로를 정리 | codex |
