# Admin Short UUID Spec

## 결론

백엔드가 UUID를 short key로 직렬화해서 내려준다.

프론트는 지금처럼 `id` 문자열을 사용한다. 다만 변경 후 API 응답의 `id` 값은 UUID가 아니라 short key가 된다. 프론트가 직접 UUID를 short key로 바꾸거나, short key를 UUID로 되돌리는 코드를 페이지마다 넣지 않는다.

```txt
DB / Repository / Service
  UUID만 사용

Controller 내부
  UUID만 사용

Response DTO
  UUID -> shortKey

Request DTO / Path Param
  shortKey -> UUID

Frontend
  API에서 받은 id 문자열을 그대로 사용
```

## 목표

- URL에 긴 UUID가 노출되지 않게 한다.
- 프론트 route/page/query/mutation 호출부에 encode/decode 유틸 호출을 퍼뜨리지 않는다.
- 백엔드 내부 로직, Prisma, Repository, Service는 계속 UUID 기준으로 유지한다.
- 기존 UUID URL/API 호출도 깨지지 않게 한다.

## 핵심 설계

### 1. UUID codec은 공용 toolkit에 둔다

`@cocrepo/toolkit`에 UUID와 short key 변환 유틸을 만든다.

```ts
toRouteKey(uuid: string): string
fromRouteKey(value: string): string
tryFromRouteKey(value: string): string | null
isUuid(value: string): boolean
isRouteKey(value: string): boolean
```

정책:

- UUID는 base64url 22자 short key로 변환한다.
- 이미 UUID면 그대로 UUID로 인식한다.
- 복원 불가능한 값은 `tryFromRouteKey`에서 `null`을 반환한다.
- short key는 보안 기능이 아니다. 표현 개선용이다.

### 2. Response DTO는 UUID를 short key로 내려준다

`@UUIDField()`에 class-transformer transform을 추가한다.

```ts
@Transform(({ value }) => toRouteKey(value), { toPlainOnly: true })
```

예:

```json
// before
{ "id": "018f9e5e-1d3b-7a91-bc21-1e0d9c3d01ab" }

// after
{ "id": "AY-eXh07epG8IR4NnD0Bqw" }
```

따라서 프론트의 기존 코드:

```ts
router.push(`/templates/${template.id}`)
```

는 그대로 두어도 URL이 짧아진다. 이유는 `template.id`가 백엔드 응답에서 이미 short key이기 때문이다.

### 3. Request DTO는 short key를 UUID로 복원한다

`@UUIDField()`에 request transform도 추가한다.

```ts
@Transform(({ value }) => fromRouteKey(value), { toClassOnly: true })
```

즉 body/query DTO 안의 UUID 필드는 short key로 들어와도 controller/service에서는 UUID로 받는다.

단, 모든 `*Id` 문자열을 자동 변환하지 않는다. `clientId`, `providerTransactionId`, token 같은 외부 시스템 ID가 섞여 있기 때문이다.

변환 대상은 기본적으로 `@UUIDField()`가 붙은 필드다.

### 4. Path param은 DTO를 타지 않으므로 Pipe로 복원한다

아래 값은 DTO 데코레이터를 타지 않는다.

```ts
@Get(":templateId")
getTemplate(@Param("templateId", ParseUUIDPipe) templateId: string)
```

그래서 global pipe를 추가한다.

```ts
RouteKeyToUuidPipe
```

동작:

- `metadata.type !== "param"`이면 아무 것도 하지 않는다.
- param 이름이 `id` 또는 `*Id`가 아니면 아무 것도 하지 않는다.
- 값이 UUID면 그대로 둔다.
- 값이 short key면 UUID로 복원한다.
- 복원할 수 없는 값은 그대로 둔다.
- 이후 기존 `ParseUUIDPipe`가 UUID 검증을 수행한다.

등록 위치:

```ts
// apps/core/api/src/setNestApp.ts
app.useGlobalPipes(
  new RouteKeyToUuidPipe(),
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
  }),
);
```

## 프론트 동작

프론트가 short key를 직접 만들지 않는다.

변경 전:

```txt
GET /api/v1/templates
-> id가 UUID
-> /templates/{uuid}
```

변경 후:

```txt
GET /api/v1/templates
-> id가 shortKey
-> /templates/{shortKey}
-> GET /api/v1/templates/{shortKey}
-> backend pipe가 UUID로 복원
```

프론트 코드는 대부분 지금처럼 `id`를 문자열로 쓰면 된다.

단, 프론트에서 직접 UUID 형식 검증을 하는 코드가 있으면 제거하거나 `id` 문자열 검증으로 바꿔야 한다.

## 예시 코드 스니펫

### 1. DTO 응답에서 UUID를 short key로 내려주는 예시

구현 위치 예시:

```txt
packages/be-decorator/src/field/specialized/uuid.field.ts
```

```ts
import { fromRouteKey, toRouteKey } from "@cocrepo/toolkit";
import { Transform, Type } from "class-transformer";

export function UUIDField(options: UUIDFieldOptions = {}): PropertyDecorator {
  const decorators: PropertyDecorator[] = [
    Type(() => String),
    Transform(({ value }) => {
      if (value === null || value === undefined) return value;
      return Array.isArray(value) ? value.map(toRouteKey) : toRouteKey(value);
    }, { toPlainOnly: true }),
    Transform(({ value }) => {
      if (value === null || value === undefined) return value;
      return Array.isArray(value)
        ? value.map((item) => fromRouteKey(String(item)))
        : fromRouteKey(String(value));
    }, { toClassOnly: true }),
  ];

  // 기존 nullable, validator, Swagger decorator 구성은 유지한다.
  return applyDecorators(...decorators);
}
```

