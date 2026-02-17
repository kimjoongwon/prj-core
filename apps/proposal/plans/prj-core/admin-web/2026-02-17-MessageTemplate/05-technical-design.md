# L9-L10: 비즈니스 로직, 테스트

## 이전 레이어 요약 (L0-L8)

- **L0-L2**: 시스템 관리자가 Email/SMS/Push 메시지 템플릿 CRUD + 변수 관리 + 미리보기 + 발송 테스트
- **L3-L4**: 13개 기능, 4개 화면 (목록/상세/등록/수정)
- **L5-L6**: 25개 인터랙션, 8개 API (모두 신규)
- **L7**: MessageTemplate + TemplateVariable 엔티티 (신규), MessageTemplateType enum, 9개 DTO
- **L8**: Cell 2개, Widget 11개, Feature 1개 컴포넌트

---

## L9: 비즈니스 로직 (Logic)

### 비즈니스 규칙 요약

#### 유효성 검사 규칙

| ID | 필드/기능 | 규칙 | 에러 메시지 |
|----|----------|------|------------|
| V001 | code | 영문 대문자+숫자+언더스코어, `/^[A-Z][A-Z0-9_]*$/` | "코드는 영문 대문자, 숫자, 언더스코어만 사용 가능합니다" |
| V002 | code | 시스템 내 중복 불가 (unique) | "이미 존재하는 템플릿 코드입니다" |
| V003 | name | 필수, 2-100자 | "이름은 필수입니다" |
| V004 | type | 필수 선택 (EMAIL/SMS/PUSH) | "유형을 선택해주세요" |
| V005 | subject | EMAIL/PUSH일 때 필수 | "제목은 필수입니다" |
| V006 | subject | PUSH일 때 50자 이내 | "제목은 50자 이내로 입력하세요" |
| V007 | content | 필수 | "본문은 필수입니다" |
| V008 | content | PUSH일 때 200자 이내 | "본문은 200자 이내로 입력하세요" |
| V009 | variable.name | 영문 카멜케이스, `/^[a-zA-Z][a-zA-Z0-9]*$/` | "변수명은 영문 카멜케이스만 가능합니다" |
| V010 | variable.name | 동일 템플릿 내 중복 불가 | "중복된 변수명입니다" |
| V011 | recipient (발송테스트) | 유형별 형식 검증 (이메일/전화번호/토큰) | "유효하지 않은 수신자입니다" |

#### 권한 규칙

| ID | 기능 | 필요 권한 | 조건 |
|----|------|----------|------|
| P001 | 템플릿 목록 조회 | FULL_ACCESS | System Space 전용 |
| P002 | 템플릿 상세 조회 | FULL_ACCESS | System Space 전용 |
| P003 | 템플릿 등록 | FULL_ACCESS | System Space 전용 |
| P004 | 템플릿 수정 | FULL_ACCESS | System Space 전용 |
| P005 | 템플릿 삭제 | FULL_ACCESS | System Space 전용 |
| P006 | 활성/비활성 토글 | FULL_ACCESS | System Space 전용 |
| P007 | 미리보기 | FULL_ACCESS | System Space 전용 |
| P008 | 발송 테스트 | FULL_ACCESS | System Space 전용, 비활성 템플릿 불가 |

#### 상태 전이 규칙

| 현재 상태 | 가능한 전이 | 불가능한 전이 |
|----------|------------|--------------|
| 활성 (isActive=true) | 비활성, 삭제 | - |
| 비활성 (isActive=false) | 활성, 삭제 | 발송 테스트 불가 |
| 삭제 (removedAt!=null) | - (최종 상태) | 모든 전이 불가 |

---

### 백엔드 로직

#### MT-L9-LOG-001: 코드(code) 유니크 검증

```typescript
// MessageTemplateService.create()
async create(dto: CreateMessageTemplateDto): Promise<MessageTemplate> {
  // 코드 중복 검사
  const existing = await this.repository.findByCode(dto.code);
  if (existing) {
    throw new ConflictException("이미 존재하는 템플릿 코드입니다");
  }

  // 변수와 함께 트랜잭션으로 생성
  return this.repository.createWithVariables(dto);
}
```

**연결**: API-003 (POST /api/v1/message-templates), 필드 code (L7-FLD-005)

---

#### MT-L9-LOG-002: 유형별 필드 검증

```typescript
// CreateMessageTemplateDto - class-validator 데코레이터
@ValidateIf((o) => o.type === 'EMAIL' || o.type === 'PUSH')
@IsNotEmpty({ message: "제목은 필수입니다" })
@MaxLength(50, {
  message: "제목은 50자 이내로 입력하세요",
  groups: ['PUSH'], // PUSH일 때만 50자 제한
})
subject?: string;

// 또는 Service 레이어에서 수동 검증
async validateTypeConstraints(dto: CreateMessageTemplateDto): Promise<void> {
  const { type, subject, content } = dto;

  // EMAIL, PUSH: subject 필수
  if ((type === 'EMAIL' || type === 'PUSH') && !subject) {
    throw new BadRequestException("제목은 필수입니다");
  }

  // PUSH: subject 50자 제한
  if (type === 'PUSH' && subject && subject.length > 50) {
    throw new BadRequestException("제목은 50자 이내로 입력하세요");
  }

  // PUSH: content 200자 제한
  if (type === 'PUSH' && content.length > 200) {
    throw new BadRequestException("본문은 200자 이내로 입력하세요");
  }

  // SMS: subject가 들어와도 무시 (저장 시 null 처리)
  if (type === 'SMS') {
    dto.subject = null;
  }
}
```

**유형별 제약사항 매트릭스**:

| 유형 | subject 필수 | subject 제한 | content 제한 | content 형식 |
|------|:----------:|:-----------:|:-----------:|:----------:|
| EMAIL | O | 없음 | 없음 | HTML |
| SMS | X (null 처리) | - | 없음 (바이트 경고만) | 텍스트 |
| PUSH | O | 50자 | 200자 | 텍스트 |

**연결**: API-003, API-004, 필드 type (L7-FLD-007), subject (L7-FLD-008), content (L7-FLD-009)

---

#### MT-L9-LOG-003: 소프트 삭제 + 비활성화

```typescript
// MessageTemplateService.remove()
async remove(id: string): Promise<void> {
  const template = await this.repository.findByIdOrThrow(id);

  // 소프트 삭제: removedAt 설정 + isActive false
  await this.repository.update(id, {
    removedAt: new Date(),
    isActive: false,
  });

  // 관련 TemplateVariable은 Prisma onDelete: Cascade로 자동 처리
  // 소프트 삭제이므로 DB 레벨 cascade는 동작하지 않음
  // -> removedAt 갱신만으로 충분 (변수는 템플릿 조회 시 함께 필터링)
}
```

**연결**: API-005 (DELETE /api/v1/message-templates/:id)

---

#### MT-L9-LOG-004: 활성/비활성 토글

```typescript
// MessageTemplateService.toggleStatus()
async toggleStatus(id: string): Promise<MessageTemplate> {
  const template = await this.repository.findByIdOrThrow(id);

  return this.repository.update(id, {
    isActive: !template.isActive,
  });
}
```

**연결**: API-006 (PATCH /api/v1/message-templates/:id/toggle-status)

---

#### MT-L9-LOG-005: 변수 치환 미리보기

```typescript
// MessageTemplateService.preview()
async preview(
  id: string,
  dto: PreviewMessageTemplateDto,
): Promise<PreviewResult> {
  const template = await this.repository.findByIdOrThrow(id, {
    include: { variables: true },
  });

  let renderedSubject = template.subject;
  let renderedContent = template.content;

  // 1. 입력된 변수로 치환
  for (const [key, value] of Object.entries(dto.variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    if (renderedSubject) {
      renderedSubject = renderedSubject.replace(regex, value);
    }
    renderedContent = renderedContent.replace(regex, value);
  }

  // 2. 기본값이 있는 변수 중 미치환된 것을 기본값으로 치환
  for (const variable of template.variables) {
    if (variable.defaultValue && !dto.variables[variable.name]) {
      const regex = new RegExp(`\\{\\{${variable.name}\\}\\}`, 'g');
      if (renderedSubject) {
        renderedSubject = renderedSubject.replace(regex, variable.defaultValue);
      }
      renderedContent = renderedContent.replace(regex, variable.defaultValue);
    }
  }

  // 3. 미치환 변수 감지
  const unresolvedPattern = /\{\{([^}]+)\}\}/g;
  const subjectUnresolved = renderedSubject
    ? [...renderedSubject.matchAll(unresolvedPattern)].map((m) => m[1])
    : [];
  const contentUnresolved = [
    ...renderedContent.matchAll(unresolvedPattern),
  ].map((m) => m[1]);
  const unresolvedVariables = [
    ...new Set([...subjectUnresolved, ...contentUnresolved]),
  ];

  return {
    type: template.type,
    subject: renderedSubject,
    content: renderedContent,
    unresolvedVariables,
  };
}
```

