# @cocrepo/controller

NestJS REST controller layer for cocrepo.

## Ownership

- Controller 구현 파일은 `packages/be-controller/src/{domain}/*.controller.ts`에 둡니다.
- App module, provider wiring, RouterModule path 등록은 `apps/core/api/src/module/**`가 소유합니다.
- App module은 Controller class를 `@cocrepo/controller`에서 import합니다.

## Boundary

- Controller는 HTTP protocol adapter입니다.
- Controller는 `CommandBus` 또는 `QueryBus`만 primary entrypoint로 사용합니다.
- Controller는 Service, Repository, Client, UseCase handler를 직접 주입하지 않습니다.
- `@Controller()` path는 비워두고 route prefix는 app RouterModule이 소유합니다.
