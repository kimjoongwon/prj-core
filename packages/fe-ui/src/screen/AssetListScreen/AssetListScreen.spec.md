# AssetListScreen ui 기획서

> 생성일: 2026-03-26
> 타입: ui
> 위치: packages/fe-ui/src/screen/AssetListScreen/AssetListScreen.tsx

## 역할

에셋 목록 화면의 pure screen 컴포넌트입니다.
route thin container가 데이터/변경 훅을 소유하고, 이 파일은 공통 `AssetBrowser` feature를 inline 관리 화면으로 마운트하는 thin page wrapper만 담당합니다.

## 디자인 스케치

```text
AssetListScreen
- AssetBrowser
```

## 사용 컴포넌트

| 컴포넌트 | 출처 | 사용 위치 |
| --- | --- | --- |
| `AssetBrowser` | `../../feature/AssetBrowser` | 화면 조합 요소 |

## 공개 계약

| 항목 | 설명 |
|------|------|
| AssetListScreenProps.assets | `AssetDto[]` optional row 계약 |
| AssetListScreenProps | pure screen 입력 계약 |
| adminAssetsPageQueryInputs | route와 page가 공유하는 query input 정의 |
| AssetListScreen | 공개 계약 요소 |

## 의존성

| 모듈 | 용도 |
|------|------|
| @cocrepo/type | 기능 구현 의존성 |
| @cocrepo/ui | 기능 구현 의존성 |
| @heroui/react | 기능 구현 의존성 |
| lucide-react | 기능 구현 의존성 |
| mobx-react-lite | 기능 구현 의존성 |
| react | 기능 구현 의존성 |