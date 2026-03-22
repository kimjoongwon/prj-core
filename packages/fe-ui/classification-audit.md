# `fe-ui` 분류 감사 리포트

기준일: 2026-03-22  
대상: `packages/fe-ui/index.ts`, `packages/fe-ui/src/**`, `.codex/config.toml`, `.codex/agents/fe-*.toml`

## 요약

- `src/components/**`는 에이전트 체계 밖에서 생긴 잔여 트리로 보이며, 현재 전부 빈 디렉터리다.
- `feature/master`, `feature/detail/view`, `widget/form` 전용 축이 이미 생겼는데도, 그 바깥 루트나 도메인 폴더에 남아 있는 컴포넌트가 있다.
- 확정 위반/잔재 6건, 강한 재분류 후보 10건, 예외 또는 보류 6건으로 정리했다.
- 이 리포트는 "실제 수정"이 아니라 "현재 분류가 규칙과 맞는지"를 판정해 나열한 문서다.

## 판정 기준

- 루트 공개 계약은 `src`와 `src/design-system`을 외부에 공개한다. [index.spec.md:9-16](./index.spec.md)
- 현재 `src` 공개 축은 `feature`, `input`, `layout`, `page`, `primitive`, `surface`, `widget`이다. [src/index.ts:1-7](./src/index.ts)
- `master` 성격은 `packages/fe-ui/src/feature/master` 아래에 둔다.
  - `MetaDataGrid`는 기본 목적지가 `feature/master/table`
  - 검색/필터/페이지네이션/컬렉션 탐색 중심은 `master`
  - 기존 `feature/MetaDataGrid`는 `feature/master/table` 엔트리로 승격
  - 근거: [fe-master-builder.toml:14-33](../../.codex/agents/fe-master-builder.toml)
- `detail` 성격은 `packages/fe-ui/src/feature/detail/view` 아래에 둔다.
  - 조회 중심, 읽기 전용, inspector, detail slot 본문이면 `feature/detail/view`
  - 입력/수정 흐름이 섞이면 `widget/form` 대상
  - 근거: [fe-detail-builder.toml:14-32](../../.codex/agents/fe-detail-builder.toml)
- `form` 성격은 `packages/fe-ui/src/widget/form` 아래에 둔다.
  - 생성/등록/수정/입력 중심 화면은 기본적으로 `widget/form`
  - 도메인 폴더(`widget/user` 등)에 흩어진 form 위젯은 `widget/form`으로 통합
  - 근거: [fe-form-widget-builder.toml:14-32](../../.codex/agents/fe-form-widget-builder.toml)
- `page` 역할은 앱 라우트 콘텐츠가 우선이며, 재사용 target은 `feature/master/*`, `feature/detail/view`, `widget/form` 중 하나로 강제된다. [fe-page-builder.toml:48-77](../../.codex/agents/fe-page-builder.toml)

## 1. 확정 위반 또는 확정 잔재

| 현재 경로 | 현재 분류 | 기대 분류/조치 | 근거 | 신뢰도 |
| --- | --- | --- | --- | --- |
| `src/components/**` | 비공식 평행 트리 | 전체 제거 | 루트 spec과 widget spec 변경 이력이 모두 `src/components` 제거를 명시하고, 현재 하위 디렉터리 전부가 비어 있다. [index.spec.md:26-29](./index.spec.md), [src/widget/index.spec.md:32-37](./src/widget/index.spec.md) | 높음 |
| `src/feature/MetaDataGrid/` | 루트 feature | `src/feature/master/table/` 공개 엔트리로 승격 | `MetaDataGrid`는 기본 목적지가 `feature/master/table`이며, 기존 `feature/MetaDataGrid`는 그 엔트리로 승격하라고 규칙이 직접 명시한다. [fe-master-builder.toml:18-27](../../.codex/agents/fe-master-builder.toml) | 높음 |
| `src/feature/ReservationList/` | 루트 feature | `src/feature/master/list/` | 스펙이 "예약 목록 조회", 필터, 페이지네이션, 테이블 표시를 직접 설명한다. `master` 규칙과 정면으로 일치한다. [ReservationList/index.spec.md:8-11](./src/feature/ReservationList/index.spec.md), [ReservationList/index.spec.md:45-59](./src/feature/ReservationList/index.spec.md), [fe-master-builder.toml:18-25](../../.codex/agents/fe-master-builder.toml) | 높음 |
| `src/feature/ReservationDetail/` | 루트 feature | `src/feature/detail/view/` | 스펙이 단일 예약 상세 조회와 detail 카드/액션을 설명한다. detail 규칙과 정면으로 일치한다. [ReservationDetail/index.spec.md:8-10](./src/feature/ReservationDetail/index.spec.md), [ReservationDetail/index.spec.md:47-65](./src/feature/ReservationDetail/index.spec.md), [fe-detail-builder.toml:18-26](../../.codex/agents/fe-detail-builder.toml) | 높음 |
| `src/widget/Section/` | widget 잔여 디렉터리 | 제거 | widget 배럴 spec이 "섹션 래퍼는 widget이 아니라 surface/SectionSurface에서 관리"라고 적고, 해당 디렉터리는 현재 빈 폴더다. [src/widget/index.spec.md:13-16](./src/widget/index.spec.md) | 높음 |
| `src/widget/user/UserFormWidget/` | 도메인 하위 잔여 디렉터리 | 제거 | `UserFormWidget` 소유가 이미 `widget/form`으로 이동했다고 spec이 직접 기록하고 있고, 현재 `widget/user/UserFormWidget`는 빈 폴더다. [src/widget/form/index.spec.md:68-70](./src/widget/form/index.spec.md) | 높음 |

