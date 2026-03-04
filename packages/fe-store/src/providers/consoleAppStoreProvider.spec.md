# consoleAppStoreProvider store 기획서

> 생성일: 2026-03-04
> 타입: store
> 위치: packages/fe-store/src/providers/consoleAppStoreProvider.tsx

## 역할

IDP 콘솔 내비게이션 구성을 공통 provider preset으로 제공하는 파일입니다.
앱 로컬 store wiring 없이 `@cocrepo/store`에서 직접 import해 사용할 수 있도록 합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| consoleAppStoreProvider | createAppStoreProvider로 생성된 preset 결과 객체 |
| ConsoleAppStoreContext | 콘솔용 AppStore Context |
| ConsoleAppStoreProvider | 콘솔용 AppStore Provider 컴포넌트 |
| useConsoleAppStore | 콘솔용 RootStore 접근 훅 |
| useConsoleNavigationStore | 콘솔용 NavigationStore selector 훅 |
| useConsolePersistStore | 콘솔용 PersistStore selector 훅 |
| useConsoleBottomTabStore | 콘솔용 BottomTabStore selector 훅 |
| useConsoleFABStore | 콘솔용 FABStore selector 훅 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/constant | IDP_NAV_ITEMS preset 구성 |
| ./createAppStoreProvider | provider factory |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-04 | IDP 앱 로컬 AppStoreProvider 제거를 위한 공통 console preset 신규 추가 | codex |
