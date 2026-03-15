# _client client 기획서

> 생성일: 2026-03-03
> 타입: page-client
> 위치: apps/admin/web/src/app/(admin)/assets/[assetId]/_client.tsx

## 역할

브라우저에서만 에셋 상세 API를 호출하고,
`Page + PageTitleBar` 구조를 유지한 채 본문을 `PageSurface`와 `SectionSurface`로 표현합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| default export | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| `@cocrepo/api/assets` | 기능 구현 의존성 |
| `@cocrepo/ui` | `PageSurface`, `SectionSurface`, `DateTimeCell`, `VStack` |
| `@heroui/react` | 버튼/입력/토스트/로딩 UI |
| `@tanstack/react-query` | 캐시 무효화 |
| `lucide-react` | 액션 아이콘 |
| `mobx-react-lite` | observer 래핑 |
| `next/navigation` | 라우팅 이동 |
| `react` | 상태 관리 |

## 동작 흐름

1. `assetId`를 입력받아 에셋 상세와 폴더 목록을 조회합니다.
2. 로딩/없음/정상 상태를 `Page + PageTitleBar` 구조로 분기합니다.
3. 정상 상태에서는 본문을 `PageSurface`로 감싸고, 각 상세 블록을 `SectionSurface + Section(top=PageTitleBar)`로 렌더링합니다.

## Surface ownership

- 이 파일은 `Page` boundary 안에서 에셋 상세 surface owner를 직접 소유합니다.
- 로딩 상태와 not-found 상태도 `PageSurface > SectionSurface`를 사용해 빈 배경 노출을 막습니다.
- 정상 상태에서는 `PageSurface`가 상세 본문을 감싸고, 정보/이동/스토리지 블록은 각각 `SectionSurface`로 분리합니다.

## 실패 및 엣지 케이스

- 의존 모듈 응답 누락 시 안전한 기본값으로 처리합니다.
- 비정상 입력은 조기 반환 또는 예외 처리합니다.
- 비동기 동작 실패 시 사용자 영향 범위를 최소화합니다.

## 구현 체크리스트

- [ ] 코드와 spec이 동일한 책임 범위를 유지함
- [ ] 공개 계약(Props/메서드/반환값) 변경 시 동기화함
- [ ] 의존성 변경 시 spec의 의존성 표를 갱신함

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-15 | Surface ownership과 상태 분기 표면 정책을 문서화 | codex |
| 2026-03-15 | assets 상세 클라이언트 spec에 `PageSurface`/`SectionSurface` ownership을 명시 | codex |
| 2026-03-15 | assets 상세 클라이언트 화면에 `Page + PageTitleBar` 구조는 유지하고 본문에 `PageSurface/SectionSurface`를 적용 | codex |
| 2026-03-13 | `@cocrepo/api` root import를 split subpath import로 전환 | codex |
| 2026-03-03 | 누락된 sidecar spec 신규 생성 | codex |
| 2026-03-03 | `PageTitleBar` 단일 컴포넌트 통합 및 리네이밍 반영 | codex |
