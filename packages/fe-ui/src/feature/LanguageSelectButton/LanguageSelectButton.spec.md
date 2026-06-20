# LanguageSelectButton feature 기획서

> 생성일: 2026-05-01
> 타입: feature
> 위치: packages/fe-ui/src/feature/LanguageSelectButton/LanguageSelectButton.tsx

## 역할

공용 shell과 인증 화면에서 현재 앱의 표시 언어를 선택하는 버튼입니다.

## 입력 계약

| 이름 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `value` | `LanguageCode` | 필수 | 현재 선택된 언어 코드 |
| `onChange` | `(languageCode: LanguageCode) => void` | 필수 | 언어 선택 변경 이벤트 |
| `className` | `string` | `undefined` | 배치 위치와 외형 보정을 위한 추가 클래스 |
| `compact` | `boolean` | `false` | `true`면 header/action 영역용 축약 버튼으로 렌더링 |
| `isDisabled` | `boolean` | `false` | 선택 비활성화 여부 |

## 렌더링 규칙

- HeroUI `Dropdown`과 `Button`을 사용합니다.
- 지원 언어는 `ko_KR`, `en_US`, `zh_CN`, `ja_JP` 네 가지입니다.
- 라벨은 `useT`로 번역하되, catalog에 없으면 한국어 semantic key가 그대로 표시됩니다.