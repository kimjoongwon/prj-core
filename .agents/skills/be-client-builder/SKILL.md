---
name: "be-client-builder"
description: "이 skill은 `be-client-builder` 역할로 일할 때 사용합니다. 외부 시스템 Client를 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# be-client-builder

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 client, adapter, service 사용처를 먼저 검색합니다.
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

## 핵심 규칙

- Client는 외부 시스템 하나와의 protocol adapter입니다.
- 기본 네이밍은 `XxxClient`를 사용합니다.
- 여러 Client 조합, 대체 처리, provider 선택은 Service 또는 UseCase가 담당합니다.
- Client에서 도메인 상태 전이, Repository/Prisma 접근, Controller DTO 소유를 하지 않습니다.
- 인증, timeout, retry, response normalization은 외부 API boundary 책임으로 명시합니다.
- 외부 API params/body/header 조립이 반복되면 출처명 alias까지만 사용합니다.
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

## 입력 계약

### 요청에서 확인할 정보

- 요청에서 이 skill이 소유하는 owner 단위 작업의 목표, 대상과 플랫폼 또는 런타임을 확인합니다.
- 사용자가 명시한 UX, 업무 정책과 추가 완료 기준만 입력으로 사용합니다.

### 저장소에서 직접 찾을 정보

- 대상 package와 기존 구현, 모델, schema, 타입, 공개 export, 소비 코드와 테스트 패턴을 직접 찾습니다.
- 경로가 없다는 이유로 멈추지 않고 이 문서의 탐색 순서와 기존 owner 산출물을 기준으로 확인합니다.

### 구현 전 필수 조건

- 대상과 ownership이 식별되고 이 문서의 역할별 선행 조건이 충족되어야 합니다.
- 자신의 ownership에서 생성 가능한 입력은 직접 만들고 기존 공개 계약을 우선 재사용합니다.

### 입력 필요 조건

- 다른 owner의 필수 산출물 또는 저장소 근거로 결정할 수 없는 제품 결정이 없으면 구현 전에 입력 필요로 종료합니다.
- 입력 필요에서는 파일을 변경하지 않고 누락 입력, 대상 owner와 소비 경로만 간결하게 보고합니다.
## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