**연결**: API-007 (POST /api/v1/message-templates/:id/preview)

---

#### MT-L9-LOG-006: 발송 테스트

```typescript
// MessageTemplateService.sendTest()
async sendTest(
  id: string,
  dto: SendTestMessageTemplateDto,
): Promise<SendTestResult> {
  const template = await this.repository.findByIdOrThrow(id, {
    include: { variables: true },
  });

  // 1. 비활성 템플릿 발송 차단
  if (!template.isActive) {
    throw new BadRequestException(
      "비활성화된 템플릿은 발송할 수 없습니다",
    );
  }

  // 2. 필수 변수 검증
  const requiredVars = template.variables.filter((v) => v.isRequired);
  for (const reqVar of requiredVars) {
    if (!dto.variables[reqVar.name] && !reqVar.defaultValue) {
      throw new BadRequestException(
        `필수 변수 '${reqVar.name}'의 값이 필요합니다`,
      );
    }
  }

  // 3. 변수 치환
  const rendered = await this.preview(id, { variables: dto.variables });

  // 4. 수신자 형식 검증 (유형별)
  this.validateRecipient(template.type, dto.recipient);

  // 5. 유형별 발송
  try {
    switch (template.type) {
      case 'EMAIL':
        await this.emailService.send(
          dto.recipient,
          rendered.subject,
          rendered.content,
        );
        break;
      case 'SMS':
        await this.smsService.send(dto.recipient, rendered.content);
        break;
      case 'PUSH':
        await this.pushService.send(
          dto.recipient,
          rendered.subject,
          rendered.content,
        );
        break;
    }

    return { success: true, sentAt: new Date().toISOString(), errorMessage: null };
  } catch (error) {
    return {
      success: false,
      sentAt: new Date().toISOString(),
      errorMessage: error.message,
    };
  }
}

// 수신자 형식 검증
private validateRecipient(type: MessageTemplateType, recipient: string): void {
  switch (type) {
    case 'EMAIL':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
        throw new BadRequestException("유효하지 않은 이메일 주소입니다");
      }
      break;
    case 'SMS':
      if (!/^01[0-9]-?\d{3,4}-?\d{4}$/.test(recipient)) {
        throw new BadRequestException("유효하지 않은 전화번호입니다");
      }
      break;
    case 'PUSH':
      if (!recipient || recipient.trim().length === 0) {
        throw new BadRequestException("디바이스 토큰이 필요합니다");
      }
      break;
  }
}
```

**연결**: API-008 (POST /api/v1/message-templates/:id/send-test)

---

#### MT-L9-LOG-007: 변수 업데이트 (Set Semantics)

```typescript
// MessageTemplateRepository.updateWithVariables()
async updateWithVariables(
  id: string,
  dto: UpdateMessageTemplateDto,
): Promise<MessageTemplate> {
  const { variables, ...templateData } = dto;

  return this.prisma.$transaction(async (tx) => {
    // 1. 기존 변수 전체 삭제
    await tx.templateVariable.deleteMany({
      where: { messageTemplateId: id },
    });

    // 2. 새 변수 일괄 생성 (배열이 있는 경우)
    if (variables?.length) {
      await tx.templateVariable.createMany({
        data: variables.map((v) => ({
          name: v.name,
          description: v.description ?? null,
          defaultValue: v.defaultValue ?? null,
          isRequired: v.isRequired ?? false,
          messageTemplateId: id,
        })),
      });
    }

    // 3. 템플릿 본체 업데이트
    return tx.messageTemplate.update({
      where: { id },
      data: templateData,
      include: { variables: true },
    });
  });
}
```

**변수 업데이트 전략 (Set Semantics)**:
- 요청에 포함된 변수 배열이 최종 상태
- 기존 변수를 모두 삭제하고 새로 생성
- 트랜잭션으로 원자성 보장
- 복잡한 diff 로직 없이 단순하고 안전한 전략

**연결**: API-004 (PATCH /api/v1/message-templates/:id)

---

#### MT-L9-LOG-008: 목록 조회 (소프트 삭제 필터링)

```typescript
// MessageTemplateRepository.findMany()
async findMany(query: QueryMessageTemplateDto) {
  const where: Prisma.MessageTemplateWhereInput = {
    removedAt: null, // 소프트 삭제된 데이터 제외
    ...(query.search && {
      OR: [
        { name: { contains: query.search, mode: 'insensitive' } },
        { code: { contains: query.search, mode: 'insensitive' } },
      ],
    }),
    ...(query.type && { type: query.type }),
    ...(query.isActive !== undefined && { isActive: query.isActive }),
  };

  const [data, total] = await Promise.all([
    this.prisma.messageTemplate.findMany({
      where,
      skip: query.skip,
      take: query.take,
      orderBy: this.parseSort(query.sort),
      include: { variables: true },
    }),
    this.prisma.messageTemplate.count({ where }),
  ]);

  return { data, total };
}
```

**연결**: API-001 (GET /api/v1/message-templates)

---

#### MT-L9-LOG-009: 변수 정합성 경고 (백엔드 보조)

```typescript
// 등록/수정 시 본문과 변수 목록 간 정합성 검사 (경고 수준, 차단하지 않음)
function checkVariableConsistency(
  content: string,
  subject: string | null,
  variables: { name: string }[],
): { warnings: string[] } {
  const warnings: string[] = [];
  const fullText = `${subject || ''} ${content}`;

  // 본문에서 {{변수명}} 패턴 추출
  const usedVars = [...fullText.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]);
  const definedVars = variables.map((v) => v.name);

  // 본문에 있지만 변수 목록에 없는 변수
  const undefinedVars = [...new Set(usedVars)].filter(
    (v) => !definedVars.includes(v),
  );
  if (undefinedVars.length > 0) {
    warnings.push(
      `본문에 사용된 변수가 목록에 정의되지 않았습니다: ${undefinedVars.join(', ')}`,
    );
  }

  // 변수 목록에 있지만 본문에 없는 변수
  const unusedVars = definedVars.filter((v) => !usedVars.includes(v));
  if (unusedVars.length > 0) {
    warnings.push(
      `정의된 변수가 본문에서 사용되지 않습니다: ${unusedVars.join(', ')}`,
    );
  }

  return { warnings };
}
```

**참고**: 이 검증은 경고 수준이므로 등록/수정을 차단하지 않음. 응답에 warnings 필드로 포함 가능.

---

### 프론트엔드 로직

#### MT-L9-LOG-010: SMS 바이트 수 계산

```typescript
// ByteCounter 위젯 내부 로직
function calculateSmsBytes(text: string): {
  bytes: number;
  pages: number;
  isOverflow: boolean;
} {
  let bytes = 0;
  for (const char of text) {
    // 한글, 한자, 일본어 등 멀티바이트 문자: 2바이트
    // ASCII (영문, 숫자, 특수문자): 1바이트
    bytes += char.charCodeAt(0) > 127 ? 2 : 1;
  }

  const bytesPerMessage = 90;
  const pages = Math.ceil(bytes / bytesPerMessage) || 1;
  const isOverflow = pages > 1;

  return { bytes, pages, isOverflow };
}

// 사용 예시
// "인증코드는 123456입니다" -> 한글 7자(14) + 영문/숫자 7자(7) = 21바이트, 1장
// {{변수}} 포함 텍스트는 변수 자체가 바이트에 포함됨 (실제 발송 시에는 치환 후 계산)
```

