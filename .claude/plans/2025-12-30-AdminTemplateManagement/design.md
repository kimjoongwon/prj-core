# 기술 설계서

## 1. Entity 상세 설계

### 1.1 새로운 Entity

#### Template

**파일 경로:** `packages/prisma/prisma/schema/template.prisma`

**필드 상세:**

| 필드 | 타입 | 설명 | 제약조건 |
|------|------|------|----------|
| id | String | PK, UUID | @id @default(uuid()) |
| seq | Int | 시퀀스 | @unique @default(autoincrement()) |
| name | String | 템플릿 이름 | @db.VarChar(100) |
| type | TemplateType | 템플릿 타입 | Enum |
| key | String | 시스템 키 | @db.VarChar(100) |
| subject | String? | 제목 (이메일/푸시) | @db.VarChar(200) |
| content | String | 템플릿 내용 | @db.Text |
| variables | String[] | 사용 가능한 변수 목록 | @db.VarChar(50)[] |
| isActive | Boolean | 활성화 여부 | @default(true) |
| spaceId | String | Space FK | |
| createdAt | DateTime | 생성일 | @default(now()) |
| updatedAt | DateTime | 수정일 | @updatedAt |
| deletedAt | DateTime? | 삭제일 (soft delete) | |

**Prisma 스키마:**

```prisma
enum TemplateType {
  EMAIL
  SMS
  PUSH
  HTML
}

model Template {
  id        String       @id @default(uuid())
  seq       Int          @unique @default(autoincrement())
  name      String       @db.VarChar(100)
  type      TemplateType
  key       String       @db.VarChar(100)
  subject   String?      @db.VarChar(200)
  content   String       @db.Text
  variables String[]     @db.VarChar(50)
  isActive  Boolean      @default(true)
  spaceId   String
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  deletedAt DateTime?

  space Space @relation(fields: [spaceId], references: [id])

  @@unique([key, spaceId])
  @@index([type])
  @@index([spaceId])
  @@index([isActive])
  @@map("templates")
}
```

**인덱스 설계:**

| 인덱스명 | 필드 | 용도 |
|----------|------|------|
| @@unique | key, spaceId | 동일 Space 내 key 중복 방지 |
| idx_template_type | type | 타입별 조회 성능 최적화 |
| idx_template_spaceId | spaceId | Space별 조회 성능 최적화 |
| idx_template_isActive | isActive | 활성 템플릿 조회 최적화 |

**관계:**

```
Space 1 ---- N Template
         \---- FK: spaceId
```

#### TemplateHistory (선택적, 향후 구현)

버전 관리를 위한 이력 테이블

```prisma
model TemplateHistory {
  id         String       @id @default(uuid())
  templateId String
  version    Int
  name       String       @db.VarChar(100)
  subject    String?      @db.VarChar(200)
  content    String       @db.Text
  variables  String[]     @db.VarChar(50)
  changedBy  String       // 수정한 관리자 ID
  createdAt  DateTime     @default(now())

  template Template @relation(fields: [templateId], references: [id])

  @@index([templateId])
  @@map("template_histories")
}
```

### 1.2 기존 Entity 수정

**Space 수정사항:**

```prisma
model Space {
  // 기존 필드...

  // 추가할 관계
  templates Template[]  // 추가
}
```

---

## 2. Repository 레이어 설계

**파일:** `packages/repository/src/template.repository.ts`

**메서드 명세:**

| 메서드명 | 파라미터 | 반환타입 | 설명 |
|----------|----------|----------|------|
| findManyByTypeAndSpace | type: TemplateType, spaceId: string, pagination: { skip, take } | { items: Template[]; count: number } | 타입 및 Space별 목록 조회 |
| findByKeyAndSpace | key: string, spaceId: string | Template \| null | key와 spaceId로 조회 (실제 사용 시) |
| findById | id: string | Template \| null | ID로 조회 |
| findActiveById | id: string | Template \| null | 활성화된 템플릿 조회 |
| create | data: Prisma.TemplateCreateInput | Template | 생성 |
| updateById | id: string, data: Prisma.TemplateUpdateInput | Template | 수정 |
| softRemoveById | id: string | Template | 소프트 삭제 (deletedAt 설정) |
| countByTypeAndSpace | type: TemplateType, spaceId: string | number | 개수 조회 |

