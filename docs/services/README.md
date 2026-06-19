# 서비스 딜리버리 Spec

`docs/services/**/*.delivery.spec.md`는 서비스 전체 기획과 실행의 상위 기준입니다.

## 작성 원칙

- `orch-delivery`가 질문 기반 기획을 통해 서비스 목표, 사용자/권한, 도메인 모델, 모든 web/mobile route, backend/API/foundation 계약, 디자인 방향, 검증 기준을 확정한 뒤 작성합니다.
- 승인 전에는 route/page spec 생성이나 subagent 실행을 하지 않습니다.
- route/page 딜리버리 스펙은 여기서 파생된 실행 slice이며, 화면 계약과 route 연결, route-local 상태/test, 해당 route가 소비하는 API slice만 소유합니다.
- 각 subagent step은 실행 전에 예상 산출물과 생성/수정 예정 경로를 spec에 기록합니다. 직렬 다음 subagent는 이 산출물 행과 실제 완료 경로를 입력으로 삼습니다.
- spec 본문, 섹션명, 표 헤더, 승인 질문은 한글로 작성합니다. `agent_type`, `operationId`, `codegen`, 패키지명, 파일 경로, enum 값, 명령어 같은 고정 기술 식별자만 원문을 유지합니다.

## 필수 섹션

- `## 서비스 목표`
- `## 사용자 / 역할 / 권한`
- `## 도메인 모델 / 생명주기`
- `## 사용자 여정`
- `## 필수 페이지 / 라우트`
- `## 백엔드 / API / 기반 계약`
- `## DESIGN.md 기반 디자인 방향`
- `## Spec 참조 맵`
- `## 생성된 Route/Page Spec`
- `## Screen/Feature Spec 인덱스`
- `## 산출물 시뮬레이션 / 인계 계약`
- `## 에이전트 배정 매트릭스`
- `## 실행 그래프`
- `## 테스트 인벤토리 / 검증 에이전트`
- `## 검증 / 승인 기준`
- `## 승인 / 실행 로그`

## 산출물 인계 표 필수 컬럼

`## 산출물 시뮬레이션 / 인계 계약`은 아래 컬럼을 포함합니다.

| step id | phase | 담당 `agent_type` | 입력 spec/파일 | 예상 산출물 | 생성/수정 예정 경로 | 소비 step / `agent_type` | 인계 조건 | 검증 기준 |
|---------|-------|-------------------|----------------|-------------|----------------------|---------------------------|-----------|-----------|

- spec, 소스, 생성 결과, Storybook story, test, config, route wiring처럼 다음 step이 소비할 모든 산출물을 기록합니다.
- 경로가 비어 있거나 소비 step이 없는 신규/수정 step은 승인하지 않습니다. 소비자가 없는 cleanup/delete step은 `none-cleanup`과 사유를 기록합니다.