**연결**: CMP-027 (ByteCounter)

---

#### MT-L9-LOG-011: 변수 정합성 검증 (프론트엔드)

```typescript
// VariableEditTable 내부 로직
interface VariableConsistencyResult {
  undefinedVars: string[]; // 본문에 있지만 변수 목록에 없음
  unusedVars: string[];    // 변수 목록에 있지만 본문에 없음
}

function validateVariableConsistency(
  content: string,
  subject: string | null,
  variables: { name: string }[],
): VariableConsistencyResult {
  const fullText = `${subject || ''} ${content}`;

  // 본문에서 {{변수명}} 패턴 추출
  const usedVars = [
    ...new Set([...fullText.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1])),
  ];
  const definedVars = variables.map((v) => v.name).filter((n) => n.length > 0);

  const undefinedVars = usedVars.filter((v) => !definedVars.includes(v));
  const unusedVars = definedVars.filter((v) => !usedVars.includes(v));

  return { undefinedVars, unusedVars };
}

// UI 표시:
// undefinedVars -> 경고 배지: "본문에 사용된 {{appName}} 변수가 목록에 없습니다"
// unusedVars -> 정보 표시: "{{legacyVar}} 변수가 본문에서 사용되지 않습니다"
```

**연결**: CMP-029 (VariableEditTable)

---

#### MT-L9-LOG-012: 등록 폼 유효성 검증

```typescript
// MessageTemplateForm 내부 유효성 규칙
const validationRules = {
  type: {
    required: "유형을 선택해주세요",
  },
  code: {
    required: "코드는 필수입니다",
    pattern: {
      value: /^[A-Z][A-Z0-9_]*$/,
      message: "영문 대문자, 숫자, 언더스코어만 사용 가능합니다 (대문자로 시작)",
    },
  },
  name: {
    required: "이름은 필수입니다",
    minLength: { value: 2, message: "이름은 2자 이상 입력하세요" },
    maxLength: { value: 100, message: "이름은 100자 이내로 입력하세요" },
  },
  description: {
    maxLength: { value: 500, message: "설명은 500자 이내로 입력하세요" },
  },
  subject: {
    validate: (value: string, formValues: FormValues) => {
      const { type } = formValues;
      // EMAIL, PUSH일 때 필수
      if ((type === 'EMAIL' || type === 'PUSH') && !value) {
        return "제목은 필수입니다";
      }
      // PUSH: 50자 제한
      if (type === 'PUSH' && value && value.length > 50) {
        return "제목은 50자 이내로 입력하세요";
      }
      return true;
    },
  },
  content: {
    required: "본문은 필수입니다",
    validate: (value: string, formValues: FormValues) => {
      // PUSH: 200자 제한
      if (formValues.type === 'PUSH' && value.length > 200) {
        return "본문은 200자 이내로 입력하세요";
      }
      return true;
    },
  },
};

// 변수명 유효성 규칙
const variableNameRules = {
  required: "변수명은 필수입니다",
  pattern: {
    value: /^[a-zA-Z][a-zA-Z0-9]*$/,
    message: "영문 카멜케이스만 사용 가능합니다",
  },
  validate: (value: string, allVariables: VariableEditItem[]) => {
    // 동일 목록 내 중복 검사
    const duplicates = allVariables.filter((v) => v.name === value);
    if (duplicates.length > 1) {
      return "중복된 변수명입니다";
    }
    return true;
  },
};
```

**연결**: CMP-040 (MessageTemplateForm), ACT-020 (등록 제출), ACT-024 (수정 제출)

---

#### MT-L9-LOG-013: 유형별 폼 동적 전환

```typescript
// MessageTemplateForm 내부 로직
function handleTypeChange(newType: MessageTemplateType) {
  // 유형 변경 시 subject 필드 초기화
  switch (newType) {
    case 'EMAIL':
      // subject 필드 활성화, content를 HTML 에디터로 전환
      // subject 값 유지 (이전에 입력한 값이 있으면)
      break;
    case 'SMS':
      // subject 필드 숨김 + 값 초기화 (null)
      form.setValue("subject", "");
      // content를 Textarea로 전환 + ByteCounter 표시
      break;
    case 'PUSH':
      // subject 필드 활성화 (50자 제한)
      // content를 Textarea로 전환 (200자 제한) + CharacterCounter 표시
      break;
  }
}
```

**연결**: ACT-017 (유형 선택), CMP-024 (TemplateContentEditor)

---

#### MT-L9-LOG-014: 삭제 확인 다이얼로그

```typescript
// 상세 페이지 삭제 핸들러
function handleDelete(messageTemplateId: string) {
  modal.confirm({
    title: "삭제 확인",
    content:
      "이 템플릿을 삭제하시겠습니까?\n관련 변수도 함께 삭제됩니다.\n이 작업은 되돌릴 수 없습니다.",
    confirmText: "삭제",
    confirmColor: "danger",
    onConfirm: async () => {
      await deleteMessageTemplate(messageTemplateId);
      // 성공 토스트 + 목록 화면으로 이동
      toast.success("메시지 템플릿이 삭제되었습니다.");
      router.push("/message-templates");
    },
  });
}
```

**연결**: ACT-011 (삭제 실행), FEA-009 (템플릿 삭제)

---

#### MT-L9-LOG-015: 인라인 활성 토글 (Optimistic UI)

```typescript
// 목록 페이지 인라인 토글 핸들러
async function handleToggleStatus(messageTemplateId: string) {
  // 1. Optimistic UI: Switch 상태 즉시 반전
  queryClient.setQueryData(
    getGetMessageTemplatesQueryKey(currentParams),
    (old: ResponseData) => ({
      ...old,
      data: old.data.map((item) =>
        item.id === messageTemplateId
          ? { ...item, isActive: !item.isActive }
          : item,
      ),
    }),
  );

  try {
    // 2. API 호출
    await toggleStatusMessageTemplate(messageTemplateId);

    // 3. 성공 토스트
    toast.success("템플릿 상태가 변경되었습니다.");
  } catch (error) {
    // 4. 실패 시 롤백
    queryClient.invalidateQueries(
      getGetMessageTemplatesQueryKey(currentParams),
    );
    toast.error("상태 변경에 실패했습니다.");
  }
}
```

**연결**: ACT-008 (인라인 활성 토글), CMP-011 (TemplateActiveToggleCell)

---

#### MT-L9-LOG-016: 발송 테스트 수신자 형식 검증 (프론트엔드)

```typescript
// SendTestModal 내부 유효성 규칙
function getRecipientValidation(type: MessageTemplateType) {
  switch (type) {
    case 'EMAIL':
      return {
        required: "이메일 주소를 입력해주세요",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "유효한 이메일 주소를 입력해주세요",
        },
      };
    case 'SMS':
      return {
        required: "전화번호를 입력해주세요",
        pattern: {
          value: /^01[0-9]-?\d{3,4}-?\d{4}$/,
          message: "유효한 전화번호를 입력해주세요 (예: 010-1234-5678)",
        },
      };
    case 'PUSH':
      return {
        required: "디바이스 토큰을 입력해주세요",
      };
  }
}
```

**연결**: ACT-016 (발송 테스트 실행), CMP-031 (SendTestModal)

---

## L10: 테스트 (Test)

### 백엔드 테스트

#### MT-L10-TST-001: MessageTemplateService 유닛 테스트

