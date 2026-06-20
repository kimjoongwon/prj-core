# be-facade

이 패키지는 이전 boundary composition 실험의 잔여 패키지입니다.

신규 backend 흐름은 `Controller -> Command/Query -> UseCase -> Aggregate/Service/Client`를 기준으로 합니다. 새 작업에서 `@cocrepo/facade`를 runtime 경계로 추가하지 않습니다.

응답 조립이나 read model shaping이 필요하면 owner 위치를 먼저 정합니다.

- HTTP protocol 변환: `packages/be-controller`
- 사용자 과업 조합: `packages/be-usecase`
- 도메인/외부 기능 호출: `packages/be-aggregate`, `packages/be-service`, `packages/be-client`
