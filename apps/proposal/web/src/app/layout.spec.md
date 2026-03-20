# layout.tsx 기획서

> 생성일: 2026-03-12
> 타입: layout
> 위치: apps/proposal/web/src/app/layout.tsx

## 역할

소개 앱의 루트 HTML, 메타데이터, 전역 폰트 및 Provider 연결을 정의합니다.
정적 랜딩의 브랜드 톤을 라이트 기본으로 두되, 저장된 사용자 선택 또는 OS 선호도에 따라 다크 모드도 안정적으로 초기화합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `metadata.title` | `자자 | AI 중심 외주 개발 스튜디오` |
| `metadata.description` | AI 중심 외주 개발 방식 설명 |
| `html.lang` | `ko` |
| `html` | `suppressHydrationWarning` 적용 |
| `head > link` | Pretendard CDN 스타일시트 주입 |
| `beforeInteractive script` | `proposal-web-theme` 키 기준 초기 테마 부트스트랩 |

## 의존성

| 모듈 | 용도 |
|------|------|
| `./providers` | HeroUI 디자인 시스템 제공 |
| `./globals.css` | 랜딩 전역 스타일 적용 |

## 구현 체크리스트

- [x] metadata 정의
- [x] Pretendard 웹폰트 적용
- [x] 초기 테마 부트스트랩 적용
- [x] Providers 연결

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-20 | 라이트 기본 + 다크 지원을 위해 hydration-safe HTML 설정과 초기 테마 스크립트를 추가 | codex |
| 2026-03-12 | proposal-web 루트 layout 신규 생성 | codex |
| 2026-03-12 | Pretendard 폰트 링크를 적용하고 레이아웃 계약을 갱신 | codex |
