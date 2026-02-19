# Subject 관리 페이지 기획서

> 생성일: 2026-02-18
> 타입: page
> 경로: `/roles/[roleId]/abilities/[abilityId]/subjects`

## 사용자 시나리오

1. 관리자가 특정 역할의 특정 권한(Ability)에 대한 대상(Subject)을 관리하기 위해 페이지에 진입한다.
2. 현재는 플레이스홀더 상태로, "Subject 관리 기능은 추후 구현 예정입니다." 안내가 표시된다.
3. 권한 ID가 코드 형태로 표시된다.
4. "역할 상세로" 버튼으로 역할 상세 페이지로 돌아갈 수 있다.

## 레이아웃 구성

| 영역 | 컴포넌트 | 설명 |
|------|----------|------|
| 페이지 헤더 | PageSurface | title="Subject 관리", description="권한의 대상(Subject)을 관리합니다." |
| 헤더 액션 | Button | "역할 상세로" 버튼, ArrowLeft 아이콘 |
| 콘텐츠 | SectionSurface | 권한 ID 표시 + 미구현 안내 |

## 페이지 상태

| 상태 | 설명 | UI |
|------|------|-----|
| 플레이스홀더 | 미구현 상태 | 권한 ID + "추후 구현 예정" 안내 |

## API 호출

| 시점 | API | 설명 |
|------|-----|------|
| (없음) | - | TODO: prefetch ability data |

## 이벤트 핸들러

| 이벤트 | 동작 |
|--------|------|
| onClickBackButton | `/roles/${roleId}`로 이동 |

## 구현 체크리스트

- [x] page.tsx (서버 컴포넌트, HydrationBoundary만 적용)
- [x] _client.tsx (클라이언트 컴포넌트, observer, 플레이스홀더)
- [ ] 실제 Subject 관리 기능 구현 (미완료)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
