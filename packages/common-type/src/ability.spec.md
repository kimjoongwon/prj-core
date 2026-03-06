# ability type 기획서

> 생성일: 2026-03-06
> 타입: type
> 위치: packages/common-type/src/ability.ts

## 역할

프론트엔드 CASL 권한 모델의 공용 타입 계약을 정의합니다.  
도메인 로직은 `@cocrepo/store`에 두고, 여러 패키지에서 재사용되는 타입만 이 파일에 유지합니다.

## 구성 요소

| 항목 | 설명 |
|------|------|
| APP_ACTIONS | 프론트 표준 액션 상수 |
| AppAction | 프론트 표준 액션 유니온 타입 |
| AppSubject | 권한 Subject 타입 |
| AbilityRule | Store 표준 권한 규칙 타입 |
| AbilityApiResponse | API 응답 매핑 입력 타입 |

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-06 | CASL 공용 타입을 fe-store/fe-hook에서 분리해 common-type으로 이관 | codex |
