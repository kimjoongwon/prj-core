# mobile app.json 기획서

> 생성일: 2026-04-14
> 타입: config
> 위치: apps/mobile/app.json

## 역할

Expo 모바일 앱의 런타임 메타데이터와 네이티브 식별자 계약을 정의합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| 기본 메타데이터 | 앱 이름, slug, scheme, 버전, 아이콘 |
| iOS 설정 | 앱 아이콘과 `bundleIdentifier` |
| Android 설정 | `package`, adaptive icon, predictive back gesture |
| plugins | Expo Router, Splash Screen 설정 |

## 규칙

- `scheme`, `ios.bundleIdentifier`, `android.package`는 local build(dev client) 실행 시 앱 런타임을 안정적으로 식별할 수 있도록 서로 일관된 앱 식별자를 유지합니다.
- iOS/Android native 식별자는 하이픈 없이 reverse-domain 형식을 사용합니다.
- Expo Router와 Splash Screen plugin은 앱 진입 구조와 런치 자산 계약을 유지하기 위해 계속 선언합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | local build 실행을 위해 `ios.bundleIdentifier`와 `android.package`를 추가하고 모바일 런타임 식별자 계약을 문서화 | codex |
