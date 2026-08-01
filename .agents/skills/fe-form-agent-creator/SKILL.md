---
name: "fe-form-agent-creator"
description: "이 skill은 `fe-form-agent` 역할로 일할 때 사용합니다. 생성/수정 form 조합을 만드는 방법을 쉽게 안내합니다."
---

# fe-form-agent-creator

`fe-form-agent`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/39-fe-form-agent.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 플랫폼 라우팅

- 이 역할은 웹 전용 agent입니다.
- `packages/fe-mo-ui/**`, `apps/mobile/**`, Expo Router, `heroui-native`, React Native 런타임 작업은 이 역할의 실행 범위가 아닙니다.

## 공통

### 공통 실행 규칙

- 먼저 `플랫폼 라우팅`으로 현재 대상이 React Web, React Native, Shared 중 어디에 속하는지 확정합니다.
- 승인된 서비스 딜리버리 스펙과 생성된 라우트 딜리버리 스펙의 해당 플랫폼 섹션의 허용 파일/책임 범위 안에서만 작업합니다.
- 소스 담당자가 다른 파일이나 다른 플랫폼 대상이 필요하면 직접 확장하지 말고 최종 보고에 인계 필요성을 요약합니다.
- Storybook 스토리는 `fe-storybook-agent`의 독립 소유물입니다. Form agent는 단위 테스트와 Form 공개 계약만 맡고, Storybook agent는 승인된 spec과 그 계약을 소비합니다. 두 agent는 직접 호출하거나 상태를 공유하지 않습니다.

## 웹 규칙

### 웹 런타임 기준 (필수)

- 이 섹션은 `packages/fe-ui/**`, `apps/*/web/**`, Next.js App Router `page.tsx`/`layout.tsx`/`route.meta.ts` 대상에만 적용합니다.
- 웹 작업은 `@heroui/react` 원본 라이브러리 source와 `@cocrepo/ui` export를 먼저 확인하고, DOM/CSS/Tailwind/HeroUI React 계약을 기준으로 판단합니다.
- Next.js server/client component 경계, SSR, hydration, browser DOM API, React Aria/HeroUI React id 안정성 규칙은 React Web 대상에서만 적용합니다.
- 모바일 대상에서는 이 섹션의 DOM event, browser API, SSR/hydration, `@heroui/react`, `@cocrepo/ui` 규칙을 실행 규칙으로 적용하지 않습니다.

### 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- form/input 후보는 `@cocrepo/ui` export만 보지 말고 원본 라이브러리 `node_modules/@heroui/react/package.json` exports와 `node_modules/@heroui/react/dist/components/**` source까지 확인합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 기존 form/input 또는 `@heroui/react` input/control로 표현 가능한 UI를 Form 안에서 raw `input`/`select`/`textarea`/`button` + className 조합으로 재구현하지 않습니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.

### FE form 역할

생성/수정 입력 화면이 재사용하는 form 계층을 `packages/fe-ui/src/form`에 생성/정리하는 전용 에이전트입니다.

### 역할

- Create/Edit 페이지의 표준 form 재사용 계층
- 입력 필드 조합, 유효성 메시지, 상태 기반 안내
- page가 아닌 `form` 소유의 재사용 입력 UI

### 요청 모드

- 요청에는 반드시 `mode: create` 또는 `mode: review`가 포함되어야 합니다. 없으면 작업을 시작하지 않고 모드와 대상 계약을 요청합니다.
- `mode: create`는 승인된 spec에 있는 도메인 소유 모델과 변경 계약을 구현합니다. Form, 단위 테스트, 허용된 barrel만 변경합니다.
- `mode: review`는 소스 변경 금지 검토입니다. 구현 파일을 고치지 않고 아래 항목을 표로 보고합니다.
  - Form 이름과 소유 모델
  - 각 필드의 출처(소유 모델의 직접 필드, 관계 모델의 직접 필드, 시스템/읽기 전용 필드)
  - 변경 Command DTO와의 일치 여부
  - 다른 모델 필드가 섞인 경계 위반과 분리해야 할 Form
  - 필요한 `mode: create` 후속 작업
- 리뷰에서 발견한 문제의 수정은 반드시 별도 `mode: create` 요청으로 처리합니다.

### 분류 규칙

- 생성/등록/수정/입력 중심 화면이면 기본 목적지는 `form`
- `AiForm`은 상단 보조 feature로 유지하고, 실제 폼 본문 소유는 `form`
- 기존 도메인 폴더(`widget/user` 등)에 흩어진 폼 위젯이 있으면 `form`으로 통합

### 도메인 Form 구조화 규칙

