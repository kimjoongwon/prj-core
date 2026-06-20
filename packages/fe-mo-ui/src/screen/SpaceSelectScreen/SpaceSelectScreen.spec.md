# SpaceSelectScreen 계약서

> 생성일: 2026-05-17
> 타입: fe-mo-ui-screen
> owner: `packages/fe-mo-ui/src/screen/SpaceSelectScreen/SpaceSelectScreen.tsx`

## 목적

모바일 인증 직후 홈 진입 전에 사용자가 예약에 사용할 지점을 명시적으로 선택하도록 하는 화면이다. 선택된 지점은 앱의 `x-space-id` scope로 저장되고, 이후 예약 피드/수강권/내 예약 API 호출의 기준이 된다.

## 화면 계약

- 상단에는 지점 선택 목적을 짧게 보여준다.
- 지점 목록은 `SpaceSelectionList`를 사용한다.
- 각 지점은 `SpaceListItem`으로 렌더링하며 왼쪽에는 지점 이미지 또는 placeholder, 오른쪽에는 지점명과 주소를 표시한다.
- 플랫폼 운영 본부는 이 화면에 노출하지 않는다.
- loading, empty, error 상태는 `StatusFeedback`으로 렌더링한다.
- 사용자 노출 텍스트는 `@cocrepo/mo-ui` `Text` primitive로 감싸고, `react-native` `Text`를 직접 import하지 않는다.

## 이벤트 계약

| 이벤트 | 설명 |
|--------|------|
| `onSelectSpace(space)` | 지점 row를 누르면 route가 선택 Space를 검증하고 홈으로 이동한다. |
| `onPressRetry()` | 목록 조회 실패 또는 빈 상태에서 route가 지점 목록을 다시 조회한다. |