```typescript
describe('MessageTemplateService', () => {
  describe('create', () => {
    it('새 템플릿을 등록한다', async () => {
      // Given
      const dto: CreateMessageTemplateDto = {
        code: 'WELCOME_EMAIL',
        name: '가입 환영 메시지',
        type: 'EMAIL',
        subject: '{{userName}}님, 가입을 환영합니다!',
        content: '<h1>환영합니다 {{userName}}님</h1>',
        variables: [
          { name: 'userName', description: '사용자 이름', isRequired: true },
        ],
      };
      repository.findByCode.mockResolvedValue(null);

      // When
      const result = await service.create(dto);

      // Then
      expect(result.code).toBe('WELCOME_EMAIL');
      expect(repository.createWithVariables).toHaveBeenCalledWith(
        expect.objectContaining(dto),
      );
    });

    it('중복된 코드로 등록하면 ConflictException을 던진다', async () => {
      // Given
      repository.findByCode.mockResolvedValue(existingTemplate);

      // When & Then
      await expect(
        service.create({ code: 'WELCOME_EMAIL', ...restDto }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('validateTypeConstraints', () => {
    it('EMAIL 유형에 subject가 없으면 BadRequestException을 던진다', async () => {
      // Given
      const dto = { type: 'EMAIL', subject: null, content: '<p>본문</p>' };

      // When & Then
      await expect(
        service.validateTypeConstraints(dto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('PUSH 유형에 subject가 50자를 초과하면 BadRequestException을 던진다', async () => {
      // Given
      const dto = {
        type: 'PUSH',
        subject: 'a'.repeat(51),
        content: '본문',
      };

      // When & Then
      await expect(
        service.validateTypeConstraints(dto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('PUSH 유형에 content가 200자를 초과하면 BadRequestException을 던진다', async () => {
      // Given
      const dto = {
        type: 'PUSH',
        subject: '제목',
        content: 'a'.repeat(201),
      };

      // When & Then
      await expect(
        service.validateTypeConstraints(dto as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('SMS 유형이면 subject를 null로 처리한다', async () => {
      // Given
      const dto = {
        type: 'SMS',
        subject: '불필요한 제목',
        content: '본문',
      };

      // When
      await service.validateTypeConstraints(dto as any);

      // Then
      expect(dto.subject).toBeNull();
    });
  });

  describe('toggleStatus', () => {
    it('활성 상태를 반전시킨다', async () => {
      // Given: isActive=true인 템플릿
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        isActive: true,
      });

      // When
      await service.toggleStatus(template.id);

      // Then
      expect(repository.update).toHaveBeenCalledWith(template.id, {
        isActive: false,
      });
    });

    it('비활성 상태를 활성으로 변경한다', async () => {
      // Given: isActive=false인 템플릿
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        isActive: false,
      });

      // When
      await service.toggleStatus(template.id);

      // Then
      expect(repository.update).toHaveBeenCalledWith(template.id, {
        isActive: true,
      });
    });
  });

  describe('remove', () => {
    it('소프트 삭제 시 removedAt과 isActive를 설정한다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue(template);

      // When
      await service.remove(template.id);

      // Then
      expect(repository.update).toHaveBeenCalledWith(template.id, {
        removedAt: expect.any(Date),
        isActive: false,
      });
    });
  });

  describe('preview', () => {
    it('변수를 치환하여 렌더링 결과를 반환한다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        type: 'EMAIL',
        subject: '{{userName}}님, 환영합니다!',
        content: '<p>안녕하세요 {{userName}}님</p>',
        variables: [
          { name: 'userName', defaultValue: null, isRequired: true },
        ],
      });

      // When
      const result = await service.preview(template.id, {
        variables: { userName: '홍길동' },
      });

      // Then
      expect(result.subject).toBe('홍길동님, 환영합니다!');
      expect(result.content).toBe('<p>안녕하세요 홍길동님</p>');
      expect(result.unresolvedVariables).toHaveLength(0);
    });

    it('미치환 변수를 감지하여 반환한다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        type: 'EMAIL',
        subject: '{{userName}}님에게',
        content: '<p>{{companyName}}에서 알립니다</p>',
        variables: [
          { name: 'userName', defaultValue: null, isRequired: true },
          { name: 'companyName', defaultValue: null, isRequired: false },
        ],
      });

      // When
      const result = await service.preview(template.id, {
        variables: { userName: '홍길동' },
      });

      // Then
      expect(result.unresolvedVariables).toContain('companyName');
    });

    it('기본값이 있는 변수는 기본값으로 치환한다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        type: 'EMAIL',
        subject: null,
        content: '{{appName}}에서 보냄',
        variables: [
          { name: 'appName', defaultValue: '서비스', isRequired: false },
        ],
      });

      // When
      const result = await service.preview(template.id, { variables: {} });

      // Then
      expect(result.content).toBe('서비스에서 보냄');
      expect(result.unresolvedVariables).toHaveLength(0);
    });
  });

  describe('sendTest', () => {
    it('비활성 템플릿에 발송 테스트 시 BadRequestException을 던진다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        isActive: false,
      });

      // When & Then
      await expect(
        service.sendTest(template.id, {
          recipient: 'test@example.com',
          variables: {},
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('필수 변수가 누락되면 BadRequestException을 던진다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        isActive: true,
        type: 'EMAIL',
        variables: [
          { name: 'userName', isRequired: true, defaultValue: null },
        ],
      });

      // When & Then
      await expect(
        service.sendTest(template.id, {
          recipient: 'test@example.com',
          variables: {},
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('EMAIL 유형에 유효하지 않은 이메일 주소면 BadRequestException을 던진다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        isActive: true,
        type: 'EMAIL',
        variables: [],
      });

      // When & Then
      await expect(
        service.sendTest(template.id, {
          recipient: 'invalid-email',
          variables: {},
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('SMS 유형에 유효하지 않은 전화번호면 BadRequestException을 던진다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        isActive: true,
        type: 'SMS',
        variables: [],
      });

      // When & Then
      await expect(
        service.sendTest(template.id, {
          recipient: '1234',
          variables: {},
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('발송 성공 시 success=true를 반환한다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        isActive: true,
        type: 'EMAIL',
        subject: '제목',
        content: '본문',
        variables: [],
      });
      emailService.send.mockResolvedValue(undefined);

      // When
      const result = await service.sendTest(template.id, {
        recipient: 'test@example.com',
        variables: {},
      });

      // Then
      expect(result.success).toBe(true);
      expect(result.errorMessage).toBeNull();
    });

    it('발송 실패 시 success=false와 에러 메시지를 반환한다', async () => {
      // Given
      repository.findByIdOrThrow.mockResolvedValue({
        ...template,
        isActive: true,
        type: 'EMAIL',
        subject: '제목',
        content: '본문',
        variables: [],
      });
      emailService.send.mockRejectedValue(new Error('SMTP 연결 오류'));

      // When
      const result = await service.sendTest(template.id, {
        recipient: 'test@example.com',
        variables: {},
      });

      // Then
      expect(result.success).toBe(false);
      expect(result.errorMessage).toBe('SMTP 연결 오류');
    });
  });
});
```

---

#### MT-L10-TST-002: MessageTemplateController E2E 테스트

