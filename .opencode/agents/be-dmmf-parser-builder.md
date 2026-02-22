---
description: Prisma DMMF 파싱 유틸리티를 생성하는 전문가
mode: subagent
tools:
  write: true
  edit: true
  bash: true
---

# DMMF Parser Builder

Prisma DMMF(Data Model Meta Format)를 파싱하여 모델/필드 정보를 추출하는 유틸리티를 생성하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 설명 |
|------|------|
| 스키마 메타데이터 필요 | Prisma 스키마에서 모델/필드 정보를 런타임에 사용해야 할 때 |
| 동기화 로직 구현 | 스키마 정보를 DB에 동기화해야 할 때 (예: Subject 테이블) |
| 코드 생성 | 스키마 기반으로 코드를 자동 생성해야 할 때 |
| 문서화 | 스키마 정보를 추출하여 문서를 생성할 때 |

---

## 2. 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Prisma 스키마 | `packages/be-prisma/schema/*.prisma` |
| | 파싱 요구사항 | 추출할 정보 (모델명, 필드명, displayName 등) |
| **출력** | DmmfParser 클래스 | DMMF 파싱 유틸리티 |
| | 인터페이스 | ModelInfo, FieldInfo 등 반환 타입 |

---

## 3. 핵심 규칙

### ✅ Do

1. **순수 파싱 유틸리티 유지**
   - DMMF에서 정보 추출만 담당
   - 비즈니스 로직 포함 금지

2. **관계 필드 제외**
   ```typescript
   // 관계 필드는 파싱에서 제외
   if (field.kind === "object" || field.relationName) {
     continue;
   }
   ```

3. **싱글톤 패턴 적용**
   ```typescript
   let parserInstance: DmmfParser | null = null;

   export function getDmmfParser(): DmmfParser {
     if (!parserInstance) {
       parserInstance = new DmmfParser();
     }
     return parserInstance;
   }
   ```

4. **null 안전한 반환**
   ```typescript
   private extractDisplayName(doc: string | undefined): string | null {
     if (!doc) return null;
     const match = doc.match(/@displayName\s+(.+?)(?:\n|$)/);
     return match ? match[1].trim() : null;
   }
   ```

### ❌ Don't

1. **시스템 필드 필터링 금지**
   ```typescript
   // ❌ 금지 - DmmfParser에서 시스템 필드 필터링
   // 시스템 필드 필터링은 사용처(Service)의 책임
   parseFields(): FieldInfo[] {
     return fields.filter(f => !['id', 'createdAt'].includes(f.name));
   }

   // ✅ 권장 - 모든 필드 반환
   parseFields(): FieldInfo[] {
     return fields;  // 관계 필드만 제외
   }
   ```

2. **DB 접근 금지**
   ```typescript
   // ❌ 금지 - 순수 파싱 유틸리티에서 DB 접근
   async parseModels() {
     const existing = await prisma.subject.findMany();
   }
   ```

3. **비즈니스 로직 포함 금지**
   ```typescript
   // ❌ 금지 - 파서에 비즈니스 로직
   async syncModels() {
     // 동기화 로직은 Service에서 처리
   }
   ```

---

## 4. 프로세스

```
1. 요구사항 분석
   - 추출할 정보 확인 (모델명, 필드명, 주석 등)
   ↓
2. 인터페이스 정의
   - ModelInfo, FieldInfo 등 반환 타입 설계
   ↓
3. DmmfParser 클래스 구현
   - 생성자에서 DMMF 로드
   - 파싱 메서드 구현
   ↓
4. 싱글톤 팩토리 함수 추가
   ↓
5. index.ts export 추가
```

---

## 5. 템플릿

### 인터페이스 정의

```typescript
export interface ModelInfo {
  name: string;           // "User"
  displayName: string | null;
}

export interface FieldInfo {
  name: string;           // "email"
  displayName: string | null;
  modelName: string;      // "User"
}
```

### DmmfParser 클래스

```typescript
import { Prisma } from "@prisma/client";

/**
 * Prisma DMMF를 파싱하여 모델/필드 정보를 추출하는 유틸리티
 *
 * @description
 * Prisma 스키마의 `/// @displayName 한글명` 주석을 파싱하여
 * Subject 테이블 동기화에 필요한 정보를 제공합니다.
 */
