# hook-contracts type 기획서

> 생성일: 2026-03-06
> 타입: type
> 위치: packages/common-type/src/hook-contracts.ts

## 역할

`@cocrepo/hook`에서 외부로 노출되는 Hook 옵션/반환 타입 계약을 중앙화합니다.  
Hook 구현은 `@cocrepo/hook`에 유지하고, 재사용 가능한 공개 타입만 이 파일에서 관리합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| UseFormFieldSingleOptions | useFormField 단일 경로 옵션 계약 |
| UseFormFieldMultiOptions | useFormField 다중 경로 옵션 계약 |
| UseFormFieldReturn | useFormField 반환 타입 |
| UseLayoutNavigationStoreLike | useLayout의 NavigationStore 최소 계약 |
| UseLayoutBottomTabStoreLike | useLayout의 BottomTabStore 최소 계약 |
| UseLayoutFABStoreLike | useLayout의 FABStore 최소 계약 |
| UseLayoutOptions | useLayout 입력 옵션 계약 |
| UseLayoutReturn | useLayout 반환 계약 |
| SpaceGuardPersistStoreLike | useSpaceGuard의 PersistStore 최소 계약 |
| UseSpaceGuardOptions | useSpaceGuard 입력 옵션 계약 |
| UseSpaceGuardReturn | useSpaceGuard 반환 계약 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | `SpaceGuardPersistStoreLike`에 `isHydrated`를 추가해 hydration 완료 후 guard 판단 계약을 명시 | codex |
| 2026-03-06 | fe-hook 로컬 공개 타입을 common-type으로 승격하기 위해 신규 생성 | codex |
