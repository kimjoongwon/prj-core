# VideoUploader Input 기획서

> 생성일: 2026-02-18
> 타입: input
> 위치: packages/fe-ui/src/components/inputs/VideoUploader/

## 역할

비디오 파일을 선택하고 업로드하는 컴포넌트. 드래그 앤 드롭 UI와 업로드 프로그레스 바를 제공한다. 현재 업로드 로직은 미구현 상태(주석 처리)이다.

## Props

```typescript
interface VideoUploaderProps {
  /** 제목 라벨 */
  label?: string;
}
```

## 동작 흐름

1. 파일 선택 영역 클릭 또는 드래그 앤 드롭
2. video/* 파일만 허용 (비디오가 아니면 alert)
3. 선택된 파일 미리보기 (video 태그)
4. "비디오 업로드" 버튼 클릭 -> 업로드 진행 (미구현)
5. 프로그레스 바 표시

## 제한사항

- 허용 형식: MP4, WebM, OGG
- 최대 크기: 100MB (UI 안내만, 검증 미구현)
- 업로드 API 연동 미구현 (주석 처리)

## 내부 상태

- `file`: 선택된 File 객체
- `uploading`: 업로드 진행 중 여부
- `uploadProgress`: 업로드 진행률 (0~100)

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