**구현 예시:**

```typescript
async findManyByTypeAndSpace(
  type: TemplateType,
  spaceId: string,
  pagination: { skip: number; take: number }
): Promise<{ items: Template[]; count: number }> {
  const where = {
    type,
    spaceId,
    deletedAt: null,
  };

  const [items, count] = await this.prisma.$transaction([
    this.prisma.template.findMany({
      where,
      skip: pagination.skip,
      take: pagination.take,
      orderBy: { createdAt: 'desc' },
    }),
    this.prisma.template.count({ where }),
  ]);

  return { items, count };
}

async findByKeyAndSpace(
  key: string,
  spaceId: string
): Promise<Template | null> {
  return this.prisma.template.findUnique({
    where: {
      key_spaceId: {
        key,
        spaceId,
      },
      deletedAt: null,
    },
  });
}
```

---

## 3. Service 레이어 설계

**파일:** `packages/service/src/service/template.service.ts`

**비즈니스 로직:**

| 메서드명 | 책임 | 호출하는 Repository 메서드 |
|----------|------|---------------------------|
| getTemplatesByType | 타입별 템플릿 목록 조회 | findManyByTypeAndSpace, countByTypeAndSpace |
| getTemplateById | 템플릿 상세 조회 | findById |
| getTemplateByKey | key로 템플릿 조회 (실제 사용 시) | findByKeyAndSpace |
| createTemplate | 템플릿 생성 (중복 key 검증) | findByKeyAndSpace, create |
| updateTemplate | 템플릿 수정 (History 저장, 선택적) | findById, updateById |
| deleteTemplate | 템플릿 삭제 | softRemoveById |
| renderTemplate | Handlebars로 템플릿 렌더링 | findById |
| sendTestTemplate | 테스트 발송 (이메일/SMS/푸시) | findById, renderTemplate |

**구현 예시:**

```typescript
async renderTemplate(
  templateId: string,
  variables: Record<string, any>
): Promise<string> {
  const template = await this.templateRepository.findActiveById(templateId);
  if (!template) {
    throw new NotFoundException('템플릿을 찾을 수 없습니다');
  }

  // Handlebars 컴파일
  const compiled = Handlebars.compile(template.content);
  return compiled(variables);
}

async sendTestTemplate(
  templateId: string,
  recipient: string,
  variables: Record<string, any>
): Promise<void> {
  const template = await this.templateRepository.findActiveById(templateId);
  if (!template) {
    throw new NotFoundException('템플릿을 찾을 수 없습니다');
  }

  const renderedContent = await this.renderTemplate(templateId, variables);

  switch (template.type) {
    case TemplateType.EMAIL:
      await this.emailService.send({
        to: recipient,
        subject: template.subject || '',
        html: renderedContent,
      });
      break;
    case TemplateType.SMS:
      await this.smsService.send({
        to: recipient,
        content: renderedContent,
      });
      break;
    case TemplateType.PUSH:
      await this.pushService.send({
        to: recipient,
        title: template.subject || '',
        body: renderedContent,
      });
      break;
    default:
      throw new BadRequestException('지원하지 않는 템플릿 타입입니다');
  }
}
```

---

## 4. Controller 레이어 설계

**파일:** `apps/server/src/module/template/template.controller.ts`

### GET /api/v1/admin/templates

| 항목 | 내용 |
|------|------|
| 설명 | 템플릿 목록 조회 |
| 인증 | Bearer Token |
| 권한 | CASL Subject: `menu:templates` |