## 2. 강한 재분류 후보

| 현재 경로 | 현재 분류 | 제안 분류 | 근거 | 신뢰도 |
| --- | --- | --- | --- | --- |
| `src/feature/InquiryForm/` | feature | `src/widget/form/InquiryForm/` | 구현이 입력 UI 조합, 로컬 폼 상태, 유효성 검사, 제출 콜백 중심이다. Store/API/라우팅보다 폼 본문 위젯 책임에 가깝다. [InquiryForm.tsx:51-73](./src/feature/InquiryForm/InquiryForm.tsx), [InquiryForm.tsx:126-195](./src/feature/InquiryForm/InquiryForm.tsx), [fe-form-widget-builder.toml:18-26](../../.codex/agents/fe-form-widget-builder.toml) | 높음 |
| `src/feature/InquiryReplyForm/` | feature | `src/widget/form/InquiryReplyForm/` | 답변 입력, 첨부, draft 제출 UI를 props 기반으로 조합한다. Store/API 연결보다 입력 위젯 책임이 더 강하다. [InquiryReplyForm.tsx:21-47](./src/feature/InquiryReplyForm/InquiryReplyForm.tsx), [InquiryReplyForm.tsx:83-161](./src/feature/InquiryReplyForm/InquiryReplyForm.tsx), [fe-form-widget-builder.toml:18-26](../../.codex/agents/fe-form-widget-builder.toml) | 높음 |
| `src/widget/PromptForm/` | widget | `src/widget/form/PromptForm/` | 이름과 구현 모두 form 성격이며, prompt/negative prompt 입력과 submit만 담당한다. [PromptForm.tsx:8-44](./src/widget/PromptForm/PromptForm.tsx), [PromptForm.tsx:92-156](./src/widget/PromptForm/PromptForm.tsx) | 높음 |
| `src/widget/VariableInputForm/` | widget | `src/widget/form/VariableInputForm/` | 템플릿 변수 목록을 입력 필드 집합으로 렌더링하는 전형적인 form body다. [VariableInputForm.tsx:7-14](./src/widget/VariableInputForm/VariableInputForm.tsx), [VariableInputForm.tsx:16-18](./src/widget/VariableInputForm/VariableInputForm.tsx), [VariableInputForm.tsx:51-73](./src/widget/VariableInputForm/VariableInputForm.tsx) | 높음 |
| `src/widget/VariableEditTable/` | widget | `src/widget/form/VariableEditTable/` | 등록/수정 폼에서 변수 행을 인라인 편집하는 테이블이며, 입력/검증 중심이다. [VariableEditTable.tsx:33-41](./src/widget/VariableEditTable/VariableEditTable.tsx), [VariableEditTable.tsx:68-72](./src/widget/VariableEditTable/VariableEditTable.tsx), [VariableEditTable.tsx:163-220](./src/widget/VariableEditTable/VariableEditTable.tsx) | 높음 |
| `src/widget/RedirectUriListInput/` | widget | `src/input/RedirectUriListInput/` | 동적 추가/삭제가 있더라도 단일 form field 역할을 하는 입력 컴포넌트다. 이름도 `Input`이고 API/Store 없이 value/onChange만 다룬다. [RedirectUriListInput.tsx:7-15](./src/widget/RedirectUriListInput/RedirectUriListInput.tsx), [RedirectUriListInput.tsx:18-21](./src/widget/RedirectUriListInput/RedirectUriListInput.tsx), [RedirectUriListInput.tsx:42-80](./src/widget/RedirectUriListInput/RedirectUriListInput.tsx), [fe-input-component-builder.toml:12-18](../../.codex/agents/fe-input-component-builder.toml) | 높음 |
| `src/widget/ability/AbilityFormModal/` | 도메인 widget | `src/widget/form/AbilityFormModal/` | 이름이 modal이지만 실질적으로 form 성격이다. 도메인 폴더에 흩어진 form 위젯을 `widget/form`으로 통합하라는 규칙과 충돌한다. [fe-form-widget-builder.toml:24-27](../../.codex/agents/fe-form-widget-builder.toml) | 중간 |
| `src/widget/category/CategoryFormSection/` | 도메인 widget | `src/widget/form/CategoryFormSection/` | 이름 자체가 form section이며, 도메인 폴더에 있는 form 위젯 통합 규칙에 걸린다. [fe-form-widget-builder.toml:24-27](../../.codex/agents/fe-form-widget-builder.toml) | 중간 |
| `src/widget/group/GroupFormSection/` | 도메인 widget | `src/widget/form/GroupFormSection/` | 위와 동일한 유형의 도메인 하위 form section이다. [fe-form-widget-builder.toml:24-27](../../.codex/agents/fe-form-widget-builder.toml) | 중간 |
| `src/widget/role/RoleFormModal/` | 도메인 widget | `src/widget/form/RoleFormModal/` | 위와 동일한 유형의 도메인 하위 form modal이다. [fe-form-widget-builder.toml:24-27](../../.codex/agents/fe-form-widget-builder.toml) | 중간 |

