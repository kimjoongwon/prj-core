# space-context util 기획서

> 생성일: 2026-03-03
> 타입: util
> 위치: packages/be-context/src/space-context.ts

## 역할

이 파일은 util 성격의 경량 구성/배럴 책임을 가집니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| SpaceContext | 공개 계약 요소 |

## 런타임 전제

- Nest DI가 `ClsService`를 주입하려면 decorator metadata가 유지되어야 한다.
- `@cocrepo/context`가 참조하는 `nestjs-cls` major version은 앱 런타임과 일치해야 한다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | `nestjs-cls` major version 불일치가 DI 토큰 불일치로 이어지지 않도록 런타임 전제를 명시 | codex |
| 2026-03-14 | Nest DI가 `ClsService`를 주입할 수 있도록 패키지 빌드가 decorator metadata를 유지해야 한다는 런타임 전제를 명시 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | AuthContext 직접 의존을 제거하고 CLS 기반으로 Space 접근 계산 로직을 정리 | codex |
| 2026-04-14 | SpaceContext의 현재 Space source를 x-space-id header로 명시하도록 갱신 | codex |
