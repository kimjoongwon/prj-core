# Dockerfile.dolmen-api 기획서

> 생성일: 2026-10-19
> 타입: docker-image
> 위치: devops/Dockerfile.dolmen-api

## 역할

dolmen-api(Python 3.12 + uv + FastAPI, hello-agents 기반) 이미지를 빌드한다.
다른 앱(node 기반)과 달리 **임베딩 모델을 빌드 시점에 이미지에 굽는다** —
파드 기동 시 fastembed 모델 다운로드(HF 허브)가 없어 콜드스타트가 짧고 외부 의존이 없다.

## 공개 계약

| 항목 | 설명 |
|------|------|
| 베이스 | `python:3.12-slim` digest 고정(멀티아치 index) |
| 패키지 | `uv sync --frozen --no-dev` (uv 0.8.3 고정, uv.lock 기반) |
| 임베딩 모델 | `paraphrase-multilingual-MiniLM-L12-v2` → `/opt/dolmen/embedding-cache` (env `DOLMEN_EMBEDDING_CACHE_DIR`와 일치) |
| 런타임 사용자 | `dolmen`(uid 1001, 비루트). `.rag/` 로컬 인덱스 디렉터리가 워크스페이스에 생성됨 |
| 포트 | 3012 (`uvicorn app.main:app`) |
| 데모 문서 | `apps/dolmen/demo-doc` → `/srv/demo-doc` (settings.DEMO_DOC_PATH 규약) |

## 주의

- 모델 프리다운로드 단계는 빌드 시점의 HF 허브 접근이 필요하다.
- `.rag/`(SQLite+Qdrant path 인덱스)는 컨테이너 writable layer에 생기므로 **파드 재생성 시 재시딩**된다(첫 요청에서 자동, 모델이 이미지에 있어 수 초).
