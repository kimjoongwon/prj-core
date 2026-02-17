# MessageTemplate Progress

## Stage 1: 기획
- [x] L0-L2 기획 (01-overview.md)
- [x] L3-L4 기획 (02-structure.md) - 2026-02-17
  - L3: 13개 기능 (FEA-001~013)
  - L4: 4개 화면 (SCR-001~004)
- [x] L5-L6 기획 (03-interactions.md) - 2026-02-17
  - L5: 25개 인터랙션 (ACT-001~025), 4개 화면별 액션 정의
  - L6: 8개 API (API-001~008), 상세 스키마 포함
- [x] L7-L8 기획 (04-ui-details.md) - 2026-02-17
  - L7: 2개 엔티티 (MessageTemplate, TemplateVariable), 1개 Enum, 19개 필드, 9개 DTO
  - L8: 15개 컴포넌트 (Cell 2, Widget 11, Feature 2), 기존 재사용 9개
- [x] L9-L10 기획 (05-technical-design.md) - 2026-02-17
  - L9: 16개 비즈니스 로직 (백엔드 9개 + 프론트엔드 7개)
  - L10: 7개 테스트 스위트 (백엔드 2개 + 프론트엔드 5개), 총 56개 테스트 케이스
- [ ] 사용자 리뷰

## Stage 2: 스키마
- [ ] Prisma 스키마 (MessageTemplate, TemplateVariable)
- [ ] Entity 클래스
- [ ] DTO 클래스
- [ ] Query DTO 클래스
- [ ] Repository 클래스
- [ ] Seed 데이터
- [ ] 사용자 리뷰

## Stage 3: 백엔드
- [ ] MessageTemplateService
- [ ] TemplateVariableService
- [ ] MessageTemplateController + Module
- [ ] AppModule 라우팅 등록
- [ ] 사용자 리뷰

## Stage 4: 컴포넌트 (페이지별)
- [ ] TemplateList 컴포넌트
- [ ] TemplateDetail 컴포넌트
- [ ] TemplateCreate 컴포넌트
- [ ] TemplateEdit 컴포넌트

## Stage 5: 페이지 (페이지별)
- [ ] TemplateList 페이지
- [ ] TemplateDetail 페이지
- [ ] TemplateCreate 페이지
- [ ] TemplateEdit 페이지
