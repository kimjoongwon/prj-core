# SpaceSelector feature 기획서

> 생성일: 2026-03-03
> 타입: feature
> 위치: packages/fe-ui/src/feature/SpaceSelector/SpaceSelector.tsx

## 역할

이 파일은 feature 계층의 핵심 동작을 담당합니다.
상위 레이어와 하위 레이어를 연결하며, 런타임에서 실제 사용자 흐름/비즈니스 흐름에 직접 관여합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| SpaceSelectorProps | 공개 계약 요소 |
| SpaceSelector | 공개 계약 요소 |
| SpaceSelectorSpace | 공개 계약 요소 |
| ContextSelectorContext | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/store | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 동작 흐름

1. 입력(라우트/props/호출)을 수신합니다.
2. PersistStore의 `isHydrated`, `spaceId`, `groundName`, `spaces`를 읽어 현재 Space 상태를 계산합니다.
3. hydration 완료 전이나 현재 Space가 없으면 `null`을 반환합니다.
4. 사용자가 다른 Space를 선택하면 상위에서 전달한 `onChangeSpace`를 호출합니다.
5. 실제 현재 Space 반영은 상위가 서버와 동기화한 뒤 store를 갱신하는 방식으로 처리합니다.
6. hydration 완료 후 결과를 렌더링/반환/전파합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.
- 브라우저 저장소 hydrate 전에는 렌더링을 지연해 SSR/CSR 첫 렌더 불일치를 피합니다.
- `onChangeSpace`가 없으면 표시 전용으로 동작하며 Space 변경 UI는 비활성화됩니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-31 | 선택 시 내부 store를 직접 갱신하지 않고 상위의 서버 동기화 콜백만 호출하도록 조정 | codex |
| 2026-03-14 | 로컬 `useState/useEffect` 대신 PersistStore `isHydrated`를 사용해 SSR/hydration 책임을 store/provider로 일원화 | codex |
| 2026-03-06 | 폴더 네이밍을 단수형(feature/action/input/selection/navigation/layout/hook/style/type/util/widget/cell)으로 통일 | codex |
| 2026-03-06 | Building2, ChevronDown, Check 아이콘을 파일 내부에서 직접 사용하도록 정리 | codex |
| 2026-03-06 | src 레이어 상향에 맞춰 util/hook 상대 import 깊이를 보정 | codex |
| 2026-03-06 | src/components 레이어를 제거하고 경로를 src/* 기준으로 상향 | codex |
| 2026-03-06 | feature 디렉토리를 features로 이관하고 경로 표기를 동기화 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
