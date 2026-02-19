# OidcClientForm Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/form/OidcClientForm/

## 역할

OIDC 클라이언트 등록/수정 폼입니다. 4개 SectionSurface로 구성됩니다: 기본 정보(Client ID, 이름, Secret, Public 여부), 인증 설정(인증 방식, Grant Types, Response Types, 스코프), Redirect URIs, 추가 정보(로고/정책/약관 URI).

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
| SectionSurface | 4개 섹션 컨테이너 |
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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