- Form 이름은 화면 이름이나 조회 DTO가 아니라, 입력값을 직접 소유하는 도메인 모델 이름을 기준으로 정합니다. 예: `Profile`의 필드는 `ProfileForm`, `Tenant`의 필드는 `TenantForm`이 소유합니다. 하나의 모델에는 하나의 Form 이름만 사용합니다.
- 한 Form에는 소유 모델의 직접 수정 필드만 둡니다. 연관 모델의 필드, 응답 객체에 중첩된 필드, 조인 편의를 위한 값은 넣지 않습니다.
- Root 모델이 참조하는 하위/조인 모델을 사용자가 수정해야 하면 해당 모델의 별도 Form을 만듭니다. 참조 관계만 있고 수정 요구가 없으면 Form을 만들지 않고 읽기 전용 표시로 둡니다.
- 생성/수정 화면이 여러 모델을 함께 다뤄야 하면 화면 목적 이름의 조합 Form(예: `UserCreateForm`)이 각 모델 Form을 조합합니다. 조합 Form이 하위 모델 필드를 평면화하거나 소유권을 빼앗으면 안 됩니다.
- 필드의 최종 포함 여부와 required/optional 규칙은 해당 변경 Command DTO가 단일 기준입니다. Prisma schema는 소유 경계와 후보 필드를 확인하는 근거이며, 상세 조회 DTO는 입력 계약 근거가 아닙니다.
- 식별자, 생성/수정 시각, 감사/로그인 이력, 내부 조인 키는 Form 입력 필드가 아닙니다. 관계의 소유자 ID처럼 route가 이미 알고 있는 문맥값도 사용자가 다시 입력하지 않습니다.
- 비밀번호, 잠금 해제, 활성 상태처럼 보안 또는 상태 전이가 필요한 User 직접 필드는 다른 모델 Form으로 분리하지 않습니다. `UserForm`이 해당 User Command의 mode/variant에 따라 필요한 직접 필드만 노출하고, 실제 실행은 전용 Command 또는 확인 액션으로 분리합니다.

#### User 도메인 적용 예시

| 소유 모델 | Form | 직접 입력 후보 | 화면 조합 시 역할 |
|---|---|---|---|
| `User` | `UserForm` | `name`, `email`, `phone` | 기본 계정 정보 |
| `User` | `UserForm` | `password` | 등록 또는 비밀번호 재설정 mode |
| `Profile` | `ProfileForm` | `name`, `nickname`, `address`, `avatarFileId` | 프로필 정보 |
| `Tenant` | `TenantForm` | `spaceId`, `roleId` | Space별 멤버십 |
| `UserClassification` | `UserClassificationForm` | `categoryId` | 회원 분류 |
| `UserAssociation` | `UserAssociationForm` | `groupId` 또는 그룹 집합 | 회원 그룹 |

- 같은 모델의 서로 다른 Command는 별도 Form 이름을 만들지 않습니다. 예를 들어 User 등록, 기본 정보 수정, 비밀번호 재설정은 모두 `UserForm`의 명시적 mode/variant로 구분합니다.
- `UserCreateForm` 또는 `UserEditForm`은 여러 모델을 함께 변경해야 할 때만 위 Form들을 필요한 Command 단위로 조합할 수 있습니다. 다만 `UserForm`에 `Profile`, `Tenant`, 분류, 그룹의 입력 필드를 직접 넣지 않습니다.

### 출력

- 메인 컴포넌트: `packages/fe-ui/src/form/<Name>/<Name>.tsx`
- 대응 spec: route `page.spec.md` 또는 관련 fe-ui Feature spec의 Form 계약 섹션
- barrel: `packages/fe-ui/src/form/index.ts`
- 필요 시 `packages/fe-ui/src/index.ts`와 허용 담당 스펙을 함께 갱신

### 필수 규칙

- Form은 API 호출, 라우터 이동, 화면 배치, 저장 이벤트를 알지 못하며 입력 UI 조합만 책임집니다. 이 동작들은 Form 밖의 소비자가 소유합니다.
- form은 반드시 `packages/fe-ui/src/input`의 leaf primitive만 사용합니다.
  - raw HeroUI `Input`, `Button`, `Checkbox`, `Link` 등을 form 안에서 직접 사용하는 패턴은 금지합니다.
- 필요한 leaf primitive가 해당 계층에 없으면 form을 계속 만들지 말고,
  먼저 `fe-input-agent` owner 규칙에 따라 생성/정리합니다.
- Form은 field 상태를 내부에서 선언하거나 그 상태의 출처를 결정하지 않습니다.
  - 금지 예: `useState`, `useReducer`, `useLocalObservable`로 form 입력값을 직접 소유
- 허용: 외부 소비자가 props로 주입한 `state` 범위를 leaf primitive에 전달
- Form이 받는 `state`는 Form이 표시할 필드 범위만 의미합니다.
- 예: `loginForm`, `forgotPasswordForm`, `resetPasswordForm`
- Form은 `state`를 누가 만들고 보관하는지, 어떤 route나 screen이 소비하는지 알거나 결정하지 않습니다.
- form은 submit/cancel/click 같은 이벤트 handler props를 직접 받지 않습니다.
  - 금지 예: `onSubmitForm`, `onClickCancelButton`, `onAbortInteraction`
  - 허용: `type="submit"`, `data-action="abort-interaction"` 같은 semantic signal
- 실제 이벤트 연결은 page 또는 feature가 form 바깥 wrapper에서 소유합니다.
  - pure screen/feature는 `onSubmit`, `onSubmitCapture`, `onClickCapture` 등으로 native event를 연결할 수 있습니다.
- 코드 수정 시 대응 담당 스펙을 함께 갱신합니다.


- Form component를 신규 생성하거나 수정하면 단위 테스트를 작성/갱신하고, Storybook 스토리는 `fe-storybook-agent`에 인계합니다.
- 단위 테스트는 field rendering, validation message, disabled/readOnly/hidden priority, submit signal을 검증합니다.
