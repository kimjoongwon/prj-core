# 서비스 딜리버리 Spec

`docs/services/**/*.delivery.spec.md`는 기본 기획 산출물이 아닙니다.

## 현재 원칙

- UI가 있는 작업의 기준 spec은 해당 route의 `page.spec.md` 또는 `index.spec.md` 하나입니다.
- 화면 Markdown 러프, screen/feature/form/widget 렌더링, props/event, 상태별 렌더링은 route/page spec이 소유합니다.
- 별도 Screen/Feature/Form planning spec을 만들지 않습니다.
- cross-route 서비스 문서가 명시적으로 필요할 때만 `docs/services/**/*.delivery.spec.md`를 만들 수 있습니다.
- cross-route 서비스 문서를 만들더라도 화면 계약은 route/page spec으로 위임하고 중복 작성하지 않습니다.
- spec 본문, 섹션명, 표 헤더, 승인 질문은 한글로 작성합니다. `agent_type`, `operationId`, `codegen`, 패키지명, 파일 경로, enum 값, 명령어 같은 고정 기술 식별자만 원문을 유지합니다.
