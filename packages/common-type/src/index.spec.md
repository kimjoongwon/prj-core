# index 배럴 기획서

> 생성일: 2026-03-03
> 타입: index
> 위치: packages/common-type/src/index.ts

## 역할

이 파일은 index 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| Constructor | 공개 계약 요소 |
| BaseEntityFields | 공개 계약 요소 |
| Join | 공개 계약 요소 |
| Prev | 공개 계약 요소 |
| Paths | 공개 계약 요소 |
| Leaves | 공개 계약 요소 |
| Option | 공개 계약 요소 |
| MobxProps | 공개 계약 요소 |
| FormUnitProps | 공개 계약 요소 |
| PathTuple | 공개 계약 요소 |
| ValueSplitter | 공개 계약 요소 |
| ValueAggregator | 공개 계약 요소 |
| AppIconName | 공개 계약 요소 |
| ScreenScopeKind | 공개 계약 요소 |
| AbilityChecker | 공개 계약 요소 |
| NavItemScopeChecker | 공개 계약 요소 |
| NavigationStoreOptions | 공개 계약 요소 |
| FABStoreOptions | 공개 계약 요소 |
| AppStoreConfig | 공개 계약 요소 |
| UseFormFieldSingleOptions | 공개 계약 요소 |
| UseLayoutOptions | 공개 계약 요소 |
| UseSpaceGuardOptions | 공개 계약 요소 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-16 | 화면 scope 계약(`ScreenScopeKind`, `NavItemScopeChecker`) export를 루트 배럴에 추가 | codex |
| 2026-03-15 | 루트 타입 배럴에서 `ObjectStorageConfig`/`ObjectStorageProvider` export를 추가 | codex |
| 2026-03-11 | `AppIconName` 공개 export를 추가해 UI 아이콘 계약을 루트 타입 배럴에서 직접 import 가능하게 정리 | codex |
| 2026-03-06 | 미사용 템플릿 타입 export 블록 제거 | codex |
| 2026-03-06 | Store/Hook 계약 타입 export(AbilityChecker, AppStoreConfig, UseLayoutOptions 등) 추가 | codex |
| 2026-03-06 | CASL 공용 타입(APP_ACTIONS/AppAction/AppSubject/AbilityRule/AbilityApiResponse) export 추가 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
