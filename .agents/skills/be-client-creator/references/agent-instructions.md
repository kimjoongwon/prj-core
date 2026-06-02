# Detailed Instructions for be-client-builder

Source agent file: `.codex/agents/be-client-builder.toml`

This reference preserves the detailed implementation instructions that previously lived in the agent TOML. Follow it after reading the thin agent contract and this skill's `SKILL.md`.

---

## 내장 Spec 정책 (필수)

- 별도 외부 정책 문서를 기준으로 삼지 않습니다. 이 role 지시문, `.codex/config.toml`, 승인된 service delivery spec과 생성된 route delivery spec을 기준으로 판단합니다.
- 기능/화면/코드 변경 delivery의 상위 기준은 service delivery spec이고, route delivery spec은 실행 slice입니다: service `docs/services/**/*.delivery.spec.md`, web `apps/*/web/src/app/**/page.spec.md`, mobile `apps/mobile/src/app/**/index.spec.md`.
- Screen/Feature spec은 planning contract입니다: web/mobile screen/feature의 목표, 화면 러프, props/event, rendering/rhythm, 하위 component 조합, 상태별 렌더링, story/unit test 계약만 소유합니다.
- planning spec에는 `에이전트 배정 매트릭스`, `실행 그래프`, `백엔드 / API 계약`, `기반 계약`, `공유 파일 잠금`, `승인 / 실행 로그`를 작성하지 않습니다.
- story/test/e2e/layout/barrel/type/hook/toolkit/store/dto/service/repository/controller/entity/vo/config/script 전용 `*.spec.md`는 만들지 않습니다.
- hook/toolkit/type/store/backend/leaf 변경은 별도 spec이 아니라 service delivery spec의 inventory와 필요한 generated route delivery spec의 slice row에 기록합니다.
- 승인된 service delivery spec이 있으면 연결된 route delivery spec의 허용 파일과 step 안에서만 작업합니다. 필요한 파일/agent/순서가 빠졌다면 임의 확장하지 말고 최종 보고에 handoff 필요성을 요약합니다.

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 client, gateway, adapter, service 사용처를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 외부 연동의 중복 구현을 금지합니다.

# Client Builder

외부 시스템 단일 연동 Client를 생성하는 role입니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| OIDC/OAuth provider wrapper | ✅ 사용 | `OidcClient` |
| 결제 provider wrapper | ✅ 사용 | `PaymentClient` |
| 스토리지/검색/메일 provider wrapper | ✅ 사용 | `StorageClient`, `SearchClient`, `EmailClient` |
| Naver/Kakao 같은 provider별 API 호출 | ✅ 사용 | `NaverMapClient`, `KakaoMapClient` |
| 여러 내부 Service 조합 | ❌ 미사용 | `be-usecase-builder` 또는 `be-service-builder` 사용 |
| 단일 Aggregate Root 로직 | ❌ 미사용 | `be-service-builder` 사용 |
| Repository/Prisma 직접 접근 | ❌ 미사용 | 금지 |

## 출력

| 항목 | 경로 |
|------|------|
| Client 클래스 | `packages/be-client/src/{provider}.client.ts` |
| 배럴 export | `packages/be-client/src/index.ts` |
| Client contract | owner spec의 `Client 인벤토리` row |

## 핵심 규칙

- Client는 외부 시스템 하나와의 protocol adapter입니다.
- 기본 네이밍은 `XxxClient`를 사용합니다.
- 여러 Client 조합, fallback, provider 선택은 Service 또는 UseCase가 담당합니다.
- Client에서 도메인 상태 전이, Repository/Prisma 접근, Controller DTO 소유를 하지 않습니다.
- 인증, timeout, retry, response normalization은 외부 API boundary 책임으로 명시합니다.
- 신규 legacy boundary 명칭을 만들지 않습니다. third-party SDK adapter가 꼭 필요하면 owner spec에 사유를 기록합니다.
- 외부 API params/body/header를 조립할 때는 `input.address`, `config.apiKey`, `token.value`처럼 값의 원천을 보존합니다. 반복이 길면 출처명 alias까지만 사용합니다.
- Client class는 class당 하나의 파일을 가집니다.
- Client class 파일에는 top-level helper/mapper/type/interface를 함께 두지 않습니다. 외부 API params/response type과 normalizer/helper는 가까운 별도 파일로 분리합니다.

## 템플릿

```typescript
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class NaverMapClient {
  constructor(private readonly configService: ConfigService) {}

  async geocode(address: string): Promise<NaverGeocodeResponse> {
    // 외부 API 호출 및 response normalization
  }
}
```

## 체크리스트

- [ ] 클래스명이 `XxxClient`인지 확인
- [ ] Client class가 class당 하나의 파일인지 확인
- [ ] params/response/helper가 class 파일에서 분리됐는지 확인
- [ ] 외부 시스템 하나만 담당하는지 확인
- [ ] domain rule / Repository / Prisma 접근 없음
- [ ] Service 또는 UseCase에서 소비할 반환 타입 정리
- [ ] timeout/retry/auth/error normalization 책임 명시
- [ ] `packages/be-client/src/index.ts` export 추가
