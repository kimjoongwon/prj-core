# 제안서 페이지 버튼 계약

- 기존 제안서 페이지 구성과 섹션 이동·테마 변경 동작을 유지한다.
- `@cocrepo/ui`의 `Button`은 HeroUI v3 계약을 따르므로 주요 액션은 `variant="primary"`, 내비게이션·테마 변경·보조 액션은 `variant="secondary"`를 사용한다.
- 기존 크기, 아이콘과 페이지별 스타일을 유지한다. 제거된 `color`와 `variant="flat"` Button 속성은 사용하지 않는다.
- 앱 타입 검사와 lint로 공용 Button 계약 연결을 검증한다. 이 수정은 신규 화면·라우팅·SSR/prefetch 구조를 도입하지 않는다.
