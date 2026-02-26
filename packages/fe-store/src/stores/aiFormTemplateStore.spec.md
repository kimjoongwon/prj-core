# AIFormTemplateStore 기획서

## 개요

AI 폼 템플릿의 상태를 관리하는 MobX Store입니다. 템플릿 CRUD 작업과 AI 실행/미리보기 기능을 위한 상태를 관리합니다.

## 상태 (Observable)

| 상태명 | 타입 | 기본값 | 설명 |
|--------|------|--------|------|
| `templates` | `AIFormTemplate[]` | `[]` | AI 폼 템플릿 목록 |
| `currentTemplate` | `AIFormTemplate \| null` | `null` | 현재 선택된 템플릿 |
| `isLoading` | `boolean` | `false` | 로딩 상태 |
| `error` | `string \| null` | `null` | 에러 메시지 |
| `executeResult` | `AIFormExecuteResponse \| null` | `null` | AI 실행 결과 |
| `previewResult` | `AIFormPreviewResponse \| null` | `null` | AI 미리보기 결과 |

## Computed

| 이름 | 반환 타입 | 설명 |
|------|-----------|------|
| `activeTemplates` | `AIFormTemplate[]` | 활성화(ACTIVE) 상태의 템플릿만 필터링 |
| `templatesByDomain` | `Record<string, AIFormTemplate[]>` | 도메인별로 그룹화된 템플릿 |
| `currentFields` | `AIFormFieldConfig[]` | 현재 템플릿의 필드 목록 (order 기준 정렬) |
| `hasExecuteResult` | `boolean` | 실행 결과 존재 여부 |
| `hasPreviewResult` | `boolean` | 미리보기 결과 존재 여부 |

## Actions

### 상태 설정

| 액션 | 파라미터 | 설명 |
|------|----------|------|
| `setLoading(loading)` | `boolean` | 로딩 상태 설정 |
| `setError(error)` | `string \| null` | 에러 메시지 설정 |
| `setTemplates(templates)` | `AIFormTemplate[]` | 템플릿 목록 설정 (API 호출 후) |
| `setCurrentTemplate(template)` | `AIFormTemplate \| null` | 현재 템플릿 설정 |
| `setExecuteResult(result)` | `AIFormExecuteResponse \| null` | AI 실행 결과 설정 |
| `setPreviewResult(result)` | `AIFormPreviewResponse \| null` | AI 미리보기 결과 설정 |

### 템플릿 관리

| 액션 | 파라미터 | 설명 |
|------|----------|------|
| `addTemplate(template)` | `AIFormTemplate` | 템플릿 목록에 추가 |
| `updateTemplateInList(id, data)` | `string, Partial<AIFormTemplate>` | 템플릿 업데이트 |
| `removeTemplate(id)` | `string` | 템플릿 삭제 |
| `selectTemplateById(id)` | `string` | ID로 현재 템플릿 선택 |

### 조회

| 액션 | 파라미터 | 반환 타입 | 설명 |
|------|----------|-----------|------|
| `getTemplatesByDomain(domain)` | `string` | `AIFormTemplate[]` | 도메인별 템플릿 조회 |
| `getTemplatesByEntity(entity)` | `string` | `AIFormTemplate[]` | 엔티티별 템플릿 조회 |

### 초기화

| 액션 | 설명 |
|------|------|
| `clearResult()` | 실행 결과 초기화 |
| `clear()` | 모든 상태 초기화 |

## 의존성

- `@cocrepo/type`: `AIFormTemplate`, `AIFormExecuteResponse`, `AIFormPreviewResponse`
- `@cocrepo/toolkit`: `createLogger`
- `mobx`: `makeAutoObservable`
- `./rootStore`: `RootStore`

## 사용 예시

### 기본 사용법

```typescript
// 앱에서 Store 생성
const rootStore = new RootStore();
rootStore.aiFormTemplateStore = new AIFormTemplateStore(rootStore);

// React Query와 함께 사용
const { data: templates } = useGetAIFormTemplates();

useEffect(() => {
  if (templates) {
    rootStore.aiFormTemplateStore.setTemplates(templates);
  }
}, [templates]);

// 템플릿 선택
aiFormTemplateStore.selectTemplateById("template-123");

// AI 실행 결과 설정
aiFormTemplateStore.setExecuteResult(executeResponse);
```

### 컴포넌트에서 사용

```typescript
import { observer } from "mobx-react-lite";
import { useAIFormTemplateStore } from "@cocrepo/store";

export const TemplateList = observer(() => {
  const store = useAIFormTemplateStore();

  return (
    <div>
      {store.isLoading ? (
        <Spinner />
      ) : (
        store.activeTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onClick={() => store.selectTemplateById(template.id)}
          />
        ))
      )}
    </div>
  );
});
```

## 주의사항

1. **API 호출은 외부에서 수행**: Store는 상태 관리만 담당하며, API 호출은 React Query 등을 통해 외부에서 수행 후 결과를 Store에 전달합니다.

2. **RootStore 주입**: 다른 Store와의 상호작용이 필요한 경우 `rootStore`를 통해 접근합니다.

3. **Observer 필수**: 컴포넌트에서 사용 시 반드시 `observer`로 감싸야 합니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-26 | 초기 생성 | fe-store-builder |
