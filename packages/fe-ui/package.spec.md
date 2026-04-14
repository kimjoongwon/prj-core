# @cocrepo/ui package 기획서

> 생성일: 2026-04-14
> 타입: package
> 위치: packages/fe-ui/package.json

## 역할

공용 UI 패키지의 개발 도구와 런타임 의존성 경계를 정의합니다.

## 규칙

- 공용 UI 패키지는 실제 스토리나 디버그 화면에서 사용하지 않는 개발 보조 도구를 dev dependency로 유지하지 않습니다.
- React Query 디버깅 도구는 앱 레이어에서 필요할 때만 추가하고, 공용 UI 패키지 기본 의존성에는 포함하지 않습니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-14 | 미사용 `@tanstack/react-query-devtools` dev dependency 제거 규칙을 문서화 | codex |
