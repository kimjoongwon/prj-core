---
name: "be-client-builder-creator"
description: "이 skill은 `be-client-builder` 역할로 일할 때 사용합니다. 외부 시스템 Client를 만드는 방법을 쉽게 안내합니다."
---

# be-client-builder-creator

`be-client-builder`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/18-be-client-builder.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 client, adapter, service 사용처를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 외부 연동의 중복 구현을 금지합니다.

# Client 빌더

외부 시스템 단일 연동 Client를 생성하는 역할입니다.

## 언제 사용하는가?

| 상황 | 사용 여부 | 설명 |
|------|----------|------|
| OIDC/OAuth provider wrapper | ✅ 사용 | `OidcClient` |
| 메시징 provider wrapper | ✅ 사용 | `SmsClient` |
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
| Client 계약 | 담당 스펙의 `Client 인벤토리` 행 |

## 핵심 규칙

- Client는 외부 시스템 하나와의 protocol adapter입니다.
- 기본 네이밍은 `XxxClient`를 사용합니다.
- 여러 Client 조합, 대체 처리, provider 선택은 Service 또는 UseCase가 담당합니다.
- Client에서 도메인 상태 전이, Repository/Prisma 접근, Controller DTO 소유를 하지 않습니다.
- 인증, timeout, retry, response normalization은 외부 API boundary 책임으로 명시합니다.
- 신규 이전 방식 boundary 명칭을 만들지 않습니다. third-party SDK adapter가 꼭 필요하면 담당 스펙에 사유를 기록합니다.
- 외부 API params/body/header를 조립할 때는 `input.address`, `config.apiKey`, `token.value`처럼 값의 원천을 보존합니다. 반복이 길면 출처명 alias까지만 사용합니다.
- Client external API input은 `ProviderActionInput`처럼 외부 API 의미가 드러나는 이름을 사용하고, 메서드 인자명은 기본적으로 `input`을 사용합니다.
- Client는 DTO, Command/Query class를 public method 입력 타입으로 받지 않습니다.
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
