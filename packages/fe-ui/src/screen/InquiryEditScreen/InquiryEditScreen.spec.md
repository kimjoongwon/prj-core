# InquiryEditScreen

- `InquiryEditScreen`은 Inquiry aggregate의 접수/상세/수정 route가 공유하는 Screen이다.
- route는 `readOnly`로 상세 모드를 결정하고, 접수/수정에서 노출할 필드는 props로 전달한다.
- Screen은 입력 필드를 직접 소유하지 않고 `InquiryForm`을 사용한다.
- 이전 접수/상세 전용 Screen은 통합 후 삭제 대상이다.
