# AdminRolesPage page 기획서

> 생성일: 2026-03-26
> 타입: page
> 위치: packages/fe-ui/src/page/AdminRolesPage/AdminRolesPage.tsx

## 역할

이 파일은 route thin wrapper가 재사용하는 page 레이어 화면 컴포넌트를 담당합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| AdminRolesPage | 공개 계약 요소 |
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api/core/roles | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| next/link | 기능 구현 의존성 |
| react | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-27 | `columns` 레이어 이관 후 남은 미사용 `RoleDto` type import를 제거해 page 계약을 단순화 | codex |
| 2026-03-27 | 역할 목록 raw table 컬럼을 page 내부 inline 선언 대신 `columns` 레이어의 공용 조합으로 이관 | codex |
| 2026-03-26 | route page 이관용 sidecar spec 신규 생성 | codex |
