# be-facade

이 패키지는 Controller 경계에서 응답 조립, read model shaping, protocol composition을 담당하는 Facade 레이어입니다.

- `@cocrepo/app`: 사용자 과업 중심 usecase workflow orchestration
- `@cocrepo/facade`: boundary composition
- `@cocrepo/service`: aggregate root/domain logic

현재는 Facade 레이어의 공용 진입점과 패키지 의존성 구조를 우선 정리했습니다.
