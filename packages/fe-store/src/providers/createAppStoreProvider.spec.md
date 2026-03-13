# createAppStoreProvider ui 기획서

> 생성일: 2026-03-03
> 타입: ui
> 위치: packages/fe-store/src/providers/createAppStoreProvider.tsx

## 역할

이 파일은 ui 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| AppStoreConfig | 공개 계약 요소 |
| AppStoreProviderResult | 공개 계약 요소 |
| createAppStoreProvider | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-13 | `setApiPersistStore` 의존을 root barrel에서 `@cocrepo/api/core/client` subpath로 전환 | codex |
| 2026-03-06 | 규칙 위반 정리: useMemo/useCallback/useIsMounted 제거 및 observer/이벤트 네이밍 규칙 반영 | codex |
| 2026-03-06 | AppStoreConfig/AppStoreProviderResult 로컬 선언을 제거하고 @cocrepo/type 공용 계약 import + type re-export로 전환 | codex |
| 2026-03-06 | @cocrepo/hook 의존 제거, RootStore에 AbilityStore 주입, 내부 useAbility(@cocrepo/store) 기반 권한 체커 연결로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
