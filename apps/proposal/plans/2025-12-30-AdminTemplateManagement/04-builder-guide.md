# 빌더 전달 내용

## 1. 페이지 빌더 전달 내용

### AdminTemplateManagementPage

**기능:**
- 템플릿 타입별 탭 (EMAIL, SMS, PUSH, HTML)
- 템플릿 목록 조회 및 표시
- 템플릿 선택 시 상세 조회
- 템플릿 생성/수정/삭제
- 미리보기 기능
- 테스트 발송 기능

**필요한 상태:**
- selectedTab: TemplateType
- templates: Template[]
- selectedTemplateId: string | null
- selectedTemplate: Template | null
- isEditing: boolean
- previewHtml: string
- isLoading: boolean
- isSaving: boolean

**필요한 핸들러:**
- onChangeTab(type: TemplateType): 탭 변경
- onSelectTemplate(templateId: string): 템플릿 선택
- onCreateTemplate(): 새 템플릿 생성
- onChangeTemplate(field: string, value: any): 템플릿 수정
- onPreview(): 미리보기
- onTestSend(recipient: string, variables: Record<string, any>): 테스트 발송
- onSaveTemplate(): 저장
- onDeleteTemplate(templateId: string): 삭제

**페이지 경로:** /admin/templates/:type (email, sms, push, html)

**레이아웃:** AdminLayout 사용

---

## 2. 백엔드 빌더 전달 내용

### 템플릿 관리 API

**엔드포인트 목록:**

#### 1. GET /api/v1/admin/templates
- Query: `type` (EMAIL|SMS|PUSH|HTML), `page`, `limit`
- 템플릿 목록 조회

#### 2. GET /api/v1/admin/templates/:id
- 템플릿 상세 조회

#### 3. POST /api/v1/admin/templates
- Body: `name`, `type`, `key`, `subject`, `content`, `variables`
- 템플릿 생성

#### 4. PUT /api/v1/admin/templates/:id
- Body: `name`, `subject`, `content`, `isActive`
- 템플릿 수정

#### 5. DELETE /api/v1/admin/templates/:id
- 템플릿 삭제 (soft delete)

#### 6. POST /api/v1/admin/templates/:id/preview
- Body: `variables` (Record<string, any>)
- 템플릿 미리보기 렌더링

#### 7. POST /api/v1/admin/templates/:id/test
- Body: `recipient`, `variables`
- 테스트 발송

**비즈니스 로직:**
- 템플릿 key는 고유값 (unique constraint)
- 템플릿 변수는 JSON 배열로 저장
- 미리보기: Handlebars 또는 EJS로 변수 치환
- 테스트 발송: 실제 이메일/SMS/푸시 발송 (테스트 모드)

**에러 처리:**
- 401: 인증 실패
- 403: 권한 없음
- 404: 템플릿 없음
- 409: 중복된 key
- 500: 서버 에러
