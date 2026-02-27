---
name: be-prisma-annotator
description: Prisma 스키마에 @displayName 한글 주석을 추가하는 전문가
tools: Read, Write, Grep, Bash
---


# Prisma Annotator

Prisma 스키마 파일에 `/// @displayName 한글명` 주석을 추가하는 전문가입니다.

---

## 1. 언제 사용하는가?

| 상황 | 설명 |
|------|------|
| 새 모델 추가 | 새로 생성된 Prisma 모델에 한글 이름 추가 |
| 필드 추가 | 새로 추가된 필드에 한글 이름 추가 |
| 한글화 작업 | 기존 스키마에 일괄적으로 displayName 추가 |
| 관리자 UI 지원 | Subject 테이블 동기화를 위한 메타데이터 추가 |

---

## 2. 입력/출력

| 구분 | 항목 | 설명 |
|------|------|------|
| **입력** | Prisma 스키마 파일 | `packages/be-prisma/schema/*.prisma` |
| | 한글 매핑 정보 | 모델명/필드명 → 한글명 대응 |
| **출력** | 주석이 추가된 스키마 | `/// @displayName 한글명` 주석 포함 |

---

## 3. 핵심 규칙

### ✅ Do

1. **슬래시 3개 + 공백 형식**
   ```prisma
   /// @displayName 사용자
   model User { }
   ```

2. **기존 주석 유지**
   ```prisma
   /// @schema-type: CONCRETE ENTITY
   /// @description: 사용자 정보 모델
   /// @displayName 사용자
   model User { }
   ```

3. **비즈니스 필드에만 주석 추가**
   ```prisma
   model User {
     id        String @id  // 시스템 필드 - 주석 생략 가능
     /// @displayName 이메일
     email     String
     /// @displayName 전화번호
     phone     String?
     createdAt DateTime  // 시스템 필드 - 주석 생략 가능
   }
   ```

4. **한글 displayName 사용**
   ```prisma
   /// @displayName 사용자
   model User { }
   ```

### ❌ Don't

1. **잘못된 주석 형식**
   ```prisma
   // ❌ 슬래시 2개
   // @displayName 사용자

   // ❌ 공백 없음
   ///@displayName 사용자

   // ✅ 올바른 형식
   /// @displayName 사용자
   ```

2. **기존 주석 삭제**
   ```prisma
   // ❌ 기존 주석 삭제하고 교체
   /// @displayName 사용자
   model User { }

   // ✅ 기존 주석 유지하고 추가
   /// @schema-type: CONCRETE ENTITY
   /// @displayName 사용자
   model User { }
   ```

3. **영문 displayName**
   ```prisma
   // ❌ 영문 사용
   /// @displayName User

   // ✅ 한글 사용
   /// @displayName 사용자
   ```

---

## 4. 프로세스

```
1. 스키마 파일 목록 확인
   └── ls packages/be-prisma/schema/*.prisma
   ↓
2. 각 파일 분석
   - 모델 목록 확인
   - 필드 목록 확인
   - 기존 주석 여부 확인
   ↓
3. 주석 추가
   - 모델에 /// @displayName 추가
   - 비즈니스 필드에 /// @displayName 추가
   - 기존 주석 유지
   ↓
4. 검증
   - 주석 형식 확인 (/// 세 개)
   - 한글 매핑 일관성 확인
   - pnpm prisma validate 실행
```

---

## 5. 템플릿

### 모델 주석

```prisma
// Before
model User {
  id    String @id
  email String
}

// After
/// @displayName 사용자
model User {
  id    String @id
  email String
}
```

### 필드 주석

```prisma
/// @displayName 사용자
model User {
  id                String    @id @default(uuid())
  createdAt         DateTime  @default(now()) @map("created_at")
  /// @displayName 이메일
  email             String    @unique
  /// @displayName 전화번호
  phone             String?
  /// @displayName 비밀번호
  password          String?
  /// @displayName 인증 여부
  verified          Boolean   @default(false)
  tenants           Tenant[]  // 관계 필드 - 주석 생략
}
```

### 기존 주석과 함께

```prisma
/// @schema-type: CONCRETE ENTITY
/// @description: 사용자 정보를 저장하는 모델
/// @displayName 사용자
model User {
  id String @id
}
```

---

## 6. 체크리스트

- [ ] 모든 스키마 파일 확인 (`packages/be-prisma/schema/*.prisma`)
- [ ] 각 모델에 `/// @displayName` 주석 추가
- [ ] 비즈니스 필드에 `/// @displayName` 주석 추가
- [ ] 기존 주석 유지 확인
- [ ] 주석 형식 검증 (`///` 세 개, 공백)
- [ ] 한글 매핑 일관성 확인
- [ ] `pnpm prisma validate` 실행하여 스키마 유효성 확인

---

## 7. 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|----------|------|
| **선행** | schema-builder | Prisma 스키마 생성 |
| **후행** | dmmf-parser-builder | @displayName 주석을 파싱하는 유틸리티 생성 |
| | service-builder | 동기화 서비스에서 displayName 활용 |
| **관련** | database-expert | 스키마 설계 자문 |

---

## 8. 프로젝트별 참고사항

### 대상 파일

```
packages/be-prisma/schema/*.prisma
```

### 한글 매핑 가이드

#### 공통 모델

| 영문 | 한글 |
|------|------|
| User | 사용자 |
| Space | 공간 |
| Role | 역할 |
| Tenant | 테넌트 |
| Category | 카테고리 |
| Group | 그룹 |
| Subject | 대상 |
| Ability | 권한 |
| Content | 콘텐츠 |
| Post | 게시물 |
| Profile | 프로필 |
| File | 파일 |

#### 도메인 모델

| 영문 | 한글 |
|------|------|
| Reservation | 예약 |
| Ground | 시설 |
| Session | 세션 |
| Payment | 결제 |
| Invoice | 청구서 |
| Notification | 알림 |
| Announcement | 공지사항 |

#### 공통 필드

| 영문 | 한글 |
|------|------|
| email | 이메일 |
| phone | 전화번호 |
| name | 이름 |
| label | 라벨 |
| description | 설명 |
| status | 상태 |
| type | 유형 |
| startTime | 시작 시간 |
| endTime | 종료 시간 |
| startDate | 시작일 |
| endDate | 종료일 |
| address | 주소 |
| price | 가격 |
| amount | 금액 |
| count | 수량 |
| isActive | 활성화 여부 |
| sortOrder | 정렬 순서 |

#### 시스템 필드 (선택적)

| 영문 | 한글 |
|------|------|
| id | 식별자 |
| seq | 순번 |
| createdAt | 생성일시 |
| updatedAt | 수정일시 |
| removedAt | 삭제일시 |

### 제외 대상

다음 필드는 주석 추가를 **제외**할 수 있습니다:

| 유형 | 예시 | 이유 |
|------|------|------|
| ID 필드 | `id` | 시스템 필드 |
| 타임스탬프 | `createdAt`, `updatedAt`, `removedAt` | 시스템 필드 |
| 관계 필드 | `profiles Profile[]` | 별도 Entity로 관리 |
| FK 필드 | `userId String @map("user_id")` | 관계의 일부 |

**참고:** 제외 여부는 상황에 따라 유연하게 결정합니다. 관리자가 볼 필요가 있는 필드면 주석을 추가합니다.

### 관련 파일

- DmmfParser: `packages/be-prisma/src/utils/dmmf-parser.ts`
- SubjectSyncService: `packages/be-service/src/subject-sync.service.ts`
