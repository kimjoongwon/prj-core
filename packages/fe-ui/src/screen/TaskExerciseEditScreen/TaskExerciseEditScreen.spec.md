# TaskExerciseEditScreen

- `TaskExerciseEditScreen`은 Task Exercise aggregate의 상세/수정 route가 공유하는 Screen이다.
- route는 `readOnly`로 상세 모드를 결정하고, 생성/수정/상세 판단을 Screen에 맡기지 않는다.
- Screen은 입력 필드를 직접 소유하지 않고 `TaskExerciseForm`을 사용한다.
- 삭제 modal과 navigation action은 route가 소유하고 Screen에는 `actions`로 주입한다.
