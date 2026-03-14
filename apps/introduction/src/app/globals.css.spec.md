# globals.css 기획서

> 생성일: 2026-03-12
> 타입: style
> 위치: apps/introduction/src/app/globals.css

## 역할

소개 랜딩의 전역 시각 규칙을 정의합니다.
Pretendard 타이포, 다크 배경, 블러 오브, 그리드 텍스처, 기본 줄간격을 이 파일에서 고정합니다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| `body` | Pretendard 폰트, 다크 배경, 기본 줄간격 적용 |
| `body::before` | 배경 그리드 텍스처 오버레이 |
| `.font-display` | 헤드라인도 Pretendard 계열로 통일 |
| `:root` | 랜딩 전용 border/surface 토큰 선언 |

## 구현 체크리스트

- [x] Tailwind + HeroUI source 연결
- [x] Pretendard 폰트 적용
- [x] 다크 기본 배경과 블러 오브 유지
- [x] 읽기 밀도를 위한 기본 줄간격 보정

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-14 | Tailwind 지시문과 전역 배경 스타일의 Biome 포맷을 정리해 introduction 앱 lint 기준과 스타일 자산을 동기화 | codex |
| 2026-03-12 | introduction 전역 스타일 기획서 신규 생성 | codex |
