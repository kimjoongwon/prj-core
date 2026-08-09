# Service 문서 원칙

서비스별 delivery 문서는 기본 산출물이 아닙니다.

- UI 작업의 계약 근거는 인접한 app.context.md, 실제 route와 shared UI 구현, 공개 export와 테스트입니다.
- 화면 composition, props/event와 상태별 렌더링은 해당 owner의 코드와 테스트가 소유합니다.
- Screen, Feature, Form과 Widget을 위한 별도 planning 문서를 만들지 않습니다.
- Cross-route 서비스 설명이 명시적으로 필요한 경우에만 일반 Markdown 문서를 만들고 코드 owner 계약을 중복하지 않습니다.