```typescript
describe('MessageTemplateController (e2e)', () => {
  describe('GET /api/v1/message-templates', () => {
    it('템플릿 목록을 반환한다', async () => {
      // Given: 시드 데이터에 템플릿이 등록되어 있다
      // When
      const response = await request(app.getHttpServer())
        .get('/api/v1/message-templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .expect(200);

      // Then
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.meta).toHaveProperty('total');
    });

    it('유형별 필터링이 적용된다', async () => {
      // When
      const response = await request(app.getHttpServer())
        .get('/api/v1/message-templates?type=EMAIL')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .expect(200);

      // Then
      response.body.data.forEach((item: any) => {
        expect(item.type).toBe('EMAIL');
      });
    });

    it('검색이 적용된다', async () => {
      // When
      const response = await request(app.getHttpServer())
        .get('/api/v1/message-templates?search=WELCOME')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .expect(200);

      // Then
      response.body.data.forEach((item: any) => {
        const matchesSearch =
          item.name.includes('WELCOME') || item.code.includes('WELCOME');
        expect(matchesSearch).toBe(true);
      });
    });

    it('활성 상태 필터링이 적용된다', async () => {
      // When
      const response = await request(app.getHttpServer())
        .get('/api/v1/message-templates?isActive=true')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .expect(200);

      // Then
      response.body.data.forEach((item: any) => {
        expect(item.isActive).toBe(true);
      });
    });

    it('인증 없이 호출하면 401을 반환한다', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/message-templates')
        .expect(401);
    });
  });

  describe('GET /api/v1/message-templates/:id', () => {
    it('템플릿 상세 정보를 변수와 함께 반환한다', async () => {
      // When
      const response = await request(app.getHttpServer())
        .get(`/api/v1/message-templates/${templateId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .expect(200);

      // Then
      expect(response.body.data.id).toBe(templateId);
      expect(response.body.data.variables).toBeInstanceOf(Array);
    });

    it('존재하지 않는 ID로 조회하면 404를 반환한다', async () => {
      await request(app.getHttpServer())
        .get('/api/v1/message-templates/non-existent-id')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .expect(404);
    });
  });

  describe('POST /api/v1/message-templates', () => {
    it('새 템플릿을 등록한다', async () => {
      // When
      const response = await request(app.getHttpServer())
        .post('/api/v1/message-templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          code: 'E2E_TEST_TEMPLATE',
          name: 'E2E 테스트 템플릿',
          type: 'EMAIL',
          subject: '{{userName}}님 안녕하세요',
          content: '<p>테스트 본문 {{userName}}</p>',
          description: 'E2E 테스트용',
          variables: [
            { name: 'userName', description: '사용자 이름', isRequired: true },
          ],
        })
        .expect(201);

      // Then
      expect(response.body.data.code).toBe('E2E_TEST_TEMPLATE');
      expect(response.body.data.variables).toHaveLength(1);
      expect(response.body.data.variables[0].name).toBe('userName');
    });

    it('중복 코드로 등록하면 409를 반환한다', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/message-templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          code: 'WELCOME_EMAIL', // 이미 존재하는 코드
          name: '중복 테스트',
          type: 'EMAIL',
          subject: '제목',
          content: '본문',
        })
        .expect(409);
    });

    it('EMAIL 유형에 subject가 없으면 400을 반환한다', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/message-templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          code: 'NO_SUBJECT_EMAIL',
          name: '제목 없는 이메일',
          type: 'EMAIL',
          // subject 누락
          content: '본문',
        })
        .expect(400);
    });

    it('필수 필드가 누락되면 400을 반환한다', async () => {
      await request(app.getHttpServer())
        .post('/api/v1/message-templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          // code, name, type, content 모두 누락
        })
        .expect(400);
    });
  });

  describe('PATCH /api/v1/message-templates/:id', () => {
    it('템플릿을 수정한다', async () => {
      // When
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/message-templates/${templateId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          name: '수정된 이름',
          description: '수정된 설명',
        })
        .expect(200);

      // Then
      expect(response.body.data.name).toBe('수정된 이름');
    });

    it('변수를 전체 교체한다 (Set Semantics)', async () => {
      // When
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/message-templates/${templateId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          variables: [
            { name: 'newVar1', description: '새 변수 1', isRequired: true },
            { name: 'newVar2', description: '새 변수 2', isRequired: false },
          ],
        })
        .expect(200);

      // Then
      expect(response.body.data.variables).toHaveLength(2);
      expect(response.body.data.variables[0].name).toBe('newVar1');
    });
  });

  describe('DELETE /api/v1/message-templates/:id', () => {
    it('템플릿을 소프트 삭제한다', async () => {
      // When
      await request(app.getHttpServer())
        .delete(`/api/v1/message-templates/${deleteTargetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .expect(204);

      // Then: 삭제된 템플릿은 목록에서 조회되지 않음
      const listResponse = await request(app.getHttpServer())
        .get('/api/v1/message-templates')
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .expect(200);

      const deletedItem = listResponse.body.data.find(
        (item: any) => item.id === deleteTargetId,
      );
      expect(deletedItem).toBeUndefined();
    });
  });

  describe('PATCH /api/v1/message-templates/:id/toggle-status', () => {
    it('활성 상태를 토글한다', async () => {
      // Given: 현재 활성 상태 확인
      const before = await request(app.getHttpServer())
        .get(`/api/v1/message-templates/${templateId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId);
      const wasActive = before.body.data.isActive;

      // When
      const response = await request(app.getHttpServer())
        .patch(`/api/v1/message-templates/${templateId}/toggle-status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .expect(200);

      // Then
      expect(response.body.data.isActive).toBe(!wasActive);
    });
  });

  describe('POST /api/v1/message-templates/:id/preview', () => {
    it('변수를 치환한 미리보기 결과를 반환한다', async () => {
      // When
      const response = await request(app.getHttpServer())
        .post(`/api/v1/message-templates/${emailTemplateId}/preview`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          variables: { userName: '홍길동' },
        })
        .expect(200);

      // Then
      expect(response.body.data.subject).toContain('홍길동');
      expect(response.body.data.content).toContain('홍길동');
      expect(response.body.data.unresolvedVariables).toBeInstanceOf(Array);
    });

    it('미치환 변수 목록을 반환한다', async () => {
      // When: 일부 변수만 전달
      const response = await request(app.getHttpServer())
        .post(`/api/v1/message-templates/${emailTemplateId}/preview`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          variables: {}, // 변수 없이 호출
        })
        .expect(200);

      // Then
      expect(response.body.data.unresolvedVariables.length).toBeGreaterThan(0);
    });
  });

  describe('POST /api/v1/message-templates/:id/send-test', () => {
    it('비활성 템플릿에 발송 테스트 시 400을 반환한다', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/message-templates/${inactiveTemplateId}/send-test`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          recipient: 'test@example.com',
          variables: {},
        })
        .expect(400);
    });

    it('유효하지 않은 수신자 형식이면 400을 반환한다', async () => {
      await request(app.getHttpServer())
        .post(`/api/v1/message-templates/${emailTemplateId}/send-test`)
        .set('Authorization', `Bearer ${adminToken}`)
        .set('X-Space-ID', systemSpaceId)
        .send({
          recipient: 'not-an-email',
          variables: {},
        })
        .expect(400);
    });
  });
});
```

---

### 프론트엔드 테스트

#### MT-L10-TST-010: 템플릿 목록 페이지 테스트

```typescript
describe('메시지 템플릿 목록 페이지', () => {
  it('템플릿 목록을 표시한다', async () => {
    // Given: API가 템플릿 목록 반환
    mockUseGetMessageTemplates.mockReturnValue({
      data: {
        data: [mockEmailTemplate, mockSmsTemplate],
        meta: { total: 2, skip: 0, take: 20, totalPages: 1 },
      },
      isLoading: false,
    });

    // When
    render(<MessageTemplateListClient />);

    // Then
    expect(screen.getByText('WELCOME_EMAIL')).toBeInTheDocument();
    expect(screen.getByText('가입 환영 메시지')).toBeInTheDocument();
  });

  it('등록 버튼 클릭 시 등록 페이지로 이동한다', async () => {
    // Given
    render(<MessageTemplateListClient />);

    // When
    await userEvent.click(screen.getByText('템플릿 등록'));

    // Then
    expect(router.push).toHaveBeenCalledWith('/message-templates/new');
  });

  it('행 클릭 시 상세 페이지로 이동한다', async () => {
    // Given
    render(<MessageTemplateListClient />);

    // When
    await userEvent.click(screen.getByText('WELCOME_EMAIL'));

    // Then
    expect(router.push).toHaveBeenCalledWith(
      `/message-templates/${mockEmailTemplate.id}`,
    );
  });

  it('유형 필터 변경 시 목록이 갱신된다', async () => {
    // Given
    render(<MessageTemplateListClient />);

    // When
    await userEvent.click(screen.getByLabelText('유형'));
    await userEvent.click(screen.getByText('이메일'));

    // Then
    expect(mockUseGetMessageTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'EMAIL' }),
    );
  });

  it('검색어 입력 후 Enter 시 목록이 갱신된다', async () => {
    // Given
    render(<MessageTemplateListClient />);

    // When
    const searchInput = screen.getByPlaceholderText('이름 또는 코드로 검색');
    await userEvent.type(searchInput, 'WELCOME{enter}');

    // Then
    expect(mockUseGetMessageTemplates).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'WELCOME' }),
    );
  });

  it('인라인 Switch 토글 시 상태가 변경된다', async () => {
    // Given
    render(<MessageTemplateListClient />);

    // When
    const switches = screen.getAllByRole('switch');
    await userEvent.click(switches[0]);

    // Then
    expect(mockToggleStatusMessageTemplate).toHaveBeenCalledWith(
      mockEmailTemplate.id,
    );
  });

  it('데이터가 없으면 빈 상태를 표시한다', async () => {
    // Given
    mockUseGetMessageTemplates.mockReturnValue({
      data: { data: [], meta: { total: 0, skip: 0, take: 20, totalPages: 0 } },
      isLoading: false,
    });

    // When
    render(<MessageTemplateListClient />);

    // Then
    expect(
      screen.getByText('등록된 메시지 템플릿이 없습니다.'),
    ).toBeInTheDocument();
  });
});
```

---

#### MT-L10-TST-011: 템플릿 등록 폼 테스트

```typescript
describe('메시지 템플릿 등록 폼', () => {
  it('필수 필드 미입력 시 에러를 표시한다', async () => {
    // Given
    render(<MessageTemplateCreateClient />);

    // When
    await userEvent.click(screen.getByText('등록'));

    // Then
    expect(screen.getByText('유형을 선택해주세요')).toBeInTheDocument();
    expect(screen.getByText('코드는 필수입니다')).toBeInTheDocument();
    expect(screen.getByText('이름은 필수입니다')).toBeInTheDocument();
    expect(screen.getByText('본문은 필수입니다')).toBeInTheDocument();
  });

  it('코드에 소문자를 입력하면 패턴 에러를 표시한다', async () => {
    // Given
    render(<MessageTemplateCreateClient />);

    // When
    await userEvent.type(screen.getByLabelText('코드'), 'lowercase_code');
    await userEvent.click(screen.getByText('등록'));

    // Then
    expect(
      screen.getByText('영문 대문자, 숫자, 언더스코어만 사용 가능합니다'),
    ).toBeInTheDocument();
  });

  it('EMAIL 유형 선택 시 제목 필드와 HTML 에디터가 표시된다', async () => {
    // Given
    render(<MessageTemplateCreateClient />);

    // When
    await userEvent.click(screen.getByLabelText('EMAIL'));

    // Then
    expect(screen.getByLabelText('제목')).toBeInTheDocument();
    expect(screen.getByTestId('html-editor')).toBeInTheDocument();
  });

  it('SMS 유형 선택 시 제목 필드가 숨겨지고 바이트 카운터가 표시된다', async () => {
    // Given
    render(<MessageTemplateCreateClient />);

    // When
    await userEvent.click(screen.getByLabelText('SMS'));

    // Then
    expect(screen.queryByLabelText('제목')).not.toBeInTheDocument();
    expect(screen.getByText(/바이트/)).toBeInTheDocument();
  });

  it('PUSH 유형 선택 시 제목(50자), 본문(200자) 제한이 표시된다', async () => {
    // Given
    render(<MessageTemplateCreateClient />);

    // When
    await userEvent.click(screen.getByLabelText('PUSH'));

    // Then
    expect(screen.getByLabelText('제목')).toBeInTheDocument();
    expect(screen.getByText(/\/50자/)).toBeInTheDocument();
    expect(screen.getByText(/\/200자/)).toBeInTheDocument();
  });

  it('변수 추가 버튼 클릭 시 빈 행이 추가된다', async () => {
    // Given
    render(<MessageTemplateCreateClient />);

    // When
    await userEvent.click(screen.getByText('+ 변수 추가'));

    // Then
    const nameInputs = screen.getAllByPlaceholderText('변수명');
    expect(nameInputs.length).toBeGreaterThan(0);
  });

  it('변수 삭제 시 해당 행이 제거된다', async () => {
    // Given
    render(<MessageTemplateCreateClient />);
    await userEvent.click(screen.getByText('+ 변수 추가'));
    await userEvent.click(screen.getByText('+ 변수 추가'));

    // When
    const deleteButtons = screen.getAllByLabelText('변수 삭제');
    await userEvent.click(deleteButtons[0]);

    // Then
    const nameInputs = screen.getAllByPlaceholderText('변수명');
    expect(nameInputs).toHaveLength(1);
  });

  it('중복 변수명 입력 시 에러를 표시한다', async () => {
    // Given
    render(<MessageTemplateCreateClient />);
    await userEvent.click(screen.getByText('+ 변수 추가'));
    await userEvent.click(screen.getByText('+ 변수 추가'));

    // When
    const nameInputs = screen.getAllByPlaceholderText('변수명');
    await userEvent.type(nameInputs[0], 'userName');
    await userEvent.type(nameInputs[1], 'userName');
    await userEvent.click(screen.getByText('등록'));

    // Then
    expect(screen.getByText('중복된 변수명입니다')).toBeInTheDocument();
  });

  it('취소 버튼 클릭 시 목록 페이지로 이동한다', async () => {
    // Given
    render(<MessageTemplateCreateClient />);

    // When
    await userEvent.click(screen.getByText('취소'));

    // Then
    expect(router.push).toHaveBeenCalledWith('/message-templates');
  });

  it('등록 성공 시 상세 페이지로 이동한다', async () => {
    // Given
    mockCreateMessageTemplate.mockResolvedValue({
      data: { id: 'new-template-id' },
    });
    render(<MessageTemplateCreateClient />);

    // When: 폼을 모두 채우고 등록
    await userEvent.click(screen.getByLabelText('EMAIL'));
    await userEvent.type(screen.getByLabelText('코드'), 'NEW_TEMPLATE');
    await userEvent.type(screen.getByLabelText('이름'), '새 템플릿');
    await userEvent.type(screen.getByLabelText('제목'), '제목입니다');
    // content 입력 (HTML 에디터 모킹)
    await userEvent.click(screen.getByText('등록'));

    // Then
    expect(router.push).toHaveBeenCalledWith(
      '/message-templates/new-template-id',
    );
  });
});
```

---

#### MT-L10-TST-012: 템플릿 상세 페이지 테스트

```typescript
describe('메시지 템플릿 상세 페이지', () => {
  it('템플릿 상세 정보를 표시한다', async () => {
    // Given
    mockUseGetMessageTemplate.mockReturnValue({
      data: { data: mockEmailTemplate },
      isLoading: false,
    });

    // When
    render(<MessageTemplateDetailClient />);

    // Then
    expect(screen.getByText('WELCOME_EMAIL')).toBeInTheDocument();
    expect(screen.getByText('가입 환영 메시지')).toBeInTheDocument();
    expect(screen.getByText('이메일')).toBeInTheDocument();
  });

  it('변수 목록을 표시한다', async () => {
    // Given
    mockUseGetMessageTemplate.mockReturnValue({
      data: {
        data: {
          ...mockEmailTemplate,
          variables: [
            { id: '1', name: 'userName', description: '사용자 이름', defaultValue: null, isRequired: true },
          ],
        },
      },
      isLoading: false,
    });

    // When
    render(<MessageTemplateDetailClient />);

    // Then
    expect(screen.getByText('{{userName}}')).toBeInTheDocument();
    expect(screen.getByText('사용자 이름')).toBeInTheDocument();
    expect(screen.getByText('필수')).toBeInTheDocument();
  });

  it('수정 버튼 클릭 시 수정 페이지로 이동한다', async () => {
    // Given
    render(<MessageTemplateDetailClient />);

    // When
    await userEvent.click(screen.getByText('수정'));

    // Then
    expect(router.push).toHaveBeenCalledWith(
      `/message-templates/${mockEmailTemplate.id}/edit`,
    );
  });

  it('삭제 버튼 클릭 시 확인 다이얼로그를 표시한다', async () => {
    // Given
    render(<MessageTemplateDetailClient />);

    // When
    await userEvent.click(screen.getByText('삭제'));

    // Then
    expect(
      screen.getByText(/이 템플릿을 삭제하시겠습니까/),
    ).toBeInTheDocument();
  });

  it('미리보기 버튼 클릭 시 미리보기 모달을 표시한다', async () => {
    // Given
    render(<MessageTemplateDetailClient />);

    // When
    await userEvent.click(screen.getByText('미리보기'));

    // Then
    expect(screen.getByText('템플릿 미리보기')).toBeInTheDocument();
    expect(screen.getByText('미리보기 실행')).toBeInTheDocument();
  });

  it('미리보기 모달에서 변수 입력 후 실행하면 결과를 표시한다', async () => {
    // Given
    mockPreviewMessageTemplate.mockResolvedValue({
      data: {
        type: 'EMAIL',
        subject: '홍길동님, 환영합니다!',
        content: '<p>안녕하세요 홍길동님</p>',
        unresolvedVariables: [],
      },
    });
    render(<MessageTemplateDetailClient />);
    await userEvent.click(screen.getByText('미리보기'));

    // When
    await userEvent.type(
      screen.getByLabelText('userName'),
      '홍길동',
    );
    await userEvent.click(screen.getByText('미리보기 실행'));

    // Then
    expect(screen.getByText('홍길동님, 환영합니다!')).toBeInTheDocument();
  });

  it('미리보기에서 미치환 변수가 있으면 경고를 표시한다', async () => {
    // Given
    mockPreviewMessageTemplate.mockResolvedValue({
      data: {
        type: 'EMAIL',
        subject: '{{userName}}님',
        content: '<p>{{companyName}}에서</p>',
        unresolvedVariables: ['userName', 'companyName'],
      },
    });
    render(<MessageTemplateDetailClient />);
    await userEvent.click(screen.getByText('미리보기'));

    // When
    await userEvent.click(screen.getByText('미리보기 실행'));

    // Then
    expect(screen.getByText(/미치환 변수/)).toBeInTheDocument();
  });

  it('발송 테스트 버튼 클릭 시 모달을 표시한다', async () => {
    // Given
    render(<MessageTemplateDetailClient />);

    // When
    await userEvent.click(screen.getByText('테스트 발송'));

    // Then
    expect(screen.getByText('발송 테스트')).toBeInTheDocument();
    expect(screen.getByLabelText(/이메일/)).toBeInTheDocument();
  });

  it('활성 Switch 토글 시 API를 호출한다', async () => {
    // Given
    render(<MessageTemplateDetailClient />);

    // When
    const switchEl = screen.getByRole('switch');
    await userEvent.click(switchEl);

    // Then
    expect(mockToggleStatusMessageTemplate).toHaveBeenCalledWith(
      mockEmailTemplate.id,
    );
  });
});
```

---

#### MT-L10-TST-013: ByteCounter 유닛 테스트

```typescript
describe('calculateSmsBytes', () => {
  it('영문만 있는 텍스트의 바이트 수를 계산한다', () => {
    // Given
    const text = 'Hello World';

    // When
    const result = calculateSmsBytes(text);

    // Then
    expect(result.bytes).toBe(11);
    expect(result.pages).toBe(1);
    expect(result.isOverflow).toBe(false);
  });

  it('한글 텍스트의 바이트 수를 계산한다', () => {
    // Given
    const text = '안녕하세요';

    // When
    const result = calculateSmsBytes(text);

    // Then
    expect(result.bytes).toBe(10); // 5글자 * 2바이트
    expect(result.pages).toBe(1);
  });

  it('혼합 텍스트의 바이트 수를 계산한다', () => {
    // Given
    const text = '인증코드는 123456입니다';

    // When
    const result = calculateSmsBytes(text);

    // Then
    // 한글 7자(14바이트) + 공백 1자(1바이트) + 숫자 6자(6바이트) = 21바이트
    expect(result.bytes).toBe(21);
    expect(result.pages).toBe(1);
  });

  it('90바이트 초과 시 2장으로 계산한다', () => {
    // Given
    const text = '가'.repeat(46); // 46 * 2 = 92바이트

    // When
    const result = calculateSmsBytes(text);

    // Then
    expect(result.bytes).toBe(92);
    expect(result.pages).toBe(2);
    expect(result.isOverflow).toBe(true);
  });

  it('빈 문자열은 0바이트, 1장으로 계산한다', () => {
    // When
    const result = calculateSmsBytes('');

    // Then
    expect(result.bytes).toBe(0);
    expect(result.pages).toBe(1);
  });
});
```

---

#### MT-L10-TST-014: 변수 정합성 검증 유닛 테스트

```typescript
describe('validateVariableConsistency', () => {
  it('본문과 변수 목록이 일치하면 경고가 없다', () => {
    // Given
    const content = '안녕하세요 {{userName}}님, {{orderNo}} 주문이 완료되었습니다';
    const variables = [
      { name: 'userName' },
      { name: 'orderNo' },
    ];

    // When
    const result = validateVariableConsistency(content, null, variables);

    // Then
    expect(result.undefinedVars).toHaveLength(0);
    expect(result.unusedVars).toHaveLength(0);
  });

  it('본문에 있지만 변수 목록에 없는 변수를 감지한다', () => {
    // Given
    const content = '{{userName}}님, {{companyName}}에서 알립니다';
    const variables = [{ name: 'userName' }];

    // When
    const result = validateVariableConsistency(content, null, variables);

    // Then
    expect(result.undefinedVars).toContain('companyName');
  });

  it('변수 목록에 있지만 본문에 없는 변수를 감지한다', () => {
    // Given
    const content = '안녕하세요 {{userName}}님';
    const variables = [
      { name: 'userName' },
      { name: 'unusedVar' },
    ];

    // When
    const result = validateVariableConsistency(content, null, variables);

    // Then
    expect(result.unusedVars).toContain('unusedVar');
  });

  it('subject도 포함하여 검증한다', () => {
    // Given
    const content = '본문입니다';
    const subject = '{{userName}}님에게';
    const variables = [{ name: 'userName' }];

    // When
    const result = validateVariableConsistency(content, subject, variables);

    // Then
    expect(result.undefinedVars).toHaveLength(0);
    expect(result.unusedVars).toHaveLength(0);
  });

  it('동일 변수가 여러 번 사용되어도 중복 없이 감지한다', () => {
    // Given
    const content = '{{userName}}님, 다시 {{userName}}님에게';
    const variables = [{ name: 'userName' }];

    // When
    const result = validateVariableConsistency(content, null, variables);

    // Then
    expect(result.undefinedVars).toHaveLength(0);
  });
});
```

---

### 테스트 커버리지 매트릭스

| 기능 | Happy Path | Error Path | Edge Case | 합계 |
|------|:----------:|:----------:|:---------:|:----:|
| 템플릿 등록 (create) | 1 | 2 | 1 (유형별 검증) | 4 |
| 템플릿 수정 (update) | 1 | 0 | 1 (변수 Set Semantics) | 2 |
| 템플릿 삭제 (remove) | 1 | 0 | 0 | 1 |
| 활성/비활성 토글 | 2 | 0 | 0 | 2 |
| 변수 치환 미리보기 | 2 | 0 | 1 (기본값 치환) | 3 |
| 발송 테스트 | 1 | 3 | 0 | 4 |
| 목록 조회 | 1 | 1 (인증없음) | 3 (필터/검색) | 5 |
| 상세 조회 | 1 | 1 (404) | 0 | 2 |
| 프론트 목록 페이지 | 3 | 0 | 4 (필터/검색/빈상태/토글) | 7 |
| 프론트 등록 폼 | 2 | 4 | 3 (유형전환/변수추가삭제) | 9 |
| 프론트 상세 페이지 | 4 | 0 | 3 (미리보기/발송/토글) | 7 |
| SMS 바이트 계산 | 3 | 0 | 2 (초과/빈문자열) | 5 |
| 변수 정합성 검증 | 1 | 0 | 4 (미정의/미사용/subject/중복사용) | 5 |
| **합계** | **23** | **11** | **22** | **56** |

---

### 테스트 실행 명령어

```bash
# 백엔드 유닛 테스트
pnpm --filter=server test -- message-template

