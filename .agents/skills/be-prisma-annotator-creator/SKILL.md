---
name: "be-prisma-annotator-creator"
description: "이 skill은 `be-prisma-annotator` 역할로 일할 때 사용합니다. Prisma schema에 한글 표시 이름 주석을 붙이는 방법을 쉽게 안내합니다."
---

# be-prisma-annotator-creator

`be-prisma-annotator`로 작업할 때 이 skill을 읽습니다.

## 작업 흐름

1. `.codex/agents/04-be-prisma-annotator.toml`에서 사용자 요청, 승인된 스펙, 소유 범위를 확인합니다.
2. 이 문서의 상세 작업 규칙을 확인합니다.
3. 배정된 대상에 맞는 섹션만 적용합니다. 프론트엔드 작업은 파일 경로로 Web/React Native 대상을 먼저 구분합니다.
4. 맡은 범위 안에서만 작업합니다. 다른 하위 에이전트의 파일이나 순서가 필요하면 멈추고 인계가 필요하다고 보고합니다.
5. 스펙이나 세부 규칙이 요구한 검증을 가능한 만큼 실행하고, 결과와 남은 위험을 짧게 정리합니다.

## 상세 작업 규칙

## 재사용 우선 점검 (필수)

- 작업을 시작하기 전에 반드시 기존 코드, 컴포넌트, 유틸, 스펙, 테스트를 먼저 검색합니다.
- 신규 생성 전에 기존 구현을 그대로 재사용하거나, 소폭 개선 후 재사용할 수 있는지 우선 판단합니다.
- 재사용 후보가 있으면 우선 채택하고, 신규 생성이 필요한 경우에는 재사용 불가 사유와 최소 변경 범위를 명확히 기록합니다.
- 동일 책임의 중복 구현을 금지합니다.


# Prisma Annotator

Prisma 스키마 파일에 `/// @displayName 한글명` 주석을 추가하는 전문가입니다.

`/// @displayName`은 설계 메타데이터가 아니라 DMMF에 보존되는 Prisma 문서 주석입니다. 이 작업은 다른 설계 메타데이터를 새로 만들지 않습니다.

메타데이터와 Prisma 문서 주석의 종류, 형식과 적용 범위는
`packages/be-prisma/docs/schema-metadata-guide.md`가 단독으로 소유합니다. 이 skill은 그 계약을 적용하는 작업 순서만 설명합니다.

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
| **입력** | Prisma 모델 스키마 파일 | `packages/be-prisma/schema/[!_]*.prisma` |
| | 한글 매핑 정보 | 모델명/필드명 → 한글명 대응 |
| **출력** | 주석이 추가된 스키마 | `/// @displayName 한글명` 주석 포함 |

---

## 3. 적용 규칙

1. 작업 전에 `packages/be-prisma/docs/schema-metadata-guide.md`의 현재 계약을 읽습니다.
2. 모든 model에는 가이드가 요구하는 한글 표시 이름을 적용합니다.
3. enum과 업무 field에는 사람이 읽는 한글 이름이 필요할 때 적용합니다.
4. Prisma 문서 주석은 설명 대상 model, enum 또는 field 선언의 바로 위에 둡니다.
5. 이 작업에서는 `/// @displayName`만 추가하거나 고치고 기존 model 설계 메타데이터는 변경하지 않습니다.
6. 형식, 대소문자와 한글 이름 규칙은 가이드의 예시를 그대로 따릅니다.

---

## 4. 프로세스

```
1. 스키마 파일 목록 확인
   └── ls packages/be-prisma/schema/[!_]*.prisma
   ↓
2. 각 파일 분석
   - 모델 목록 확인
   - 필드 목록 확인
   - 현재 설계 메타데이터와 Prisma 문서 주석 확인
   ↓
3. 주석 추가
   - 모든 모델에 가이드가 요구하는 Prisma 문서 주석 추가
   - 필요한 enum과 업무 필드에 Prisma 문서 주석 추가
   - 현재 메타데이터 계약 유지
   ↓
4. 검증
   - 메타데이터 가이드 계약 확인
   - 한글 매핑 일관성 확인
   - pnpm prisma validate 실행
```

---

## 5. 예시 사용 원칙

model header의 완전한 예시는 `packages/be-prisma/docs/schema-metadata-guide.md`만 사용합니다.

field나 enum을 작업할 때도 같은 가이드의 위치와 형식을 적용합니다. 이 skill에 별도 템플릿을 복사해 두지 않습니다.

---

## 6. 체크리스트

- [ ] 모든 모델 스키마 파일 확인 (`packages/be-prisma/schema/[!_]*.prisma`)
- [ ] 각 모델에 가이드가 요구하는 Prisma 문서 주석 적용
- [ ] 필요한 enum과 업무 필드에 Prisma 문서 주석 적용
- [ ] 현재 메타데이터 계약 유지 확인
- [ ] 메타데이터 가이드의 형식과 위치 검증
- [ ] 한글 매핑 일관성 확인
- [ ] `pnpm prisma validate` 실행하여 스키마 유효성 확인

---

## 7. 연관 에이전트

| 구분 | 에이전트 | 설명 |
|------|----------|------|
| **선행** | schema-builder | Prisma 스키마 생성 |
| **후행** | dmmf-parser-builder | `/// @displayName` Prisma 문서 주석을 파싱하는 유틸리티 생성 |
| | service-builder | 동기화 서비스에서 displayName 활용 |
| **관련** | database-expert | 스키마 설계 자문 |

---

## 8. 프로젝트별 참고사항

### 대상 파일

```
packages/be-prisma/schema/[!_]*.prisma
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
| Space | 공간 |
| Task | 과업 |
| FitnessCenter | Space와 1:1로 연결되는 시설 |
| Exercise | Task 하위 운동 |
| Session | 세션 |
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
- SubjectSyncService: `packages/be-service/src/subject-sync/subject-sync.service.ts`
