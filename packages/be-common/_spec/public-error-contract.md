# 공개 API 오류 응답 계약

- 예상 가능한 4xx 응답은 기존 `ResponseEntity`의 `message`와 `data` 계약을 유지합니다.
- 명시적으로 안전한 메시지로 매핑된 데이터베이스 오류는 기존 상태 코드와 공개 오류 정보를 유지합니다.
- 그 밖의 5xx 응답은 `message: "Internal server error"`와 `data.correlationId`만 반환합니다. 원본 오류 메시지, stack, 데이터베이스 URL, 파일 경로와 secret은 응답에 포함하지 않습니다.
- `correlationId`는 로거가 부여한 안전한 request ID를 재사용합니다. request ID가 없거나 허용 형식이 아니면 서버가 UUID를 생성합니다.
- 내부 로그에는 동일한 `correlationId`와 redaction을 적용한 원인 정보를 기록하여 외부 응답을 노출하지 않고 장애를 추적합니다.
