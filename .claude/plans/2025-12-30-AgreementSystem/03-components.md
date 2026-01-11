# 신규 컴포넌트

> 상위 문서: [README.md](./README.md)

---

## 1. AgreementFormModal

**플랫폼:** Web (Admin only)

**경로:** `packages/ui/src/components/ui/AgreementFormModal/`

**Props:**
```typescript
{
  isOpen: boolean
  agreement?: Agreement
  onClose: () => void
  onSave: (data: AgreementFormData) => Promise<void>
}
```

**기능:**
- 약관 제목, 종류, 버전, 필수 여부, 시행일, 내용 입력
- Rich Text Editor 또는 Textarea
- 수정 시 버전 자동 증가 제안
- 유효성 검증

---

## 2. AgreementHistoryModal

**플랫폼:** Web (Admin only)

**경로:** `packages/ui/src/components/ui/AgreementHistoryModal/`

**Props:**
```typescript
{
  isOpen: boolean
  agreementTitle: string
  history: Agreement[]
  onClose: () => void
}
```

**기능:**
- 타임라인 형태로 버전 이력 표시
- 각 버전 클릭 시 내용 미리보기

---

## 3. AgreementDetailModal / AgreementDetailBottomSheet

**플랫폼:** Web + Mobile

**Web 경로:** `packages/ui/src/components/ui/AgreementDetailModal/`
**Mobile 경로:** `packages/mobile-ui/src/components/AgreementDetailBottomSheet/`

**Props:**
```typescript
{
  isOpen: boolean
  agreement: Agreement | null
  onClose: () => void
}
```

**기능:**
- 약관 전문 표시
- 스크롤 가능
- **Web**: 모달 형태 (80% 화면)
- **Mobile**: 하단 시트 또는 전체 화면 모달

---

## 4. AgreementConsentItem

**플랫폼:** Web + Mobile (공통)

**경로:** `packages/ui/src/components/ui/AgreementConsentItem/`

**Props:**
```typescript
{
  agreement: Agreement
  isChecked: boolean
  onCheck: (agreementId: string) => void
  onViewDetail: (agreementId: string) => void
  variant?: 'web' | 'mobile'  // 플랫폼별 스타일 조정
}
```

**기능:**
- 약관 제목, 필수/선택 표시
- 체크박스
- 상세보기 버튼/아이콘
- 플랫폼별 크기 및 스타일 조정
