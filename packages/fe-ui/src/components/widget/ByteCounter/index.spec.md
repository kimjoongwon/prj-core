# ByteCounter Widget 기획서

> 생성일: 2026-02-18
> 타입: widget
> 위치: packages/fe-ui/src/components/widget/ByteCounter/

## 역할

SMS 본문의 바이트 수와 장수를 실시간으로 표시합니다. 한글 2바이트, 영문/숫자 1바이트 기준으로 계산합니다.

## Props

```typescript
interface ByteCounterProps {
  text: string;
  bytesPerMessage?: number;  // 기본값: 90
}
```

## 하위 UI 컴포넌트

없음 (span 태그 직접 렌더링)

## 상태 관리

**없음** (순수 계산 UI)

## 슬롯

없음

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-02-18 | 초기 생성 (역기획) | req-reverse-engineer |
