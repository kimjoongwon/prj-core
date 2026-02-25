# Proposal App

프로젝트 제안서 작성 및 관리를 위한 Next.js 애플리케이션입니다. AI 기반의 요구사항 관리, 이미지 생성, WBS 작성 등의 기능을 제공합니다.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript
- **UI 라이브러리**: HeroUI, Tailwind CSS
- **그래프 라이브러리**: AntV G6, Mermaid
- **AI 통합**: Anthropic Claude SDK, OpenAI SDK
- **이미지 생성**: ComfyUI
- **데이터베이스**: LibSQL (Turso)
- **마크다운**: React Markdown, Remark GFM

## 디렉토리 구조

```
apps/proposal/
├── src/
│   ├── app/                      # Next.js App Router 페이지
│   │   ├── dashboard/            # 대시보드 페이지
│   │   ├── database/             # 데이터베이스 관리 페이지
│   │   ├── image-gen/            # 이미지 생성 페이지
│   │   ├── requirements/         # 요구사항 관리 페이지
│   │   ├── schedule/             # 스케줄 관리 페이지
│   │   ├── screens/[screenId]/   # 스크린별 상세 페이지
│   │   ├── wbs/                  # WBS (Work Breakdown Structure) 페이지
│   │   ├── milestones/           # 마일스톤 관리 페이지
│   │   └── api/                  # API 라우트
│   │       ├── comfyui/          # ComfyUI 관련 API
│   │       ├── requirements/     # 요구사항 관련 API
│   │       └── screens/          # 스크린 관련 API
│   ├── components/               # 공통 컴포넌트
│   │   ├── image-gen/            # 이미지 생성 관련 컴포넌트
│   │   └── requirements/         # 요구사항 관련 컴포넌트
│   ├── hooks/                    # 커스텀 훅
│   │   ├── useImageGeneration.ts # 이미지 생성 훅
│   │   ├── useRequirementGraph.ts # 요구사항 그래프 훅
│   │   └── useGraphAI.ts         # 그래프 AI 훅
│   └── lib/                      # 유틸리티 라이브러리
│       ├── comfyui/              # ComfyUI 클라이언트
│       ├── db.ts                 # 데이터베이스 설정
│       ├── graph-ai.ts           # 그래프 AI 관련
│       ├── graph-data.ts         # 그래프 데이터 관리
│       ├── image-history.ts      # 이미지 히스토리
│       └── workflows/            # 워크플로우 관련
├── scripts/                      # 유틸리티 스크립트
│   ├── init-db.ts                # 데이터베이스 초기화
│   ├── check-db.ts               # 데이터베이스 상태 확인
│   ├── install-comfyui.sh        # ComfyUI 설치
│   ├── start-comfyui.sh          # ComfyUI 시작
│   └── stop-comfyui.sh           # ComfyUI 중지
└── plans/                        # 프로젝트 계획 문서
```

## 주요 기능

### 대시보드
- 프로젝트 전체 현황 모니터링

### 요구사항 관리
- AI 기반 요구사항 생성
- 그래프 기반 요구사항 시각화 (G6)
- 마크다운 편집기 지원

### 이미지 생성
- ComfyUI 기반 이미지 생성
- 생성 이미지 히스토리 관리
- 실시간 생성 상태 추적

### 스케줄 & WBS
- 스케줄 관리
- WBS (Work Breakdown Structure) 작성
- 마일스톤 추적

### 스크린 관리
- 스크린별 상세 정보 관리
- Figma 임베드 지원
- 마크다운 미리보기
- AI 기반 설계 채팅

## 시작하기

### 설치

```bash
npm install
```

### 환경 설정

`.env.local` 파일에 다음 환경 변수를 설정합니다:

```
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_libsql_database_url
COMFYUI_URL=your_comfyui_url
```

### 데이터베이스 초기화

```bash
npm run db:init
```

### 개발 서버 실행

```bash
npm run dev
```

애플리케이션은 `http://localhost:3001`에서 실행됩니다.

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 (Turbopack, 포트 3001) |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 시작 |
| `npm run type-check` | TypeScript 타입 검사 |
| `npm run lint` | Biome 린트 검사 |
| `npm run lint:fix` | Biome 린트 자동 수정 |
| `npm run format` | Biome 포맷팅 |
| `npm run clean` | 빌드 파일 삭제 |
| `npm run db:init` | 데이터베이스 초기화 |

## ComfyUI 설정

### 설치

```bash
./scripts/install-comfyui.sh
```

### 시작

```bash
./scripts/start-comfyui.sh
```

### 중지

```bash
./scripts/stop-comfyui.sh
```

## API 엔드포인트

### ComfyUI 관련

- `GET /api/comfyui/health` - ComfyUI 상태 확인
- `POST /api/comfyui/generate` - 이미지 생성 요청
- `GET /api/comfyui/status/[promptId]` - 생성 상태 조회
- `POST /api/comfyui/control` - 생성 제어 (취소/일시정지)
- `GET /api/comfyui/image/[promptId]` - 생성된 이미지 조회

### 요구사항 관련

- `GET /api/requirements` - 요구사항 목록 조회
- `POST /api/requirements` - 요구사항 생성
- `POST /api/requirements/ai` - AI 기반 요구사항 생성

### 스크린 관련

- `GET /api/screens` - 스크린 목록 조회
- `GET /api/screens/[screenId]` - 스크린 상세 조회
- `POST /api/screens/[screenId]` - 스크린 업데이트
- `POST /api/screens/ai` - AI 기반 스크린 생성

## 개발 가이드

### 컴포넌트 구조

페이지 컴포넌트는 `_client.tsx`와 `page.tsx`로 분리됩니다:
- `_client.tsx`: 클라이언트 컴포넌트 (useState, useEffect 등 사용)
- `page.tsx`: 서버 컴포넌트 (데이터 fetching 등)

### AI 통합

- **Anthropic Claude**: 요구사항 생성, 스크린 생성
- **OpenAI**: 이미지 생성 프롬프트 최적화 등

### 데이터베이스

LibSQL (Turso)를 사용하며, `src/lib/db.ts`에서 설정을 관리합니다.
