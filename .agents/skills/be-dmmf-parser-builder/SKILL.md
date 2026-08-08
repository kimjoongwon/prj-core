---
name: "be-dmmf-parser-builder"
description: "이 skill은 `be-dmmf-parser-builder` 역할로 일할 때 사용합니다. Prisma DMMF 파싱 유틸을 만드는 방법을 쉽게 안내합니다. 이 단위 작업을 직접 요청받았거나 관련 custom agent가 수행할 때 사용하며, 구현과 기본 검증을 독립적으로 완료합니다."
---

# be-dmmf-parser-builder

# DMMF parser 빌더

Prisma DMMF(Data Model Meta Format)를 파싱하여 모델/필드 정보를 추출하는 유틸리티를 생성하는 전문가입니다.

이 parser가 읽는 메타데이터는 DMMF의 `documentation`에 보존된 `/// @displayName 한글명` Prisma 문서 주석입니다. 슬래시 2개(`//`)로 작성하는 모델 설계 메타데이터는 DMMF 문서 입력으로 취급하지 않습니다.

---

## 1. 언제 사용하는가?

| 상황 | 설명 |
|------|------|
| Prisma 문서 정보 필요 | DMMF에 보존된 모델/필드 표시명을 런타임에 사용해야 할 때 |
| 동기화 로직 구현 | 스키마 정보를 DB에 동기화해야 할 때 (예: Subject 테이블) |
| 코드 생성 | 스키마 기반으로 코드를 자동 생성해야 할 때 |
| 문서화 | 스키마 정보를 추출하여 문서를 생성할 때 |

---

## 2. 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Prisma DMMF | `packages/be-prisma/schema/*.prisma`에서 생성된 DMMF |
| | Prisma 문서 주석 | `/// @displayName 한글명` |
| | 파싱 요구사항 | 추출할 정보 (모델명, 필드명, 표시명 등) |
| **출력** | DmmfParser 클래스 | DMMF 파싱 유틸리티 |
| | 인터페이스 | ModelInfo, FieldInfo 등 반환 타입 |

---

## 3. 핵심 규칙

### ✅ 권장

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

### ❌ 금지

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
   - 추출할 정보 확인 (모델명, 필드명, Prisma 문서 주석 등)
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
   * DMMF documentation에서 `/// @displayName` Prisma 문서 주석을 추출합니다.
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
| **선행** | prisma-annotator | 스키마에 `/// @displayName` Prisma 문서 주석 추가 |
| | schema-builder | Prisma 스키마 작성 |
| **후행** | service-builder | DmmfParser를 사용하는 동기화 Service 생성 |
| | bootstrap-integrator | 동기화 로직을 AppModule에 통합 |
| **관련** | seed-maker | 스키마 기반 시드 데이터 생성 |

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
//   { name: "Space", displayName: "공간" },
//   { name: "Task", displayName: "과업" },
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

### Prisma 문서 주석 형식

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
- SubjectSyncService: `packages/be-service/src/subject-sync/subject-sync.service.ts`

## 단독 실행 계약

- 오케스트레이션 실행 문맥이 없어도 요청과 프로젝트 파일을 근거로 이 skill의 단위 작업을 수행한다.
- 입력 경로가 명시되지 않으면 현재 프로젝트에서 관련 모델, spec, 타입, 기존 구현과 선행 산출물을 먼저 찾는다.
- 필수 입력을 구현 전에 확인하고 자신의 소유 범위에서 만들 수 있는 입력은 직접 만든다.
- 다른 owner의 필수 산출물이나 제품 결정이 없으면 구현을 시작하지 않고 변경 없이 `입력 필요`로 보고한다.
- 다른 custom agent나 subagent를 호출하거나 실행 순서를 결정하지 않는다.
- 이 skill에 정의된 기본 검증을 실제로 실행하고 요청의 추가 완료 기준까지 확인한다.
- 구현 후 검증을 통과하지 못하면 변경 산출물과 실패 근거를 포함해 `검증 실패`로 보고한다.
- 최종 메시지는 `AGENTS.md`의 Worker 최종 보고 Markdown 계약을 따른다.