DTO는 기존처럼 `@UUIDField()`를 사용한다.

```ts
export class TemplateDto extends AbstractDto {
  @UUIDField()
  id!: string;
}
```

응답은 UUID가 아니라 short key로 내려간다.

```json
{
  "id": "AY-eXh07epG8IR4NnD0Bqw"
}
```

### 2. 요청 DTO에서 short key를 UUID로 복원하는 예시

```ts
export class CreateReservationDto {
  @UUIDField()
  timelineId!: string;

  @UUIDField()
  sessionId!: string;
}
```

프론트 요청:

```json
{
  "timelineId": "AY-eXh07epG8IR4NnD0Bqw",
  "sessionId": "AY-eXh07epG8IR4NnD0BrA"
}
```

Controller/Service에서 받는 값:

```txt
timelineId = "018f9e5e-1d3b-7a91-bc21-1e0d9c3d01ab"
sessionId = "018f9e5e-1d3b-7a91-bc21-1e0d9c3d01ac"
```

### 3. Path param pipe 예시

구현 위치 예시:

```txt
packages/be-common/src/pipe/route-key-to-uuid.pipe.ts
```

```ts
import { isUuid, tryFromRouteKey } from "@cocrepo/toolkit";
import { Injectable } from "@nestjs/common";
import type { ArgumentMetadata, PipeTransform } from "@nestjs/common";

@Injectable()
export class RouteKeyToUuidPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== "param" || typeof value !== "string") {
      return value;
    }

    const paramName = metadata.data;
    const isIdParam = paramName === "id" || paramName?.endsWith("Id") === true;
    if (!isIdParam) {
      return value;
    }

    if (isUuid(value)) {
      return value;
    }

    const uuid = tryFromRouteKey(value);
    return uuid ?? value;
  }
}
```

등록 예시:

```ts
app.useGlobalPipes(
  new RouteKeyToUuidPipe(),
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: false,
  }),
);
```

Controller는 기존 형태를 유지한다.

```ts
@Get(":templateId")
async getTemplate(@Param("templateId", ParseUUIDPipe) templateId: string) {
  return this.templatesService.getTemplate(templateId);
}
```

### 4. 프론트 코드는 기존 id 사용 방식을 유지하는 예시

프론트는 encode/decode를 직접 호출하지 않는다.

```ts
const template = response.data;

router.push(`/templates/${template.id}`);
```

변경 후 `template.id`는 백엔드 응답에서 이미 short key다.

```txt
before: /templates/018f9e5e-1d3b-7a91-bc21-1e0d9c3d01ab
after:  /templates/AY-eXh07epG8IR4NnD0Bqw
```

상세 조회도 기존 API hook 호출 모양을 유지한다.

```ts
const { templateId } = useParams<{ templateId: string }>();

const query = useGetTemplate(templateId);
```

`templateId`가 short key여도 백엔드 path param pipe가 UUID로 복원한다.

복원할 수 없는 값은 pipe가 직접 에러를 던지지 않고 그대로 둔다. 이렇게 해야 `subjects/:id`, `oidc-sessions/:grantId`처럼 이름은 id 계열이지만 UUID가 아닌 기존 endpoint를 깨뜨리지 않는다. UUID endpoint는 기존 `ParseUUIDPipe`가 뒤에서 검증한다.

## 구현 범위

수정 대상:

- `packages/common-toolkit`
  - route key codec 추가
- `packages/be-decorator`
  - `@UUIDField()` transform 추가
  - Swagger `format: uuid` 단독 표기 조정
- `packages/be-dto`
  - UUID 필드인데 `@UUIDField()`가 빠진 DTO만 보강
- `packages/be-common`
  - `RouteKeyToUuidPipe` 추가
- `apps/core/api/src/setNestApp.ts`
  - global pipe 등록
- `packages/fe-api`
  - OpenAPI/codegen 결과 갱신

수정하지 않는 대상:

- DB schema
- Prisma model
- Repository 조회 방식
- Service/UseCase 내부 로직
- `customAxios`
- admin route page의 개별 encode/decode 유틸
- `Navigation` 기반 대규모 라우팅 리팩터링

## 검증

Unit:

- UUID ↔ short key roundtrip
- invalid short key 처리
- `@UUIDField()` response transform: UUID -> short key
- `@UUIDField()` request transform: short key -> UUID
- `RouteKeyToUuidPipe`: `id`, `templateId`, `timelineId` short key 복원
- `RouteKeyToUuidPipe`: non-id param 미변환

Integration:

- 목록 API 응답의 `id`가 short key로 내려온다.
- short key path로 상세 조회가 된다.
- legacy UUID path로 상세 조회가 된다.
- short key body/query DTO가 UUID로 복원된다.

Static:

```sh
pnpm --filter @cocrepo/toolkit type-check
pnpm --filter @cocrepo/decorator type-check
pnpm --filter @cocrepo/dto type-check
pnpm --filter @cocrepo/be-common test
pnpm --filter admin-web type-check
```

금지:

```sh
rg "fromRouteKey|toRouteKey|tryFromRouteKey" packages/be-service packages/be-repository
rg "fromRouteKey|toRouteKey|tryFromRouteKey" packages/fe-api/src/libs
```

## 결정 사항

- v1은 백엔드 DTO/Pipe 중심으로 처리한다.
- 프론트는 백엔드가 내려준 `id` 문자열을 그대로 사용한다.
- short key는 public identifier 표현 방식이며 보안 기능이 아니다.
- 내부 canonical id는 계속 UUID다.
