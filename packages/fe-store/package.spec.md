# @cocrepo/store package 기획서

> 생성일: 2026-04-14
> 타입: package
> 위치: packages/fe-store/package.json

## 역할

MobX 기반 공용 store 패키지의 런타임/테스트 의존성 경계를 정의합니다.

## 규칙

- 공용 store 패키지는 React 바인딩이 필요한 실제 UI 코드가 없는 경우 `@casl/react` 같은 React 전용 보조 패키지를 dev dependency로 유지하지 않습니다.
- 권한 모델링은 `@casl/ability`를 기준으로 유지하고, React 통합 계층은 UI 패키지나 앱에서 직접 선택합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 미사용 `@casl/react` dev dependency 제거 규칙을 문서화 | codex |
