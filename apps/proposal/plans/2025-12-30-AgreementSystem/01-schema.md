# 스키마 설계

> 상위 문서: [README.md](./README.md)

---

## 1. Agreement (약관)

```prisma
model Agreement {
  id          String              @id @default(uuid())
  seq         Int                 @unique @default(autoincrement())
  createdAt   DateTime            @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime?           @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime?           @map("removed_at") @db.Timestamptz(6)

  // 약관 정보
  title       String              // 약관 제목 (예: "서비스 이용약관")
  type        AgreementType       // 약관 종류
  version     String              // 버전 (예: "1.0.0")
  content     String              @db.Text // 약관 내용 (HTML 형식)
  isRequired  Boolean             @default(true) // 필수 여부
  isActive    Boolean             @default(true) // 활성화 여부 (최신 버전만 true)
  effectiveAt DateTime            @map("effective_at") @db.Timestamptz(6) // 시행일

  // Relations
  consents    UserAgreementConsent[]

  @@map("agreements")
}
```

---

## 2. UserAgreementConsent (사용자 약관 동의)

```prisma
model UserAgreementConsent {
  id          String     @id @default(uuid())
  seq         Int        @unique @default(autoincrement())
  createdAt   DateTime   @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt   DateTime?  @updatedAt @map("updated_at") @db.Timestamptz(6)
  removedAt   DateTime?  @map("removed_at") @db.Timestamptz(6)

  userId      String     @map("user_id")
  agreementId String     @map("agreement_id")
  agreed      Boolean    @default(false) // 동의 여부
  agreedAt    DateTime?  @map("agreed_at") @db.Timestamptz(6) // 동의 시각
  ipAddress   String?    @map("ip_address") // 동의 시 IP (법적 증빙)

  user        User       @relation(fields: [userId], references: [id])
  agreement   Agreement  @relation(fields: [agreementId], references: [id])

  @@unique([userId, agreementId])
  @@map("user_agreement_consents")
}
```

---

## 3. AgreementType Enum

```prisma
enum AgreementType {
  TERMS_OF_SERVICE      // 서비스 이용약관
  PRIVACY_POLICY        // 개인정보 처리방침
  MARKETING_CONSENT     // 마케팅 정보 수신 동의
  LOCATION_CONSENT      // 위치 기반 서비스 이용약관
  THIRD_PARTY_SHARING   // 제3자 정보 제공 동의
}
```

---

## 4. User 모델 업데이트 필요

```prisma
model User {
  // ... 기존 필드
  agreementConsents UserAgreementConsent[]  // 추가
}
```