**Query Parameters:**
| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| type | TemplateType | N | 템플릿 타입 필터 (EMAIL, SMS, PUSH, HTML) |
| page | number | N | 페이지 번호 (default: 1) |
| limit | number | N | 페이지당 개수 (default: 20) |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "이메일 인증",
      "type": "EMAIL",
      "key": "email_verification",
      "subject": "이메일 인증을 완료해주세요",
      "content": "<!DOCTYPE html>...",
      "variables": ["userName", "verificationCode"],
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00Z",
      "updatedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 20,
    "page": 1,
    "limit": 20
  }
}
```

### POST /api/v1/admin/templates

| 항목 | 내용 |
|------|------|
| 설명 | 템플릿 생성 |
| 인증 | Bearer Token |
| 권한 | CASL Subject: `menu:templates` |

**Request Body:**
```json
{
  "name": "이메일 인증",
  "type": "EMAIL",
  "key": "email_verification",
  "subject": "이메일 인증을 완료해주세요",
  "content": "<!DOCTYPE html>...",
  "variables": ["userName", "verificationCode", "expiresAt"]
}
```

**Error Responses:**
| 코드 | 설명 |
|------|------|
| 400 | 유효성 검증 실패 |
| 401 | 인증 실패 |
| 403 | 권한 없음 |
| 409 | 중복된 key |

### POST /api/v1/admin/templates/:id/preview

| 항목 | 내용 |
|------|------|
| 설명 | 템플릿 미리보기 렌더링 |
| 인증 | Bearer Token |

**Request Body:**
```json
{
  "variables": {
    "userName": "홍길동",
    "verificationCode": "123456",
    "expiresAt": "2025-01-01 12:00:00"
  }
}
```

**Response (200):**
```json
{
  "html": "<!DOCTYPE html><html>...</html>"
}
```

### POST /api/v1/admin/templates/:id/test

| 항목 | 내용 |
|------|------|
| 설명 | 테스트 발송 |
| 인증 | Bearer Token |

**Request Body:**
```json
{
  "recipient": "test@example.com",
  "variables": {
    "userName": "홍길동",
    "verificationCode": "123456"
  }
}
```

**Response (200):**
```json
{
  "message": "테스트 발송이 완료되었습니다"
}
```

---

## 5. DTO 설계

**파일:** `packages/dto/src/template/`

| DTO 클래스 | 용도 | 필드 |
|------------|------|------|
| CreateTemplateDto | 생성 요청 | name, type, key, subject?, content, variables[] |
| UpdateTemplateDto | 수정 요청 | name?, subject?, content?, isActive? |
| TemplateResponseDto | 응답 | id, name, type, key, subject, content, variables, isActive, createdAt, updatedAt |
| PreviewTemplateDto | 미리보기 요청 | variables: Record<string, any> |
| TestSendTemplateDto | 테스트 발송 요청 | recipient, variables: Record<string, any> |
| GetTemplatesQueryDto | 목록 조회 쿼리 | type?, page?, limit? |

**구현 예시:**

```typescript
// CreateTemplateDto
import { IsString, IsEnum, IsOptional, IsArray, MaxLength } from 'class-validator';

export class CreateTemplateDto {
  @IsString()
  @MaxLength(100)
  name: string;

  @IsEnum(TemplateType)
  type: TemplateType;

  @IsString()
  @MaxLength(100)
  key: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  subject?: string;

  @IsString()
  content: string;

  @IsArray()
  @IsString({ each: true })
  variables: string[];
}

// TestSendTemplateDto
export class TestSendTemplateDto {
  @IsString()
  recipient: string;

