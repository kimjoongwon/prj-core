-- Inquiry 도메인은 1차 릴리스에서 모든 애플리케이션 소비가 제거되었으므로
-- 종속 관계의 자식 테이블부터 제거한다. 이 migration은 기존 데이터를 영구 삭제한다.

BEGIN;

-- DropTable
DROP TABLE "inquiry_attachments";

-- DropTable
DROP TABLE "ai_agent_logs";

-- DropTable
DROP TABLE "sentiment_analyses";

-- DropTable
DROP TABLE "inquiry_participants";

-- DropTable
DROP TABLE "inquiry_tags";

-- DropTable
DROP TABLE "inquiry_messages";

-- DropTable
DROP TABLE "inquiry_threads";

-- DropTable
DROP TABLE "inquiries";

-- DropEnum
DROP TYPE "AIAgentAction";

-- DropEnum
DROP TYPE "AttachmentFileType";

-- DropEnum
DROP TYPE "InquiryCategory";

-- DropEnum
DROP TYPE "InquiryChannel";

-- DropEnum
DROP TYPE "InquiryParticipantRole";

-- DropEnum
DROP TYPE "InquiryPriority";

-- DropEnum
DROP TYPE "InquirySource";

-- DropEnum
DROP TYPE "InquiryStatus";

-- DropEnum
DROP TYPE "MessageContentType";

-- DropEnum
DROP TYPE "SenderType";

-- DropEnum
DROP TYPE "SentimentType";

-- DropEnum
DROP TYPE "ThreadStatus";

COMMIT;
