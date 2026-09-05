# Entity에서 파생하는 요청 DTO 계약

생성·수정 DTO는 `@nestjs/swagger`의 `PickType(Entity, 허용필드)`로 공통 메타데이터를 직접 선택합니다. 수정 DTO는 생성 DTO나 기본 응답 DTO를 경유하지 않습니다. 원래 필드 모두가 API 전용 계약인 독립 DTO는 그 계약을 유지합니다. 필드 목록을 명시하므로 Entity에 새로운 속성이나 메서드가 추가되어도 요청 계약에 자동으로 들어오지 않습니다.

기존 `PartialType`에서 파생한 수정 요청은 null 허용 동작을 유지합니다. 기존 `*FieldOptional`로 독립 선언한 선택 입력은 `PartialType(..., { skipNullProperties: false })`로 undefined만 건너뜁니다. Entity에서 nullable인 필드라도 입력에서 null을 금지하던 경우는 공통 Pick에서 제외하고 입력 계약을 유지합니다.

## 입력 문맥에 남기는 필드

| 대상 | DTO가 별도로 소유하는 계약 |
| --- | --- |
| Role | 생성은 `name/displayName/description`, 수정은 `displayName/description`만 허용하며 `assignments`는 요청 대상이 아닙니다. |
| CreateUserDto / UpdateUserDto | 현재 controller에서 사용하지 않지만 기존 보안 상태 필드를 포함한 허용 목록과 API 투영인 `spaceId`를 유지합니다. 저장된 password/내부 ULID는 요청에 포함하지 않습니다. |
| 회원 생성·수정 | 이름 길이, 전화번호 형식, 평문 비밀번호, 역할·분류·그룹 연결 입력을 유지합니다. 동일한 email 메타데이터는 User에서 가져옵니다. |
| Folder | 금지 문자와 최대 길이가 있는 폴더명 입력 규칙을 유지합니다. 부모 ID는 Folder에서 가져옵니다. |
| Asset / Derivative | DB의 `bigint` 파일 크기는 기존 API의 `number` 계약으로 받습니다. Asset의 `publicUrl`은 API 전용 투영입니다. |
| Ability | ID는 Entity에서 가져옵니다. 강제 변환하지 않는 문자열·boolean 검증, 임의 JSON conditions와 입력의 기본값 문서는 요청 계약입니다. |
| Inquiry / InquiryMessage | 제목·내용 길이와 최초 메시지, 기본 스레드 선택, nullable 저장 ID에 대한 null 금지 등 입력 문맥을 유지합니다. |
| Policy / ServiceDocument / TemplateVariable / Activity | 저장된 nullable 값과 생성 입력의 null 금지가 다른 필드는 요청에 남깁니다. 그 외 필수/선택 필드는 Entity Pick과 Partial로 조합합니다. |
| Task / Session / Routine / Template | 중첩 요청의 기존 공개 DTO 타입과 조합 항목을 유지합니다. 도메인 객체 전체를 입력으로 확장하지 않습니다. |
| FitnessCenter | 생성에 함께 필요한 사업자 정보·콘텐츠 언어와 최소 Space 투영을 유지합니다. `CreateSpaceWithFitnessCenterDto`는 같은 복합 생성 payload의 공개 wrapper입니다. |
| Translation | Entity의 언어 코드 검증은 재사용하고 기존 인라인 enum 문서/공개 enum 타입은 유지합니다. 숫자를 문자열로 변환하지 않는 검증, 빈 문자열 수정 허용, 엄격한 boolean 입력은 별도 API 계약입니다. 이 때문에 UpdateTranslationDto는 독립 선언합니다. |
| Community | 대응하는 Entity가 없으며 기존 CommunityPostSchema의 payload 계약을 유지합니다. |

UpdateSessionDto는 기존에 허용하던 `id/createdAt/updatedAt/removedAt`을 Entity에서 선택하고, `programs/timeline`은 기존 중첩 API DTO 타입으로 별도 조합합니다. 이 항목을 제거하는 별도 API 변경은 이번 리팩터링의 범위가 아닙니다.

CreateRoutineDto와 UpdateRoutineDto의 `activities`는 완성된 Activity 관계와 다른 생성 항목 배열이므로 요청 DTO에 선언합니다. `each: true`는 기존 입력 정규화·중첩 검증을, `isArray: true`는 OpenAPI와 생성 SDK의 배열 타입을 지정합니다. 항목 생략, 빈 배열, 단일 항목의 배열 정규화 동작은 유지합니다.

공통 필드 메타데이터와 응답·Query 파생 방식은 [패키지 README](README.md)를 따릅니다. Entity의 관계 메타데이터를 수정할 때는 요청 Pick이 같은 필드를 소비하는지 확인하여 기존 입력의 배열·필수·null 계약을 바꾸지 않습니다. 로그인·회원가입 등 평문 비밀번호 규칙은 인증 DTO·공용 입력 스키마에 두며 Entity의 저장 해시에 적용하지 않습니다.

검증은 [entity-request-contract.spec.ts](src/__tests__/entity-request-contract.spec.ts)의 실제 `ValidationPipe` 테스트로 수행합니다. 필수값 누락, null, 잘못된 값, 명시하지 않은 필드, 빈 수정 요청과 Role 관계 입력을 검사합니다. Entity의 내부 객체 복원은 별도 hydrate 경계에서 수행하며 요청 DTO는 복원 메서드를 제공하지 않습니다.

```bash
pnpm --filter @cocrepo/dto exec vitest run src/__tests__/entity-request-contract.spec.ts
pnpm --filter @cocrepo/dto type-check
```
