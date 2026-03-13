# Templates Service 기획서

> 생성일: 2026-02-19
> 수정일: 2026-02-19
> 타입: service
> 위치: packages/be-service/src/template.service/index.ts

## 역할

메시지 템플릿(EMAIL, SMS, PUSH)을 관리합니다.
템플릿 코드 중복 검사, 유형별 필드 제약 검증, 변수 치환, 미리보기, 테스트 발송 기능을 제공합니다.
`{{변수명}}` 형식의 변수를 치환하여 동적 메시지를 생성합니다.

## 의존성

| 의존 서비스/리포지토리 | 역할 |
|-----------------------|------|
| `TemplatesRepository` | 템플릿 CRUD |

## 메서드

| 메서드 | 파라미터 | 반환 | 설명 |
|--------|----------|------|------|
| `getTemplates` | `query: QueryTemplateDto` | `Promise<{data, totalCount}>` | 템플릿 목록 조회 |
| `getTemplateById` | `id: string` | `Promise<Template>` | ID로 템플릿 조회 (variables 포함) |
| `create` | `dto: CreateTemplateDto` | `Promise<Template>` | 템플릿 생성 (변수 포함) |
| `update` | `id: string, dto: UpdateTemplateDto` | `Promise<Template>` | 템플릿 수정 (변수 전체 교체) |
| `remove` | `id: string` | `Promise<Template>` | 템플릿 소프트 삭제 |
| `toggleStatus` | `id: string` | `Promise<Template>` | 활성/비활성 상태 토글 |
| `preview` | `id: string, dto: PreviewTemplateDto` | `Promise<{type, subject, content, unresolvedVariables}>` | 템플릿 미리보기 |
| `sendTest` | `id: string, dto: SendTestTemplateDto` | `Promise<SendTestResult>` | 테스트 발송 |

## 비즈니스 규칙

### 유형별 제약

| 유형 | subject 필수 | subject 최대 길이 | content 최대 길이 |
|------|------------|------------------|------------------|
| EMAIL | O | 무제한 | 무제한 |
| SMS | X | - | 무제한 |
| PUSH | O | 50자 | 200자 |

### 변수 치환 순서

1. 입력된 변수로 `{{key}}` 치환
2. 기본값이 있는 미치환 변수를 기본값으로 치환
3. 남은 `{{...}}` 패턴을 `unresolvedVariables`로 반환

### 코드 unique

- 템플릿 코드(code)는 전역 unique

### 변수 업데이트

- 수정 시 variables 포함 시 기존 변수 전체 교체

### 테스트 발송 조건

- 비활성 템플릿 차단
- 필수 변수 모두 입력 필요 (기본값 없는 경우)
- 수신자 형식 검증 (EMAIL: 이메일, SMS: 전화번호)

## 에러 처리

| 에러 상황 | 에러 타입 | 메시지 |
|----------|-----------|--------|
| 템플릿 없음 | `NotFoundException` | "템플릿을 찾을 수 없습니다" |
| 코드 중복 | `ConflictException` | "이미 존재하는 템플릿 코드입니다: {code}" |
| EMAIL/PUSH subject 누락 | `BadRequestException` | "{type} 유형 템플릿은 제목(subject)이 필수입니다" |
| PUSH subject 50자 초과 | `BadRequestException` | "PUSH 템플릿의 제목은 50자를 초과할 수 없습니다" |
| PUSH content 200자 초과 | `BadRequestException` | "PUSH 템플릿의 본문은 200자를 초과할 수 없습니다" |
| 비활성 템플릿 테스트 발송 | `BadRequestException` | "비활성 템플릿은 테스트 발송할 수 없습니다" |
| 필수 변수 누락 | `BadRequestException` | "필수 변수가 누락되었습니다: {변수명}" |
| 이메일 형식 오류 | `BadRequestException` | "올바른 이메일 주소를 입력해주세요" |
| 전화번호 형식 오류 | `BadRequestException` | "올바른 전화번호를 입력해주세요" |

## 권한 요구사항

- Controller 레이어에서 Guard를 통해 권한 처리

## 구현 체크리스트

- [x] template.service.ts
- [x] `@Injectable()` 데코레이터
- [x] 모듈 등록
- [ ] 실제 발송 서비스 연동 (TODO)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-19 | 초기 생성 (역기획) | req-reverse-engineer |
| 2026-03-13 | `template.service.ts`와 sidecar spec을 폴더형 `index.ts`/`index.spec.md` 구조로 재배치 | codex |