  @IsObject()
  variables: Record<string, any>;
}
```

---

## 6. 기술 고려사항

### 6.1 보안

| 항목 | 대응 방안 |
|------|----------|
| HTML Injection | DOMPurify로 HTML sanitize (저장 전) |
| XSS | 템플릿 변수 escape 처리 |
| 변수 검증 | variables 배열에 정의된 변수만 허용 |
| 권한 확인 | CASL ability로 `menu:templates` 체크 |
| 테스트 발송 제한 | Rate limiting (1분당 10회) |
| SQL Injection | Prisma ORM 사용 (파라미터화 쿼리) |

### 6.2 성능

| 항목 | 대응 방안 |
|------|----------|
| 템플릿 조회 | Redis 캐싱 (key: `template:{spaceId}:{key}`, TTL: 1시간) |
| 렌더링 최적화 | Handlebars 컴파일 결과 캐싱 |
| 목록 조회 | 페이지네이션 (기본 20개) |
| 인덱스 활용 | type, spaceId, key 인덱스 활용 |

### 6.3 에러 처리

| 에러 상황 | HTTP 코드 | 에러 메시지 |
|----------|-----------|-------------|
| 템플릿 없음 | 404 | "템플릿을 찾을 수 없습니다" |
| 중복 key | 409 | "이미 존재하는 템플릿 키입니다" |
| 변수 검증 실패 | 400 | "유효하지 않은 변수입니다: {variable}" |
| 렌더링 실패 | 500 | "템플릿 렌더링에 실패했습니다" |
| 발송 실패 | 500 | "테스트 발송에 실패했습니다" |

### 6.4 템플릿 렌더링

**Handlebars 사용:**

```typescript
import Handlebars from 'handlebars';

// Helper 등록
Handlebars.registerHelper('formatDate', (date: string) => {
  return new Date(date).toLocaleDateString('ko-KR');
});

// 렌더링
const template = Handlebars.compile(templateContent);
const result = template(variables);
```

### 6.5 테스트 발송

**이메일 발송 (NodeMailer):**
```typescript
await this.mailer.sendMail({
  from: 'noreply@example.com',
  to: recipient,
  subject: subject,
  html: renderedContent,
});
```

**SMS 발송 (알리고 API):**
```typescript
await this.smsService.send({
  receiver: recipient,
  msg: renderedContent,
});
```

**푸시 발송 (FCM):**
```typescript
await this.fcm.send({
  token: userDeviceToken,
  notification: {
    title: subject,
    body: renderedContent,
  },
});
```

---

## 7. 마이그레이션 계획

**순서:**

1. `packages/prisma/prisma/schema/template.prisma` 파일 생성
2. TemplateType Enum 추가
3. Space 모델에 templates 관계 추가
4. `pnpm prisma:migrate dev --name add-template-system` 실행
5. Entity 클래스 생성 (`packages/entity/src/template.entity.ts`)
6. 기본 템플릿 시드 데이터 추가

**시드 데이터 예시:**

```typescript
// prisma/seed/template.seed.ts
const defaultTemplates = [
  {
    name: '이메일 인증',
    type: 'EMAIL',
    key: 'email_verification',
    subject: '이메일 인증을 완료해주세요',
    content: `
      <h1>안녕하세요, {{userName}}님!</h1>
      <p>인증 코드는 <strong>{{verificationCode}}</strong>입니다.</p>
      <p>만료 시간: {{expiresAt}}</p>
    `,
    variables: ['userName', 'verificationCode', 'expiresAt'],
  },
  {
    name: '비밀번호 재설정',
    type: 'EMAIL',
    key: 'password_reset',
    subject: '비밀번호 재설정 안내',
    content: `
      <h1>비밀번호 재설정</h1>
      <p>{{userName}}님, 비밀번호 재설정 링크입니다.</p>
      <a href="{{resetLink}}">재설정하기</a>
    `,
    variables: ['userName', 'resetLink'],
  },
  {
    name: '회원 탈퇴 안내',
    type: 'EMAIL',
    key: 'user_withdrawal',
    subject: '회원 탈퇴 완료',
    content: `
      <h1>{{userName}}님, 그동안 감사했습니다</h1>
      <p>탈퇴 처리일: {{withdrawalDate}}</p>
      <p>데이터 보관 기간: {{dataRetentionPeriod}}</p>
    `,
    variables: ['userName', 'withdrawalDate', 'dataRetentionPeriod'],
  },
];
```

**롤백 계획:**
- 마이그레이션 실패 시 `prisma migrate reset` 고려
- 운영 환경에서는 down migration 스크립트 준비
