# 서비스 딜리버리 Spec

`docs/services/**/*.delivery.spec.md`는 서비스 전체 기획과 실행의 상위 기준입니다.

## 작성 원칙

- `orch-delivery`가 질문 기반 기획을 통해 서비스 목표, 사용자/권한, 도메인 모델, 모든 web/mobile route, backend/API/foundation 계약, 디자인 방향, QA 기준을 확정한 뒤 작성합니다.
- 승인 전에는 route/page spec 생성, agent 실행, QA role 실행을 하지 않습니다.
- route delivery spec은 여기서 파생된 실행 slice이며, 화면 계약과 route 연결, route-local state/test, 해당 route가 소비하는 API slice만 소유합니다.
- spec 본문, 섹션명, 표 헤더, 승인 질문은 한글로 작성합니다. `agent_type`, `operationId`, `codegen`, 패키지명, 파일 경로, enum 값, 명령어 같은 고정 기술 식별자만 원문을 유지합니다.

## 필수 섹션

- `## 서비스 목표`
- `## 사용자 / 역할 / 권한`
- `## 도메인 모델 / 생명주기`
- `## 사용자 여정`
- `## 필수 페이지 / 라우트`
- `## 백엔드 / API / 기반 계약`
- `## DESIGN.md 기반 디자인 방향`
- `## 생성된 라우트 Spec`
- `## 에이전트 배정 매트릭스`
- `## 실행 그래프`
- `## QA / 승인 기준`
- `## 승인 / 실행 로그`
