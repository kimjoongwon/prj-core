# OidcClientListPage ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/page/OidcClientListPage/OidcClientListPage.tsx

## 역할

OIDC 클라이언트 목록 화면의 pure page 컴포넌트입니다.
데이터 조회, querystring 상태, 라우팅은 route thin container가 소유하고 이 파일은 목록 시각 조합만 담당합니다.

## 디자인 스케치

```text
OidcClientListPage
- VStack
  - PageTitleBar
    - Button
  - Surface
    - DataGrid
```

## 화면 러프

### Desktop

```text
OIDC 클라이언트                                  [+ 클라이언트 등록]
시스템에 등록된 OIDC 클라이언트를 관리합니다.

┌────────────────────────────────────────────────────────────────────┐
│ Client ID  │ 이름      │ 인증 방식 │ Grant │ 신뢰 구분 │ Consent   │
├────────────┼───────────┼───────────┼───────┼───────────┼───────────┤
│ admin-web  │ Admin Web │ secret    │ code  │ First     │ 동의 생략 │
│ user-app   │ User App  │ none      │ code  │ Third     │ 동의 표시 │
└────────────────────────────────────────────────────────────────────┘
                                           [상세] [수정] [삭제]
```

### Tablet

```text
OIDC 클라이언트                              [+ 등록]
시스템에 등록된 OIDC 클라이언트를 관리합니다.

[Client ID 또는 이름으로 검색...]
┌──────────────────────────────────────────────┐
│ DataGrid table                               │
│ Client ID │ 이름 │ 신뢰 구분 │ Consent       │
│ admin-web │ ...  │ First     │ 동의 생략     │
│ user-app  │ ...  │ Third     │ 동의 표시     │
└──────────────────────────────────────────────┘
총 N건                              [pagination]
```

### Mobile

```text
OIDC 클라이언트
시스템에 등록된 OIDC 클라이언트를 관리합니다.
[클라이언트 등록]

[Client ID 또는 이름으로 검색...]
┌──────────────────────────────┐
│ DataGrid table                │
│ header/row는 table 유지       │
│ 신뢰 구분 / Consent 컬럼은    │
│ 좁은 폭에서도 접근 가능해야 함│
└──────────────────────────────┘
총 N건
[pagination]
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `VStack` | `@cocrepo/ui` | 화면 조합 요소 |
| `PageTitleBar` | `@cocrepo/ui` | 상단 제목, 설명, 주요 액션 표시 |
| `Button` | `@heroui/react` | 사용자 액션 실행 |
| `Plus` | `lucide-react` | 아이콘으로 상태나 액션을 시각화 |
| `Surface` | `@cocrepo/ui` | 콘텐츠 그룹과 elevation 구성 |
| `DataGrid` | `@cocrepo/ui` | 목록/표 데이터 표시 |

## 컬럼 구성

- 목록 row는 Client ID, 이름, 인증 방식, grant type, First-party/Third-party, Consent 표시/생략, 활성 상태, 생성일, 행 액션을 표시한다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| OidcClientListPageProps.oidcClients | OidcClientDto[] optional row 계약 |
| OidcClientListPageProps | pure page 입력 계약 |
| idpConsoleOidcClientsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| OidcClientListPage | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/api | DTO row contract type source |
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-05-09 | 화면 러프를 Desktop/Tablet/Mobile 기준으로 분리하고 모바일 DataGrid 접근 기준을 실제 구현에 맞게 보정 | codex |
| 2026-05-09 | first-party/consent 컬럼을 포함한 데스크톱/모바일 markdown 화면 러프를 추가 | codex |
| 2026-05-09 | OIDC client 목록에 first-party 신뢰 구분과 consent 표시/생략 상태 컬럼을 추가 | codex |
| 2026-04-28 | 목록 row 계약을 Page 전용 view model 대신 Orval DTO optional props로 정리 | codex |
| 2026-04-24 | 목록 검색과 페이지네이션 검색 조건 계약을 명시적으로 정리 | codex |
| 2026-03-29 | OIDC 클라이언트 목록 화면의 조회/검색 조건/이동 책임 경계 정리 | codex |
| 2026-03-26 | 초기 화면 기획 수립 | codex |