# 백엔드 E2E 테스트
pnpm --filter=e2e test -- message-template

# 프론트엔드 테스트
pnpm --filter=admin test -- --run message-template

# 패키지 테스트 (유틸리티 함수)
pnpm --filter=@cocrepo/ui test -- --run ByteCounter
pnpm --filter=@cocrepo/ui test -- --run VariableEditTable
pnpm --filter=@cocrepo/ui test -- --run TemplateTypeChipCell
```

---

## Requirement Graph (L9-L10)

```json
{
  "level_range": "L9-L10",
  "nodes": [
    { "id": "MT-L9-LOG-001", "level": 9, "type": "logic", "label": "코드(code) 유니크 검증" },
    { "id": "MT-L9-LOG-002", "level": 9, "type": "logic", "label": "유형별 필드 검증 (subject/content 조건부)" },
    { "id": "MT-L9-LOG-003", "level": 9, "type": "logic", "label": "소프트 삭제 + 비활성화" },
    { "id": "MT-L9-LOG-004", "level": 9, "type": "logic", "label": "활성/비활성 토글" },
    { "id": "MT-L9-LOG-005", "level": 9, "type": "logic", "label": "변수 치환 미리보기 (기본값 fallback + 미치환 감지)" },
    { "id": "MT-L9-LOG-006", "level": 9, "type": "logic", "label": "발송 테스트 (비활성 차단 + 수신자 검증 + 유형별 발송)" },
    { "id": "MT-L9-LOG-007", "level": 9, "type": "logic", "label": "변수 업데이트 Set Semantics (트랜잭션)" },
    { "id": "MT-L9-LOG-008", "level": 9, "type": "logic", "label": "목록 조회 (소프트 삭제 필터링 + 검색 + 필터)" },
    { "id": "MT-L9-LOG-009", "level": 9, "type": "logic", "label": "변수 정합성 경고 (백엔드 보조)" },
    { "id": "MT-L9-LOG-010", "level": 9, "type": "logic", "label": "SMS 바이트 수 계산 (프론트엔드)" },
    { "id": "MT-L9-LOG-011", "level": 9, "type": "logic", "label": "변수 정합성 검증 (프론트엔드)" },
    { "id": "MT-L9-LOG-012", "level": 9, "type": "logic", "label": "등록/수정 폼 유효성 검증 (프론트엔드)" },
    { "id": "MT-L9-LOG-013", "level": 9, "type": "logic", "label": "유형별 폼 동적 전환 (프론트엔드)" },
    { "id": "MT-L9-LOG-014", "level": 9, "type": "logic", "label": "삭제 확인 다이얼로그 (프론트엔드)" },
    { "id": "MT-L9-LOG-015", "level": 9, "type": "logic", "label": "인라인 활성 토글 Optimistic UI (프론트엔드)" },
    { "id": "MT-L9-LOG-016", "level": 9, "type": "logic", "label": "발송 테스트 수신자 검증 (프론트엔드)" },
    { "id": "MT-L10-TST-001", "level": 10, "type": "test", "label": "MessageTemplateService 유닛 테스트" },
    { "id": "MT-L10-TST-002", "level": 10, "type": "test", "label": "MessageTemplateController E2E 테스트" },
    { "id": "MT-L10-TST-010", "level": 10, "type": "test", "label": "템플릿 목록 페이지 테스트" },
    { "id": "MT-L10-TST-011", "level": 10, "type": "test", "label": "템플릿 등록 폼 테스트" },
    { "id": "MT-L10-TST-012", "level": 10, "type": "test", "label": "템플릿 상세 페이지 테스트" },
    { "id": "MT-L10-TST-013", "level": 10, "type": "test", "label": "ByteCounter 유닛 테스트" },
    { "id": "MT-L10-TST-014", "level": 10, "type": "test", "label": "변수 정합성 검증 유닛 테스트" }
  ],
  "edges": [
    { "from": "MT-L6-API-003", "to": "MT-L9-LOG-001", "type": "implements" },
    { "from": "MT-L6-API-003", "to": "MT-L9-LOG-002", "type": "implements" },
    { "from": "MT-L6-API-004", "to": "MT-L9-LOG-002", "type": "implements" },
    { "from": "MT-L6-API-005", "to": "MT-L9-LOG-003", "type": "implements" },
    { "from": "MT-L6-API-006", "to": "MT-L9-LOG-004", "type": "implements" },
    { "from": "MT-L6-API-007", "to": "MT-L9-LOG-005", "type": "implements" },
    { "from": "MT-L6-API-008", "to": "MT-L9-LOG-006", "type": "implements" },
    { "from": "MT-L6-API-004", "to": "MT-L9-LOG-007", "type": "implements" },
    { "from": "MT-L6-API-001", "to": "MT-L9-LOG-008", "type": "implements" },
    { "from": "MT-L6-API-003", "to": "MT-L9-LOG-009", "type": "implements" },
    { "from": "MT-L6-API-004", "to": "MT-L9-LOG-009", "type": "implements" },
    { "from": "MT-L8-CMP-027", "to": "MT-L9-LOG-010", "type": "uses" },
    { "from": "MT-L8-CMP-029", "to": "MT-L9-LOG-011", "type": "uses" },
    { "from": "MT-L8-CMP-040", "to": "MT-L9-LOG-012", "type": "uses" },
    { "from": "MT-L5-ACT-017", "to": "MT-L9-LOG-013", "type": "implements" },
    { "from": "MT-L8-CMP-024", "to": "MT-L9-LOG-013", "type": "uses" },
    { "from": "MT-L5-ACT-011", "to": "MT-L9-LOG-014", "type": "implements" },
    { "from": "MT-L5-ACT-008", "to": "MT-L9-LOG-015", "type": "implements" },
    { "from": "MT-L8-CMP-011", "to": "MT-L9-LOG-015", "type": "uses" },
    { "from": "MT-L8-CMP-031", "to": "MT-L9-LOG-016", "type": "uses" },
    { "from": "MT-L9-LOG-001", "to": "MT-L10-TST-001", "type": "tested_by" },
    { "from": "MT-L9-LOG-002", "to": "MT-L10-TST-001", "type": "tested_by" },
    { "from": "MT-L9-LOG-003", "to": "MT-L10-TST-001", "type": "tested_by" },
    { "from": "MT-L9-LOG-004", "to": "MT-L10-TST-001", "type": "tested_by" },
    { "from": "MT-L9-LOG-005", "to": "MT-L10-TST-001", "type": "tested_by" },
    { "from": "MT-L9-LOG-006", "to": "MT-L10-TST-001", "type": "tested_by" },
    { "from": "MT-L6-API-001", "to": "MT-L10-TST-002", "type": "tested_by" },
    { "from": "MT-L6-API-002", "to": "MT-L10-TST-002", "type": "tested_by" },
    { "from": "MT-L6-API-003", "to": "MT-L10-TST-002", "type": "tested_by" },
    { "from": "MT-L6-API-004", "to": "MT-L10-TST-002", "type": "tested_by" },
    { "from": "MT-L6-API-005", "to": "MT-L10-TST-002", "type": "tested_by" },
    { "from": "MT-L6-API-006", "to": "MT-L10-TST-002", "type": "tested_by" },
    { "from": "MT-L6-API-007", "to": "MT-L10-TST-002", "type": "tested_by" },
    { "from": "MT-L6-API-008", "to": "MT-L10-TST-002", "type": "tested_by" },
    { "from": "MT-L3-FEA-001", "to": "MT-L10-TST-010", "type": "tested_by" },
    { "from": "MT-L3-FEA-002", "to": "MT-L10-TST-010", "type": "tested_by" },
    { "from": "MT-L3-FEA-003", "to": "MT-L10-TST-010", "type": "tested_by" },
    { "from": "MT-L3-FEA-004", "to": "MT-L10-TST-010", "type": "tested_by" },
    { "from": "MT-L3-FEA-010", "to": "MT-L10-TST-010", "type": "tested_by" },
    { "from": "MT-L3-FEA-007", "to": "MT-L10-TST-011", "type": "tested_by" },
    { "from": "MT-L3-FEA-013", "to": "MT-L10-TST-011", "type": "tested_by" },
    { "from": "MT-L3-FEA-005", "to": "MT-L10-TST-012", "type": "tested_by" },
    { "from": "MT-L3-FEA-006", "to": "MT-L10-TST-012", "type": "tested_by" },
    { "from": "MT-L3-FEA-009", "to": "MT-L10-TST-012", "type": "tested_by" },
    { "from": "MT-L3-FEA-011", "to": "MT-L10-TST-012", "type": "tested_by" },
    { "from": "MT-L3-FEA-012", "to": "MT-L10-TST-012", "type": "tested_by" },
    { "from": "MT-L9-LOG-010", "to": "MT-L10-TST-013", "type": "tested_by" },
    { "from": "MT-L9-LOG-011", "to": "MT-L10-TST-014", "type": "tested_by" }
  ]
}
```