## 3. 예외 또는 보류

| 경로/축 | 판정 | 이유 |
| --- | --- | --- |
| `src/surface/**` | 예외 | `surface`는 `master/detail/page` 계층과 협업하는 공식 축이다. `Surface`, `PageSurface`, `SectionSurface`는 별도 규칙과 spec이 있다. [fe-master-builder.toml:27-27](../../.codex/agents/fe-master-builder.toml), [fe-detail-builder.toml:26-26](../../.codex/agents/fe-detail-builder.toml) |
| `src/widget-heavy/**` | 예외 | `widget-heavy`는 package export와 widget spec에 직접 등록된 공식 서브패스다. [package.json:11-25](./package.json), [src/widget/index.spec.md:15-16](./src/widget/index.spec.md) |
| `src/design-system/**` | 예외 | 루트 공개 계약에서 `src/design-system`을 별도로 공개하고 있다. [index.spec.md:13-16](./index.spec.md) |
| `src/primitive/layout/**` | 예외 | `primitive/layout`은 `Layout.tsx`와 공용 타입 계약만 두는 flat primitive 축이다. [fe-primitive-component-builder.toml:457-472](../../.codex/agents/fe-primitive-component-builder.toml) |
| `src/page/**` | 보류 | `fe-page-builder`는 앱 라우트 page를 기본으로 보지만, `orch-stage.toml`은 `packages/fe-ui/src/page/MemberListPage/` 생성 예시도 가진다. 현재 규칙이 완전히 단일하지 않다. [fe-page-builder.toml:48-53](../../.codex/agents/fe-page-builder.toml), [orch-stage.toml:872-878](../../.codex/agents/orch-stage.toml) |
| `src/style/**`, `src/type/**` | 보류 | 컴포넌트 계층이라기보다 패키지 인프라 축에 가깝다. 현재 에이전트 규칙상 적극 소유하진 않지만, 즉시 오분류로 단정할 근거도 부족하다. |

## 4. 빈 디렉터리 원본 목록

현재 빈 디렉터리로 남아 있는 경로는 아래와 같다.

```text
src/components/feature/InquiryDataGrid
src/components/feature/asset/AssetList
src/components/feature/file/FileList
src/components/inputs/AssetPickerInput
src/components/ui/AssetCard
src/components/ui/AssetGrid
src/components/ui/AssetList
src/components/ui/AssetThumbnail
src/components/ui/AssetTypeIcon
src/components/ui/FolderBreadcrumb
src/components/ui/data-display/FileTypeBadge
src/components/ui/data-display/cells/AITemplateStatusCell
src/components/ui/feedback/AmbientOrbs
src/components/ui/layouts/WorkspaceShell
src/components/widget/asset/AssetTable
src/components/widget/file/FileTable
src/components/widgets/Asset
src/components/widgets/Folder
src/widget/Section
src/widget/user/UserFormWidget
```

## 5. 정리

- 지금 가장 명확한 문제는 `src/components/**` 잔재와 `master/detail/form` 전용 축이 생긴 뒤에도 루트나 도메인 폴더에 남아 있는 컴포넌트들이다.
- 우선순위만 잡으면 다음 순서가 맞다.
  - 1순위: `src/components/**`, `src/widget/Section`, `src/widget/user/UserFormWidget` 제거
  - 2순위: `feature/MetaDataGrid`, `feature/ReservationList`, `feature/ReservationDetail` 공개 엔트리 재정렬
  - 3순위: `Inquiry*Form`, `PromptForm`, `Variable*`, 도메인 하위 `*Form*`를 `widget/form` 또는 `input`으로 재배치
