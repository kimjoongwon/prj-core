# index hook 기획서

> 생성일: 2026-03-03
> 타입: hook
> 위치: apps/admin/web/src/hooks/index.ts

## 역할

이 파일은 hook 계층의 보조 동작(연결/조회/조합)을 담당합니다.

## 주요 계약

| 항목 | 설명 |
|------|------|
| export | admin 앱 전용 hook과 공용 hook re-export |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/hook | useDeviceType 등 concrete 앱 의존성이 없는 공용 hook re-export |
| ./useAbilities | admin 권한 API query와 공용 ability 상태 정규화 hook 조립 |
| ./useSpaceBootstrap | admin Space API query와 공용 Space bootstrap hook 조립 |
| ./useSpaceGuard | 기능 구현 의존성 |

## 구현 체크리스트

- [ ] 핵심 입출력/반환 규약이 코드와 일치함
- [ ] 호출 경로 변경 시 spec을 함께 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-04-24 | useAbilities/useSpaceBootstrap을 admin 앱 소유 hook으로 이관하고 index export를 갱신 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-04 | useAdminLayout export 제거 후 공용 useLayout 직접 사용 구조로 변경 | codex |
