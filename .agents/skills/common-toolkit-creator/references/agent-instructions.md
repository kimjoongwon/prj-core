# common-toolkit-builder 상세 지시

원본 에이전트 파일: `.codex/agents/08-common-toolkit-builder.toml`

이 참고 문서는 예전에 에이전트 TOML에 있던 상세 구현 지시를 담고 있습니다. 얇은 에이전트 계약과 이 skill의 `SKILL.md`를 읽은 뒤 따릅니다.

---


## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 `packages/common-toolkit`, 사용처, 라우트 딜리버리 스펙의 `기반 계약`, 관련 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 utility를 그대로 재사용하거나 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 utility를 금지합니다.

# 공용 toolkit 빌더

`common-toolkit-builder`는 `packages/common-toolkit` / `@cocrepo/toolkit`의 공용 utility source를 소유하는 역할입니다.

## 책임

- 순수 utility, formatter, parser, logger/helper, date/path/language/password/form helper를 생성하거나 정리합니다.
- pagination response builder처럼 여러 package/domain이 공유하는 순수 런타임 builder를 소유합니다.
- web, 모바일, 백엔드가 함께 쓸 수 있는 런타임-safe helper를 우선합니다.
- 신규/수정 utility는 `packages/common-toolkit/src/**`와 package export를 함께 정리합니다.
- 필요한 단위 테스트를 같은 작업에서 작성하거나 갱신합니다.
- utility/helper/parser/formatter는 파일당 하나의 exported function 또는 exported constant group만 소유합니다.

## 비책임

- React hook 생성은 `fe-hook-agent` 책임입니다.
- shared type/interface 생성은 `common-type-builder` 책임입니다.
- DTO/schema/entity/service/repository/controller 역할을 toolkit helper로 흡수하지 않습니다.
- app/route/screen 전용 임시 helper는 각 route agent 또는 소유 에이전트가 처리합니다.

## Spec 정책

- toolkit 전용 `*.spec.md`는 만들지 않습니다.
- 실행 범위는 생성된 라우트 딜리버리 스펙의 `기반 Slice > Toolkit 인벤토리`와 서비스 스펙 인벤토리를 함께 따릅니다.
- Screen/Feature 기획 스펙에는 toolkit 세부 실행표를 두지 않고 필요한 경우 의존 계약으로만 적습니다.
- route-local util이면 `common-toolkit-builder`가 아니라 웹/모바일 모두 `fe-route-agent` 책임으로 둡니다.

## 완료 기준

- 기존 중복 utility 검색 결과를 확인했습니다.
- 소스/export/test가 동기화되었습니다.
- 라우트 딜리버리 스펙의 `Toolkit 인벤토리`와 `에이전트 배정 매트릭스`가 신규/수정 산출물과 일치합니다.
- `@cocrepo/toolkit` 테스트 또는 필요한 단위 테스트 명령 결과를 보고합니다.
