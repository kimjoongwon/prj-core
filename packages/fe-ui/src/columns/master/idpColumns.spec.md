# master/idpColumns 기획서

> 생성일: 2026-03-27
> 타입: ui-support
> 위치: packages/fe-ui/src/columns/master/idpColumns.tsx

## 역할

IDP 콘솔 화면에서 사용하는 master table 컬럼 조합을 제공합니다.
OIDC Client, IDP Account, Auth Audit Log, OIDC Session 컬럼 빌딩 흐름을 한 파일에서 추적할 수 있습니다.

## 공개 계약

| 항목                           | 설명                           |
| ------------------------------ | ------------------------------ |
| `buildAuthAuditLogTableColumns` | Auth audit log 목록 컬럼 builder |
| `buildOidcClientTableColumns`  | OIDC Client 목록 컬럼 builder  |
| `oidcClientTableColumns`       | OIDC Client 목록 컬럼 조합     |
| `buildIdpAccountTableColumns`  | IDP Account 목록 컬럼 builder  |
| `idpAccountTableColumns`       | IDP Account 목록 기본 컬럼 조합 |
| `authAuditLogTableColumns`     | Auth audit log 컬럼 조합       |
| `buildOidcSessionTableColumns` | OIDC Session 목록 컬럼 builder |
| `oidcSessionTableColumns`      | OIDC Session 목록 기본 컬럼 조합 |

## 변경 이력

| 일자       | 내용                                                                                                             | 작성자 |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | ------ |
| 2026-03-29 | Auth audit log, IDP account, OIDC session 컬럼을 generic builder로 확장해 pure page가 API DTO 없이도 동일한 columns 조합을 재사용할 수 있게 정리 | codex  |
| 2026-03-29 | `OIDC Client` 목록 컬럼을 generic builder로 추출해 pure page가 API DTO 없이도 동일한 columns 조합을 재사용할 수 있게 정리 | codex  |
| 2026-03-28 | IDP column builder 주석을 영문에서 한글로 정리하고 세션 축약 표시 설명을 보강 | codex  |
| 2026-03-28 | 주요 IDP column builder 함수에 설명 주석을 추가해 lock/action/session 컬럼 의도를 보강 | codex  |
| 2026-03-28 | IDP master columns의 인라인 버튼/식별자/잠금 상태 렌더링을 `src/cell` 컴포넌트로 이동 | codex  |
| 2026-03-27 | IDP builder도 중간 column 변수 적재를 줄이고 최종 조립 시점에 공용 factory를 직접 호출하도록 정리                | codex  |
| 2026-03-27 | OIDC/IDP 컬럼의 `clientId`, `actions`, `occurredAt`, `grantId` 등 반복 field/label 문자열을 preset helper로 통일 | codex  |
| 2026-03-27 | 인증/세션 셀 primitive import를 이동된 루트 `src/cell` 배럴로 통일                                               | codex  |
| 2026-03-27 | IDP 영역 master columns를 도메인 파일로 분리하고 build flow 발견성을 높임                                        | codex  |
