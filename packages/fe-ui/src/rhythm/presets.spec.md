# rhythm presets 기획서

> 생성일: 2026-03-26
> 타입: rhythm
> 위치: packages/fe-ui/src/rhythm/presets.ts

## 역할

새로운 rhythm rule layer의 semantic preset을 정의합니다.
숫자 spacing scale에 직접 의존하지 않고 `page`, `section`, `block`, `inline`, `dense` 같은 의미 중심 이름으로 간격을 선택하게 만듭니다.

## 동작

- preset은 `flush`, `dense`, `inline`, `block`, `section`, `page`, `roomy`를 제공합니다.
- `VStack` 기본 rhythm은 `section`입니다.
- `HStack`/`Spacer`는 semantic preset 사용 시 `inline`을 기본 기준으로 삼습니다.
- numeric gap/size는 legacy 호환으로 유지하고, 신규 코드 권장값은 semantic preset입니다.

## 변경 이력

| 일자 | 내용 | 작성자 |
|------|------|--------|
| 2026-03-26 | semantic rhythm preset과 resolver 규칙 추가 | codex |
