### 프론트엔드 프로젝트 생성규칙

- 상태도구를 mobx를 사용합니다.
- log를 달때 @cocrepo/toolkit logger를 이용합니다.
- folder 경로 apps/admin packages/shared-frontend
- 테스트 코드를 먼저 작성후 작업해주세요.
- Text 컴포넌트를 사용합니다.
- 컴포넌트를 만들때 @cocrepo/frontend 컴포넌트를 활용하고 없으면 @heroui/react 컴포넌트를 사용해주세요.
- 컴포넌트 props는 전부 @cocrepo/types로 옮겨주세요.
- 컴포넌트 생성은 모두 다크모드와 라이트모드를 고려합니다.

### 백엔드 프로젝트 생성규칙

- folder 경로는 apps/server 입니다.

### 라이브러리관련 수정

- storybook은 최신버전인 9를 사용합니다.
- 최신 문서를 꼭 확인해서 작업해주세요.
- vitest도 최신버전을 사용하고 있으니 문서 기준으로 작업해주세요.


### 공통 규칙
- 모든 로직은 service단에 들어갑니다.


### 서비스 네임 규칙

- 프론엔드는 store
- 백엔드는 service

이렇게 부릅니다.