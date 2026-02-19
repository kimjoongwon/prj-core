# OidcConsentPanel Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/form/OidcConsentPanel/

## 역할

OIDC 동의(Consent) 패널입니다. 클라이언트가 요청하는 권한(스코프) 목록을 표시하고, 허용/거부를 선택할 수 있습니다. SCOPE_LABELS, SCOPE_ICONS 상수로 스코프별 아이콘과 한글 라벨을 표시합니다.

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
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