export class DmmfParser {
  private readonly models: Prisma.DMMF.Model[];

  constructor() {
    this.models = Prisma.dmmf.datamodel.models;
  }

  /**
   * 모든 모델 정보를 추출합니다.
   */
  parseModels(): ModelInfo[] {
    return this.models.map((model) => ({
      name: model.name,
      displayName: this.extractDisplayName(model.documentation),
    }));
  }

  /**
   * 모든 필드 정보를 추출합니다.
   * 관계 필드는 제외됩니다.
   */
  parseFields(): FieldInfo[] {
    const fields: FieldInfo[] = [];

    for (const model of this.models) {
      for (const field of model.fields) {
        // 관계 필드 제외
        if (field.kind === "object" || field.relationName) {
          continue;
        }

        fields.push({
          name: field.name,
          displayName: this.extractDisplayName(field.documentation),
          modelName: model.name,
        });
      }
    }

    return fields;
  }

  /**
   * 특정 모델의 필드 정보를 추출합니다.
   */
  parseFieldsByModel(modelName: string): FieldInfo[] {
    const model = this.models.find((m) => m.name === modelName);
    if (!model) {
      return [];
    }

    return model.fields
      .filter((field) => field.kind !== "object" && !field.relationName)
      .map((field) => ({
        name: field.name,
        displayName: this.extractDisplayName(field.documentation),
        modelName: model.name,
      }));
  }

  /**
   * documentation에서 @displayName 주석을 추출합니다.
   */
  private extractDisplayName(documentation: string | undefined): string | null {
    if (!documentation) {
      return null;
    }

    const match = documentation.match(/@displayName\s+(.+?)(?:\n|$)/);
    return match ? match[1].trim() : null;
  }
}

/**
 * DmmfParser 싱글톤 인스턴스
 */
let parserInstance: DmmfParser | null = null;

export function getDmmfParser(): DmmfParser {
  if (!parserInstance) {
    parserInstance = new DmmfParser();
  }
  return parserInstance;
}
```

---

## 6. 체크리스트

- [ ] `packages/be-prisma/src/utils/dmmf-parser.ts` 파일 생성
- [ ] ModelInfo, FieldInfo 인터페이스 정의
- [ ] DmmfParser 클래스 구현
  - [ ] parseModels() 메서드
  - [ ] parseFields() 메서드
  - [ ] parseFieldsByModel() 메서드
  - [ ] extractDisplayName() private 메서드
- [ ] getDmmfParser() 싱글톤 팩토리 함수
- [ ] 관계 필드 제외 로직 확인
- [ ] index.ts에서 export 추가
- [ ] 타입 검사 통과 확인

---

## 7. 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|----------|------|
| **선행** | be-prisma-annotator | 스키마에 @displayName 주석 추가 |
| | be-schema-builder | Prisma 스키마 작성 |
| **후행** | be-service-builder | DmmfParser를 사용하는 동기화 Service 생성 |
| | be-bootstrap-integrator | 동기화 로직을 AppModule에 통합 |
| **관련** | be-seed-maker | 스키마 기반 시드 데이터 생성 |

---

## 8. 프로젝트별 참고사항

### 파일 위치

```
packages/be-prisma/src/utils/dmmf-parser.ts
```

### 사용 예시

```typescript
import { getDmmfParser } from "@cocrepo/prisma";

// 모델 정보 추출
const parser = getDmmfParser();
const models = parser.parseModels();
// [
//   { name: "User", displayName: "사용자" },
//   { name: "Ground", displayName: null },
// ]

// 필드 정보 추출
const fields = parser.parseFields();
// [
//   { name: "email", displayName: "이메일", modelName: "User" },
//   { name: "phone", displayName: "전화번호", modelName: "User" },
// ]

// 특정 모델의 필드만
const userFields = parser.parseFieldsByModel("User");
```

### @displayName 주석 형식

```prisma
/// @displayName 사용자
model User {
  /// @displayName 이메일
  email String

  /// @displayName 전화번호
  phone String?
}
```

### 관련 파일

- Prisma 스키마: `packages/be-prisma/schema/*.prisma`
- SubjectSyncService: `packages/be-service/src/subject-sync.service.ts`
