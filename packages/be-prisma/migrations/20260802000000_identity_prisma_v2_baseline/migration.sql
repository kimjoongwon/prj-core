-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AIAgentAction" AS ENUM ('DRAFT_GENERATION', 'AUTO_CLASSIFICATION', 'SENTIMENT_ANALYSIS', 'AUTO_RESPONSE', 'KNOWLEDGE_SEARCH', 'SUMMARIZATION', 'TRANSLATION');

-- CreateEnum
CREATE TYPE "AssetKind" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "AssetStatus" AS ENUM ('UPLOADING', 'READY', 'FAILED');

-- CreateEnum
CREATE TYPE "AttachmentFileType" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'ARCHIVE', 'OTHER');

-- CreateEnum
CREATE TYPE "AuthAuditResult" AS ENUM ('SUCCESS', 'FAILURE', 'LOCKED');

-- CreateEnum
CREATE TYPE "CategoryTypes" AS ENUM ('Role', 'Space', 'Asset', 'User');

-- CreateEnum
CREATE TYPE "DerivativeKind" AS ENUM ('THUMBNAIL', 'PREVIEW', 'TRANSCODE', 'TEXT');

-- CreateEnum
CREATE TYPE "EmailVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "GroupTypes" AS ENUM ('Role', 'Space', 'Asset', 'User');

-- CreateEnum
CREATE TYPE "InquiryCategory" AS ENUM ('GENERAL', 'DELIVERY', 'REFUND', 'PRODUCT', 'ACCOUNT', 'TECHNICAL', 'COMPLAINT', 'OTHER');

-- CreateEnum
CREATE TYPE "InquiryChannel" AS ENUM ('WEB', 'EMAIL', 'CHAT', 'SMS', 'PHONE', 'WALK_IN');

-- CreateEnum
CREATE TYPE "InquiryParticipantRole" AS ENUM ('CUSTOMER', 'AGENT', 'SUPERVISOR', 'VIEWER');

-- CreateEnum
CREATE TYPE "InquiryPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "InquirySource" AS ENUM ('ONLINE', 'OFFLINE');

-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('NEW', 'OPEN', 'IN_PROGRESS', 'WAITING_CUSTOMER', 'RESOLVED', 'CLOSED', 'ESCALATED');

-- CreateEnum
CREATE TYPE "language_code" AS ENUM ('ko_KR', 'en_US', 'zh_CN', 'ja_JP');

-- CreateEnum
CREATE TYPE "MessageContentType" AS ENUM ('TEXT', 'HTML', 'MARKDOWN', 'IMAGE', 'FILE', 'SYSTEM');

-- CreateEnum
CREATE TYPE "RecurringDayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "RepeatCycleTypes" AS ENUM ('WEEKLY', 'MONTHLY');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('CONFIRMED', 'WAITLISTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('USER', 'AI', 'SYSTEM');

-- CreateEnum
CREATE TYPE "SentimentType" AS ENUM ('POSITIVE', 'NEUTRAL', 'NEGATIVE');

-- CreateEnum
CREATE TYPE "ServiceDocumentFormat" AS ENUM ('MARKDOWN', 'HTML', 'PLAIN_TEXT');

-- CreateEnum
CREATE TYPE "ServiceDocumentKind" AS ENUM ('TERMS_OF_SERVICE', 'PRIVACY_POLICY', 'MARKETING_CONSENT', 'LOCATION_CONSENT', 'THIRD_PARTY_SHARING');

-- CreateEnum
CREATE TYPE "ServiceDocumentPlatform" AS ENUM ('ALL', 'WEB', 'MOBILE');

-- CreateEnum
CREATE TYPE "ServiceDocumentStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "SessionTypes" AS ENUM ('ONE_TIME', 'ONE_TIME_RANGE', 'RECURRING');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "TenantAccessRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELED');

-- CreateEnum
CREATE TYPE "TextTypes" AS ENUM ('Editor', 'Input', 'Textarea');

-- CreateEnum
CREATE TYPE "ThreadStatus" AS ENUM ('ACTIVE', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "WhitelistType" AS ENUM ('IP', 'EMAIL_DOMAIN', 'CORS_ORIGIN');

-- CreateTable
CREATE TABLE "abilities" (
    "ability_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "fields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "conditions" JSONB,
    "inverted" BOOLEAN NOT NULL DEFAULT false,
    "reason" TEXT,
    "subject_id" BIGINT NOT NULL,
    "action_id" BIGINT NOT NULL,

    CONSTRAINT "abilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "actions" (
    "action_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "group" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_system" BOOLEAN NOT NULL DEFAULT true,
    "config" JSONB,

    CONSTRAINT "actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "activity_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "routine_id" BIGINT NOT NULL,
    "task_id" BIGINT NOT NULL,
    "order" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL DEFAULT 1,
    "rest_time" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agent_logs" (
    "ai_agent_log_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "inquiry_id" BIGINT NOT NULL,
    "message_id" BIGINT,
    "action" "AIAgentAction" NOT NULL,
    "input" JSONB,
    "output" JSONB,
    "confidence" DOUBLE PRECISION,
    "wasAccepted" BOOLEAN,
    "wasModified" BOOLEAN,
    "response_time_ms" INTEGER,
    "model" TEXT,
    "token_count" INTEGER,
    "error_message" TEXT,

    CONSTRAINT "ai_agent_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "album_entries" (
    "album_entry_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,
    "album_id" BIGINT NOT NULL,
    "asset_id" BIGINT NOT NULL,
    "position" INTEGER NOT NULL,
    "caption" TEXT,

    CONSTRAINT "album_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "albums" (
    "album_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover_asset_id" BIGINT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" BIGINT,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "asset_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "folder_id" BIGINT NOT NULL,
    "kind" "AssetKind" NOT NULL,
    "status" "AssetStatus" NOT NULL DEFAULT 'UPLOADING',
    "original_name" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "extension" TEXT,
    "size_bytes" BIGINT NOT NULL,
    "checksum" TEXT,
    "metadata" JSONB,
    "created_by_id" BIGINT,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_audit_logs" (
    "auth_audit_log_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "user_id" BIGINT,
    "result" "AuthAuditResult" NOT NULL,
    "failure_reason" TEXT,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT,
    "client_id" TEXT,

    CONSTRAINT "auth_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "category_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "type" "CategoryTypes" NOT NULL DEFAULT 'User',
    "parent_id" BIGINT,
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "company_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "label" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "business_no" TEXT NOT NULL,
    "logo_image_file_id" TEXT,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contents" (
    "content_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "title" TEXT,
    "description" TEXT,
    "type" "TextTypes" NOT NULL DEFAULT 'Editor',
    "text" VARCHAR(1000),
    "file_id" TEXT,
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,

    CONSTRAINT "contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "derivatives" (
    "derivative_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,
    "asset_id" BIGINT NOT NULL,
    "kind" "DerivativeKind" NOT NULL,
    "profile" TEXT NOT NULL DEFAULT 'default',
    "storage_key" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "duration_ms" INTEGER,

    CONSTRAINT "derivatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "document_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "page_count" INTEGER,
    "word_count" INTEGER,
    "author" TEXT,
    "title" TEXT,
    "subject" TEXT,
    "keywords" TEXT,
    "asset_id" BIGINT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "email_verifications" (
    "email_verification_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "space_id" BIGINT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "token_hash" TEXT NOT NULL,
    "status" "EmailVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "expires_at" TIMESTAMPTZ(6) NOT NULL,
    "verified_at" TIMESTAMPTZ(6),
    "last_sent_at" TIMESTAMPTZ(6),
    "send_count" INTEGER NOT NULL DEFAULT 0,
    "last_send_status" TEXT,
    "last_send_error" TEXT,
    "verified_user_id" BIGINT,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exercises" (
    "exercise_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "duration" INTEGER NOT NULL,
    "count" INTEGER NOT NULL,
    "task_id" BIGINT NOT NULL,
    "description" TEXT,
    "image_file_id" TEXT,
    "video_file_id" TEXT,
    "name" TEXT NOT NULL,

    CONSTRAINT "exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fitness_centers" (
    "fitness_center_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "label" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company_id" BIGINT NOT NULL,
    "space_id" BIGINT NOT NULL,
    "image_file_id" TEXT,

    CONSTRAINT "fitness_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "folders" (
    "folder_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "parent_folder_id" BIGINT,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_by_id" BIGINT,

    CONSTRAINT "folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groups" (
    "group_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "type" "GroupTypes" NOT NULL DEFAULT 'User',
    "label" TEXT,
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,

    CONSTRAINT "groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "image_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "orientation" INTEGER,
    "color_space" TEXT,
    "has_alpha" BOOLEAN NOT NULL DEFAULT false,
    "asset_id" BIGINT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_attachments" (
    "inquiry_attachment_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message_id" BIGINT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" BIGINT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "file_type" "AttachmentFileType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail_url" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "inquiry_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_messages" (
    "inquiry_message_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "thread_id" BIGINT NOT NULL,
    "inquiry_id" BIGINT NOT NULL,
    "sender_id" BIGINT,
    "senderType" "SenderType" NOT NULL DEFAULT 'USER',
    "client_message_id" TEXT,
    "content" TEXT NOT NULL,
    "contentType" "MessageContentType" NOT NULL DEFAULT 'TEXT',
    "delivered_at" TIMESTAMPTZ(6),
    "read_at" TIMESTAMPTZ(6),
    "edited_at" TIMESTAMPTZ(6),
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,

    CONSTRAINT "inquiry_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_participants" (
    "inquiry_participant_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "joined_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "left_at" TIMESTAMPTZ(6),
    "inquiry_id" BIGINT NOT NULL,
    "thread_id" BIGINT,
    "user_id" BIGINT NOT NULL,
    "role" "InquiryParticipantRole" NOT NULL DEFAULT 'VIEWER',
    "is_online" BOOLEAN NOT NULL DEFAULT false,
    "is_typing" BOOLEAN NOT NULL DEFAULT false,
    "last_seen_at" TIMESTAMPTZ(6),
    "last_read_at" TIMESTAMPTZ(6),
    "unread_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "inquiry_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_tags" (
    "inquiry_tag_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "inquiry_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "inquiry_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiry_threads" (
    "inquiry_thread_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "inquiry_id" BIGINT NOT NULL,
    "title" TEXT,
    "status" "ThreadStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by_id" BIGINT NOT NULL,
    "last_message_at" TIMESTAMPTZ(6),
    "last_message_preview" CHAR(100),
    "message_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "inquiry_threads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inquiries" (
    "inquiry_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,
    "inquiry_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" "InquiryCategory" NOT NULL,
    "channel" "InquiryChannel" NOT NULL,
    "source" "InquirySource" NOT NULL DEFAULT 'ONLINE',
    "status" "InquiryStatus" NOT NULL DEFAULT 'NEW',
    "priority" "InquiryPriority" NOT NULL DEFAULT 'NORMAL',
    "customer_id" BIGINT,
    "assignee_id" BIGINT,
    "first_response_at" TIMESTAMPTZ(6),
    "resolved_at" TIMESTAMPTZ(6),
    "closed_at" TIMESTAMPTZ(6),
    "sla_response_due" TIMESTAMPTZ(6),
    "sla_resolve_due" TIMESTAMPTZ(6),
    "is_sla_response_breached" BOOLEAN NOT NULL DEFAULT false,
    "is_sla_resolve_breached" BOOLEAN NOT NULL DEFAULT false,
    "sentiment" "SentimentType",
    "sentiment_score" DOUBLE PRECISION,
    "ai_resolution_attempted" BOOLEAN NOT NULL DEFAULT false,
    "ai_resolved" BOOLEAN NOT NULL DEFAULT false,
    "is_realtime_chat" BOOLEAN NOT NULL DEFAULT false,
    "last_message_at" TIMESTAMPTZ(6),
    "unread_count" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,

    CONSTRAINT "inquiries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oidc_clients" (
    "oidc_client_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "client_id" TEXT NOT NULL,
    "client_secret" TEXT,
    "name" TEXT NOT NULL,
    "redirect_uris" TEXT[],
    "login_url" TEXT,
    "default_return_to" TEXT,
    "grant_types" TEXT[] DEFAULT ARRAY['authorization_code']::TEXT[],
    "response_types" TEXT[] DEFAULT ARRAY['code']::TEXT[],
    "token_endpoint_auth_method" TEXT NOT NULL DEFAULT 'client_secret_basic',
    "scope" TEXT NOT NULL DEFAULT 'openid profile email',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_first_party" BOOLEAN NOT NULL DEFAULT false,
    "skip_consent" BOOLEAN NOT NULL DEFAULT false,
    "login_ui" JSONB,
    "logo_uri" TEXT,
    "policy_uri" TEXT,
    "tos_uri" TEXT,

    CONSTRAINT "oidc_clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oidc_models" (
    "oidc_model_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "key" TEXT NOT NULL,
    "model_type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "expires_at" TIMESTAMPTZ(6),
    "user_code" TEXT,
    "grant_id" TEXT,
    "uid" TEXT,

    CONSTRAINT "oidc_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_histories" (
    "password_history_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" BIGINT NOT NULL,
    "password_hash" TEXT NOT NULL,

    CONSTRAINT "password_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_entries" (
    "policy_entry_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "policy_id" BIGINT NOT NULL,
    "ability_id" BIGINT NOT NULL,

    CONSTRAINT "policy_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "policy_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "posts" (
    "post_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "content_id" BIGINT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "profile_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "avatar_file_id" TEXT,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "program_activities" (
    "program_activity_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "program_id" BIGINT NOT NULL,
    "task_id" BIGINT NOT NULL,
    "order" INTEGER NOT NULL,
    "repetitions" INTEGER NOT NULL,
    "rest_time" INTEGER NOT NULL,
    "notes" TEXT,
    "exercise_name" TEXT NOT NULL,
    "exercise_description" TEXT,
    "exercise_duration" INTEGER NOT NULL,
    "exercise_count" INTEGER NOT NULL,
    "image_file_id" TEXT,
    "video_file_id" TEXT,

    CONSTRAINT "program_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programs" (
    "program_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "routine_id" BIGINT NOT NULL,
    "session_id" BIGINT NOT NULL,
    "instructor_id" BIGINT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "level" TEXT,
    "routine_name_snapshot" TEXT,
    "routine_label_snapshot" TEXT,

    CONSTRAINT "programs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reference_data_migration_history" (
    "reference_data_migration_history_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "migration_key" TEXT NOT NULL,
    "checksum" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "applied_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reference_data_migration_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations" (
    "reservation_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,
    "user_id" BIGINT NOT NULL,
    "timeline_id" BIGINT NOT NULL,
    "session_id" BIGINT NOT NULL,
    "program_id" BIGINT NOT NULL,
    "occurrence_start_at" TIMESTAMPTZ(6) NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'CONFIRMED',
    "memo" TEXT,
    "idempotency_key" TEXT NOT NULL,
    "waitlist_position" INTEGER,
    "confirmed_at" TIMESTAMPTZ(6),
    "canceled_at" TIMESTAMPTZ(6),
    "cancel_reason" TEXT,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_assignments" (
    "role_assignment_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "role_id" BIGINT NOT NULL,
    "policy_id" BIGINT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "role_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_associations" (
    "role_association_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "role_id" BIGINT NOT NULL,
    "group_id" BIGINT NOT NULL,

    CONSTRAINT "role_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_classifications" (
    "role_classification_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),

    CONSTRAINT "role_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "description" TEXT,
    "is_system" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "routines" (
    "routine_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "routines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safe_confirmations" (
    "safe_confirmation_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "safe_transaction_id" BIGINT NOT NULL,
    "owner" TEXT NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "safe_confirmations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safe_transactions" (
    "safe_transaction_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "safe_tx_hash" TEXT NOT NULL,
    "safe_wallet_id" BIGINT NOT NULL,
    "to" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '0',
    "data" TEXT NOT NULL DEFAULT '0x',
    "nonce" INTEGER NOT NULL,
    "operation" INTEGER NOT NULL DEFAULT 0,
    "token_address" TEXT,
    "token_symbol" TEXT,
    "token_decimals" INTEGER,
    "confirmations_required" INTEGER NOT NULL,
    "is_executed" BOOLEAN NOT NULL DEFAULT false,
    "execution_tx_hash" TEXT,
    "executed_at" TIMESTAMPTZ(6),

    CONSTRAINT "safe_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safe_wallets" (
    "safe_wallet_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "address" TEXT NOT NULL,
    "chain_id" INTEGER NOT NULL,
    "threshold" INTEGER NOT NULL DEFAULT 3,
    "nonce" INTEGER NOT NULL DEFAULT 0,
    "owners" TEXT[],
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,

    CONSTRAINT "safe_wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_policies" (
    "security_policy_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "key" TEXT NOT NULL,
    "password_min_length" INTEGER NOT NULL DEFAULT 10,
    "password_require_uppercase" BOOLEAN NOT NULL DEFAULT false,
    "password_require_lowercase" BOOLEAN NOT NULL DEFAULT true,
    "password_require_number" BOOLEAN NOT NULL DEFAULT true,
    "password_require_special" BOOLEAN NOT NULL DEFAULT true,
    "password_expiration_days" INTEGER NOT NULL DEFAULT 0,
    "password_reuse_limit" INTEGER NOT NULL DEFAULT 3,
    "temporary_lock_threshold" INTEGER NOT NULL DEFAULT 5,
    "temporary_lock_duration_min" INTEGER NOT NULL DEFAULT 15,
    "permanent_lock_threshold" INTEGER NOT NULL DEFAULT 10,
    "access_token_ttl_sec" INTEGER NOT NULL DEFAULT 3600,
    "refresh_token_ttl_sec" INTEGER NOT NULL DEFAULT 2592000,
    "session_ttl_sec" INTEGER NOT NULL DEFAULT 86400,
    "ip_whitelist_enabled" BOOLEAN NOT NULL DEFAULT false,
    "email_domain_whitelist_enabled" BOOLEAN NOT NULL DEFAULT false,
    "cors_origin_whitelist_enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "security_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sentiment_analyses" (
    "sentiment_analysis_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "inquiry_id" BIGINT NOT NULL,
    "message_id" BIGINT,
    "sentiment" "SentimentType" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "emotions" JSONB,
    "keywords" JSONB,
    "urgency" DOUBLE PRECISION,
    "analyzed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sentiment_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_documents" (
    "service_document_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "kind" "ServiceDocumentKind" NOT NULL,
    "platform" "ServiceDocumentPlatform" NOT NULL DEFAULT 'ALL',
    "locale" TEXT NOT NULL DEFAULT 'ko-KR',
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT NOT NULL,
    "format" "ServiceDocumentFormat" NOT NULL DEFAULT 'MARKDOWN',
    "version" TEXT NOT NULL,
    "status" "ServiceDocumentStatus" NOT NULL DEFAULT 'DRAFT',
    "is_required" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "effective_at" TIMESTAMPTZ(6),
    "published_at" TIMESTAMPTZ(6),

    CONSTRAINT "service_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "type" "SessionTypes" NOT NULL DEFAULT 'ONE_TIME',
    "repeat_cycle_type" "RepeatCycleTypes",
    "start_date_time" TIMESTAMPTZ(6),
    "end_date_time" TIMESTAMPTZ(6),
    "recurring_day_of_week" "RecurringDayOfWeek",
    "timeline_id" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_associations" (
    "space_association_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "group_id" BIGINT NOT NULL,

    CONSTRAINT "space_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "space_classifications" (
    "space_classification_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT NOT NULL,
    "space_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),

    CONSTRAINT "space_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spaces" (
    "space_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "content_language_code" "language_code" NOT NULL DEFAULT 'ko_KR',

    CONSTRAINT "spaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "subject_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "display_name" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_system" BOOLEAN NOT NULL DEFAULT true,
    "group" TEXT,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "task_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "template_variables" (
    "template_variable_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "default_value" TEXT,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "template_id" BIGINT NOT NULL,

    CONSTRAINT "template_variables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "template_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TemplateType" NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_access_requests" (
    "tenant_access_request_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "requester_id" BIGINT NOT NULL,
    "space_id" BIGINT NOT NULL,
    "requested_role_id" BIGINT NOT NULL,
    "previous_role_id" BIGINT,
    "reason" TEXT,
    "status" "TenantAccessRequestStatus" NOT NULL DEFAULT 'PENDING',
    "reviewer_id" BIGINT,
    "review_comment" TEXT,
    "reviewed_at" TIMESTAMPTZ(6),
    "applied_tenant_id" BIGINT,

    CONSTRAINT "tenant_access_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "tenant_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "user_id" BIGINT NOT NULL,
    "space_id" BIGINT NOT NULL,
    "role_id" BIGINT NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timelines" (
    "timeline_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "space_id" BIGINT NOT NULL,
    "created_by_id" BIGINT,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "translation_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "language_code" "language_code" NOT NULL,
    "key" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_translated" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_associations" (
    "user_association_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "user_id" BIGINT NOT NULL,
    "group_id" BIGINT NOT NULL,

    CONSTRAINT "user_associations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_classifications" (
    "user_classification_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),

    CONSTRAINT "user_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "updated_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMPTZ(6),
    "phone" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "failed_login_attempts" INTEGER NOT NULL DEFAULT 0,
    "locked_until" TIMESTAMPTZ(6),
    "is_permanently_locked" BOOLEAN NOT NULL DEFAULT false,
    "must_change_password" BOOLEAN NOT NULL DEFAULT false,
    "password_changed_at" TIMESTAMPTZ(6),
    "last_login_at" TIMESTAMPTZ(6),
    "last_login_ip" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "current_tenant_id" BIGINT,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "video_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "removed_at" TIMESTAMPTZ(6),
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "duration_ms" INTEGER NOT NULL,
    "frame_rate" DOUBLE PRECISION,
    "codec" TEXT,
    "bitrate" INTEGER,
    "has_audio" BOOLEAN NOT NULL DEFAULT false,
    "asset_id" BIGINT NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whitelist_entries" (
    "whitelist_entry_id" CHAR(26) NOT NULL,
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6),
    "type" "WhitelistType" NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "whitelist_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "abilities_ability_id_key" ON "abilities"("ability_id");

-- CreateIndex
CREATE UNIQUE INDEX "abilities_name_key" ON "abilities"("name");

-- CreateIndex
CREATE INDEX "abilities_subject_id_idx" ON "abilities"("subject_id");

-- CreateIndex
CREATE INDEX "abilities_action_id_idx" ON "abilities"("action_id");

-- CreateIndex
CREATE INDEX "abilities_name_idx" ON "abilities"("name");

-- CreateIndex
CREATE UNIQUE INDEX "actions_action_id_key" ON "actions"("action_id");

-- CreateIndex
CREATE UNIQUE INDEX "actions_name_key" ON "actions"("name");

-- CreateIndex
CREATE INDEX "actions_group_idx" ON "actions"("group");

-- CreateIndex
CREATE UNIQUE INDEX "activities_activity_id_key" ON "activities"("activity_id");

-- CreateIndex
CREATE INDEX "activities_routine_id_order_idx" ON "activities"("routine_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "activities_routine_id_task_id_key" ON "activities"("routine_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agent_logs_ai_agent_log_id_key" ON "ai_agent_logs"("ai_agent_log_id");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agent_logs_message_id_key" ON "ai_agent_logs"("message_id");

-- CreateIndex
CREATE INDEX "ai_agent_logs_inquiry_id_idx" ON "ai_agent_logs"("inquiry_id");

-- CreateIndex
CREATE INDEX "ai_agent_logs_action_idx" ON "ai_agent_logs"("action");

-- CreateIndex
CREATE UNIQUE INDEX "album_entries_album_entry_id_key" ON "album_entries"("album_entry_id");

-- CreateIndex
CREATE INDEX "album_entries_space_id_idx" ON "album_entries"("space_id");

-- CreateIndex
CREATE INDEX "album_entries_album_id_idx" ON "album_entries"("album_id");

-- CreateIndex
CREATE INDEX "album_entries_asset_id_idx" ON "album_entries"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "album_entries_album_id_asset_id_key" ON "album_entries"("album_id", "asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "albums_album_id_key" ON "albums"("album_id");

-- CreateIndex
CREATE INDEX "albums_space_id_idx" ON "albums"("space_id");

-- CreateIndex
CREATE INDEX "albums_name_idx" ON "albums"("name");

-- CreateIndex
CREATE UNIQUE INDEX "assets_asset_id_key" ON "assets"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "assets_storage_key_key" ON "assets"("storage_key");

-- CreateIndex
CREATE INDEX "assets_space_id_idx" ON "assets"("space_id");

-- CreateIndex
CREATE INDEX "assets_folder_id_idx" ON "assets"("folder_id");

-- CreateIndex
CREATE INDEX "assets_kind_idx" ON "assets"("kind");

-- CreateIndex
CREATE INDEX "assets_status_idx" ON "assets"("status");

-- CreateIndex
CREATE UNIQUE INDEX "auth_audit_logs_auth_audit_log_id_key" ON "auth_audit_logs"("auth_audit_log_id");

-- CreateIndex
CREATE INDEX "auth_audit_logs_email_idx" ON "auth_audit_logs"("email");

-- CreateIndex
CREATE INDEX "auth_audit_logs_user_id_idx" ON "auth_audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "auth_audit_logs_created_at_idx" ON "auth_audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "auth_audit_logs_result_idx" ON "auth_audit_logs"("result");

-- CreateIndex
CREATE UNIQUE INDEX "categories_category_id_key" ON "categories"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "categories_space_id_idx" ON "categories"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "companies_company_id_key" ON "companies"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "contents_content_id_key" ON "contents"("content_id");

-- CreateIndex
CREATE INDEX "contents_space_id_idx" ON "contents"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "derivatives_derivative_id_key" ON "derivatives"("derivative_id");

-- CreateIndex
CREATE UNIQUE INDEX "derivatives_storage_key_key" ON "derivatives"("storage_key");

-- CreateIndex
CREATE INDEX "derivatives_space_id_idx" ON "derivatives"("space_id");

-- CreateIndex
CREATE INDEX "derivatives_asset_id_idx" ON "derivatives"("asset_id");

-- CreateIndex
CREATE INDEX "derivatives_kind_idx" ON "derivatives"("kind");

-- CreateIndex
CREATE UNIQUE INDEX "derivatives_asset_id_kind_profile_key" ON "derivatives"("asset_id", "kind", "profile");

-- CreateIndex
CREATE UNIQUE INDEX "documents_document_id_key" ON "documents"("document_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_asset_id_key" ON "documents"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_email_verification_id_key" ON "email_verifications"("email_verification_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_token_hash_key" ON "email_verifications"("token_hash");

-- CreateIndex
CREATE INDEX "email_verifications_email_idx" ON "email_verifications"("email");

-- CreateIndex
CREATE INDEX "email_verifications_status_idx" ON "email_verifications"("status");

-- CreateIndex
CREATE INDEX "email_verifications_expires_at_idx" ON "email_verifications"("expires_at");

-- CreateIndex
CREATE INDEX "email_verifications_created_at_idx" ON "email_verifications"("created_at");

-- CreateIndex
CREATE INDEX "email_verifications_space_id_idx" ON "email_verifications"("space_id");

-- CreateIndex
CREATE INDEX "email_verifications_verified_user_id_idx" ON "email_verifications"("verified_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_exercise_id_key" ON "exercises"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "exercises_task_id_key" ON "exercises"("task_id");

-- CreateIndex
CREATE INDEX "exercises_name_idx" ON "exercises"("name");

-- CreateIndex
CREATE UNIQUE INDEX "fitness_centers_fitness_center_id_key" ON "fitness_centers"("fitness_center_id");

-- CreateIndex
CREATE UNIQUE INDEX "fitness_centers_space_id_key" ON "fitness_centers"("space_id");

-- CreateIndex
CREATE INDEX "fitness_centers_company_id_idx" ON "fitness_centers"("company_id");

-- CreateIndex
CREATE UNIQUE INDEX "folders_folder_id_key" ON "folders"("folder_id");

-- CreateIndex
CREATE UNIQUE INDEX "folders_path_key" ON "folders"("path");

-- CreateIndex
CREATE INDEX "folders_space_id_idx" ON "folders"("space_id");

-- CreateIndex
CREATE INDEX "folders_parent_folder_id_idx" ON "folders"("parent_folder_id");

-- CreateIndex
CREATE INDEX "folders_path_idx" ON "folders"("path");

-- CreateIndex
CREATE UNIQUE INDEX "groups_group_id_key" ON "groups"("group_id");

-- CreateIndex
CREATE INDEX "groups_space_id_idx" ON "groups"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "images_image_id_key" ON "images"("image_id");

-- CreateIndex
CREATE UNIQUE INDEX "images_asset_id_key" ON "images"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_attachments_inquiry_attachment_id_key" ON "inquiry_attachments"("inquiry_attachment_id");

-- CreateIndex
CREATE INDEX "inquiry_attachments_message_id_idx" ON "inquiry_attachments"("message_id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_messages_inquiry_message_id_key" ON "inquiry_messages"("inquiry_message_id");

-- CreateIndex
CREATE INDEX "inquiry_messages_thread_id_idx" ON "inquiry_messages"("thread_id");

-- CreateIndex
CREATE INDEX "inquiry_messages_inquiry_id_idx" ON "inquiry_messages"("inquiry_id");

-- CreateIndex
CREATE INDEX "inquiry_messages_sender_id_idx" ON "inquiry_messages"("sender_id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_messages_thread_id_client_message_id_key" ON "inquiry_messages"("thread_id", "client_message_id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_participants_inquiry_participant_id_key" ON "inquiry_participants"("inquiry_participant_id");

-- CreateIndex
CREATE INDEX "inquiry_participants_inquiry_id_idx" ON "inquiry_participants"("inquiry_id");

-- CreateIndex
CREATE INDEX "inquiry_participants_thread_id_idx" ON "inquiry_participants"("thread_id");

-- CreateIndex
CREATE INDEX "inquiry_participants_user_id_idx" ON "inquiry_participants"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_participants_inquiry_id_thread_id_user_id_key" ON "inquiry_participants"("inquiry_id", "thread_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_tags_inquiry_tag_id_key" ON "inquiry_tags"("inquiry_tag_id");

-- CreateIndex
CREATE INDEX "inquiry_tags_inquiry_id_idx" ON "inquiry_tags"("inquiry_id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_tags_inquiry_id_name_key" ON "inquiry_tags"("inquiry_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "inquiry_threads_inquiry_thread_id_key" ON "inquiry_threads"("inquiry_thread_id");

-- CreateIndex
CREATE INDEX "inquiry_threads_inquiry_id_idx" ON "inquiry_threads"("inquiry_id");

-- CreateIndex
CREATE INDEX "inquiry_threads_status_idx" ON "inquiry_threads"("status");

-- CreateIndex
CREATE UNIQUE INDEX "inquiries_inquiry_id_key" ON "inquiries"("inquiry_id");

-- CreateIndex
CREATE UNIQUE INDEX "inquiries_inquiry_number_key" ON "inquiries"("inquiry_number");

-- CreateIndex
CREATE INDEX "inquiries_space_id_idx" ON "inquiries"("space_id");

-- CreateIndex
CREATE INDEX "inquiries_status_idx" ON "inquiries"("status");

-- CreateIndex
CREATE INDEX "inquiries_assignee_id_idx" ON "inquiries"("assignee_id");

-- CreateIndex
CREATE INDEX "inquiries_customer_id_idx" ON "inquiries"("customer_id");

-- CreateIndex
CREATE INDEX "inquiries_space_id_status_idx" ON "inquiries"("space_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "oidc_clients_oidc_client_id_key" ON "oidc_clients"("oidc_client_id");

-- CreateIndex
CREATE UNIQUE INDEX "oidc_clients_client_id_key" ON "oidc_clients"("client_id");

-- CreateIndex
CREATE INDEX "oidc_clients_is_active_idx" ON "oidc_clients"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "oidc_models_oidc_model_id_key" ON "oidc_models"("oidc_model_id");

-- CreateIndex
CREATE UNIQUE INDEX "oidc_models_key_key" ON "oidc_models"("key");

-- CreateIndex
CREATE UNIQUE INDEX "oidc_models_user_code_key" ON "oidc_models"("user_code");

-- CreateIndex
CREATE UNIQUE INDEX "oidc_models_uid_key" ON "oidc_models"("uid");

-- CreateIndex
CREATE INDEX "oidc_models_model_type_idx" ON "oidc_models"("model_type");

-- CreateIndex
CREATE INDEX "oidc_models_grant_id_idx" ON "oidc_models"("grant_id");

-- CreateIndex
CREATE INDEX "oidc_models_expires_at_idx" ON "oidc_models"("expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "password_histories_password_history_id_key" ON "password_histories"("password_history_id");

-- CreateIndex
CREATE INDEX "password_histories_user_id_idx" ON "password_histories"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "policy_entries_policy_entry_id_key" ON "policy_entries"("policy_entry_id");

-- CreateIndex
CREATE INDEX "policy_entries_policy_id_idx" ON "policy_entries"("policy_id");

-- CreateIndex
CREATE INDEX "policy_entries_ability_id_idx" ON "policy_entries"("ability_id");

-- CreateIndex
CREATE UNIQUE INDEX "policy_entries_policy_id_ability_id_key" ON "policy_entries"("policy_id", "ability_id");

-- CreateIndex
CREATE UNIQUE INDEX "policies_policy_id_key" ON "policies"("policy_id");

-- CreateIndex
CREATE INDEX "policies_space_id_idx" ON "policies"("space_id");

-- CreateIndex
CREATE INDEX "policies_is_system_idx" ON "policies"("is_system");

-- CreateIndex
CREATE UNIQUE INDEX "policies_space_id_name_key" ON "policies"("space_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "posts_post_id_key" ON "posts"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "posts_content_id_key" ON "posts"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_profile_id_key" ON "profiles"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_nickname_key" ON "profiles"("nickname");

-- CreateIndex
CREATE UNIQUE INDEX "program_activities_program_activity_id_key" ON "program_activities"("program_activity_id");

-- CreateIndex
CREATE INDEX "program_activities_program_id_order_idx" ON "program_activities"("program_id", "order");

-- CreateIndex
CREATE INDEX "program_activities_task_id_idx" ON "program_activities"("task_id");

-- CreateIndex
CREATE UNIQUE INDEX "program_activities_program_id_task_id_key" ON "program_activities"("program_id", "task_id");

-- CreateIndex
CREATE UNIQUE INDEX "programs_program_id_key" ON "programs"("program_id");

-- CreateIndex
CREATE INDEX "programs_session_id_idx" ON "programs"("session_id");

-- CreateIndex
CREATE INDEX "programs_routine_id_idx" ON "programs"("routine_id");

-- CreateIndex
CREATE INDEX "programs_instructor_id_idx" ON "programs"("instructor_id");

-- CreateIndex
CREATE UNIQUE INDEX "programs_session_id_routine_id_key" ON "programs"("session_id", "routine_id");

-- CreateIndex
CREATE UNIQUE INDEX "reference_data_migration_history_reference_data_migration_h_key" ON "reference_data_migration_history"("reference_data_migration_history_id");

-- CreateIndex
CREATE UNIQUE INDEX "reference_data_migration_history_migration_key_key" ON "reference_data_migration_history"("migration_key");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_reservation_id_key" ON "reservations"("reservation_id");

-- CreateIndex
CREATE INDEX "reservations_space_id_occurrence_start_at_idx" ON "reservations"("space_id", "occurrence_start_at");

-- CreateIndex
CREATE INDEX "reservations_user_id_occurrence_start_at_idx" ON "reservations"("user_id", "occurrence_start_at");

-- CreateIndex
CREATE INDEX "reservations_program_id_occurrence_start_at_status_idx" ON "reservations"("program_id", "occurrence_start_at", "status");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_user_id_idempotency_key_key" ON "reservations"("user_id", "idempotency_key");

-- CreateIndex
CREATE UNIQUE INDEX "role_assignments_role_assignment_id_key" ON "role_assignments"("role_assignment_id");

-- CreateIndex
CREATE INDEX "role_assignments_role_id_idx" ON "role_assignments"("role_id");

-- CreateIndex
CREATE INDEX "role_assignments_policy_id_idx" ON "role_assignments"("policy_id");

-- CreateIndex
CREATE INDEX "role_assignments_is_active_idx" ON "role_assignments"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "role_assignments_role_id_policy_id_key" ON "role_assignments"("role_id", "policy_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_associations_role_association_id_key" ON "role_associations"("role_association_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_associations_role_id_key" ON "role_associations"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_associations_group_id_role_id_key" ON "role_associations"("group_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_classifications_role_classification_id_key" ON "role_classifications"("role_classification_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_classifications_role_id_key" ON "role_classifications"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_classifications_category_id_role_id_key" ON "role_classifications"("category_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_id_key" ON "roles"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "routines_routine_id_key" ON "routines"("routine_id");

-- CreateIndex
CREATE INDEX "routines_space_id_idx" ON "routines"("space_id");

-- CreateIndex
CREATE INDEX "routines_space_id_name_idx" ON "routines"("space_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "safe_confirmations_safe_confirmation_id_key" ON "safe_confirmations"("safe_confirmation_id");

-- CreateIndex
CREATE UNIQUE INDEX "safe_confirmations_safe_transaction_id_owner_key" ON "safe_confirmations"("safe_transaction_id", "owner");

-- CreateIndex
CREATE UNIQUE INDEX "safe_transactions_safe_transaction_id_key" ON "safe_transactions"("safe_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "safe_transactions_safe_tx_hash_key" ON "safe_transactions"("safe_tx_hash");

-- CreateIndex
CREATE UNIQUE INDEX "safe_wallets_safe_wallet_id_key" ON "safe_wallets"("safe_wallet_id");

-- CreateIndex
CREATE UNIQUE INDEX "safe_wallets_address_key" ON "safe_wallets"("address");

-- CreateIndex
CREATE INDEX "safe_wallets_space_id_idx" ON "safe_wallets"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "security_policies_security_policy_id_key" ON "security_policies"("security_policy_id");

-- CreateIndex
CREATE UNIQUE INDEX "security_policies_key_key" ON "security_policies"("key");

-- CreateIndex
CREATE UNIQUE INDEX "sentiment_analyses_sentiment_analysis_id_key" ON "sentiment_analyses"("sentiment_analysis_id");

-- CreateIndex
CREATE UNIQUE INDEX "sentiment_analyses_inquiry_id_key" ON "sentiment_analyses"("inquiry_id");

-- CreateIndex
CREATE UNIQUE INDEX "sentiment_analyses_message_id_key" ON "sentiment_analyses"("message_id");

-- CreateIndex
CREATE INDEX "sentiment_analyses_inquiry_id_idx" ON "sentiment_analyses"("inquiry_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_documents_service_document_id_key" ON "service_documents"("service_document_id");

-- CreateIndex
CREATE INDEX "service_documents_kind_platform_locale_status_idx" ON "service_documents"("kind", "platform", "locale", "status");

-- CreateIndex
CREATE INDEX "service_documents_status_idx" ON "service_documents"("status");

-- CreateIndex
CREATE INDEX "service_documents_published_at_idx" ON "service_documents"("published_at");

-- CreateIndex
CREATE UNIQUE INDEX "service_documents_kind_platform_locale_version_key" ON "service_documents"("kind", "platform", "locale", "version");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_session_id_key" ON "sessions"("session_id");

-- CreateIndex
CREATE INDEX "sessions_timeline_id_start_date_time_idx" ON "sessions"("timeline_id", "start_date_time");

-- CreateIndex
CREATE INDEX "sessions_start_date_time_end_date_time_idx" ON "sessions"("start_date_time", "end_date_time");

-- CreateIndex
CREATE INDEX "sessions_type_start_date_time_idx" ON "sessions"("type", "start_date_time");

-- CreateIndex
CREATE UNIQUE INDEX "space_associations_space_association_id_key" ON "space_associations"("space_association_id");

-- CreateIndex
CREATE UNIQUE INDEX "space_associations_space_id_group_id_key" ON "space_associations"("space_id", "group_id");

-- CreateIndex
CREATE UNIQUE INDEX "space_classifications_space_classification_id_key" ON "space_classifications"("space_classification_id");

-- CreateIndex
CREATE UNIQUE INDEX "space_classifications_space_id_key" ON "space_classifications"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "space_classifications_category_id_space_id_key" ON "space_classifications"("category_id", "space_id");

-- CreateIndex
CREATE UNIQUE INDEX "spaces_space_id_key" ON "spaces"("space_id");

-- CreateIndex
CREATE INDEX "spaces_content_language_code_idx" ON "spaces"("content_language_code");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_subject_id_key" ON "subjects"("subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_name_key" ON "subjects"("name");

-- CreateIndex
CREATE INDEX "subjects_group_idx" ON "subjects"("group");

-- CreateIndex
CREATE INDEX "subjects_is_system_idx" ON "subjects"("is_system");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_task_id_key" ON "tasks"("task_id");

-- CreateIndex
CREATE INDEX "tasks_space_id_idx" ON "tasks"("space_id");

-- CreateIndex
CREATE UNIQUE INDEX "template_variables_template_variable_id_key" ON "template_variables"("template_variable_id");

-- CreateIndex
CREATE UNIQUE INDEX "template_variables_template_id_name_key" ON "template_variables"("template_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "templates_template_id_key" ON "templates"("template_id");

-- CreateIndex
CREATE INDEX "templates_code_idx" ON "templates"("code");

-- CreateIndex
CREATE INDEX "templates_type_idx" ON "templates"("type");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_access_requests_tenant_access_request_id_key" ON "tenant_access_requests"("tenant_access_request_id");

-- CreateIndex
CREATE INDEX "tenant_access_requests_requester_id_idx" ON "tenant_access_requests"("requester_id");

-- CreateIndex
CREATE INDEX "tenant_access_requests_space_id_idx" ON "tenant_access_requests"("space_id");

-- CreateIndex
CREATE INDEX "tenant_access_requests_status_idx" ON "tenant_access_requests"("status");

-- CreateIndex
CREATE INDEX "tenant_access_requests_requester_id_space_id_status_idx" ON "tenant_access_requests"("requester_id", "space_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_tenant_id_key" ON "tenants"("tenant_id");

-- CreateIndex
CREATE INDEX "tenants_space_id_idx" ON "tenants"("space_id");

-- CreateIndex
CREATE INDEX "tenants_role_id_idx" ON "tenants"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_user_id_space_id_key" ON "tenants"("user_id", "space_id");

-- CreateIndex
CREATE UNIQUE INDEX "timelines_timeline_id_key" ON "timelines"("timeline_id");

-- CreateIndex
CREATE INDEX "timelines_space_id_idx" ON "timelines"("space_id");

-- CreateIndex
CREATE INDEX "timelines_space_id_created_at_idx" ON "timelines"("space_id", "created_at");

-- CreateIndex
CREATE INDEX "timelines_name_idx" ON "timelines"("name");

-- CreateIndex
CREATE UNIQUE INDEX "translations_translation_id_key" ON "translations"("translation_id");

-- CreateIndex
CREATE INDEX "translations_category_language_code_idx" ON "translations"("category", "language_code");

-- CreateIndex
CREATE INDEX "translations_key_idx" ON "translations"("key");

-- CreateIndex
CREATE UNIQUE INDEX "translations_language_code_key_key" ON "translations"("language_code", "key");

-- CreateIndex
CREATE UNIQUE INDEX "user_associations_user_association_id_key" ON "user_associations"("user_association_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_classifications_user_classification_id_key" ON "user_classifications"("user_classification_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_classifications_user_id_key" ON "user_classifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_classifications_category_id_user_id_key" ON "user_classifications"("category_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "users_name_key" ON "users"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_current_tenant_id_idx" ON "users"("current_tenant_id");

-- CreateIndex
CREATE UNIQUE INDEX "videos_video_id_key" ON "videos"("video_id");

-- CreateIndex
CREATE UNIQUE INDEX "videos_asset_id_key" ON "videos"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "whitelist_entries_whitelist_entry_id_key" ON "whitelist_entries"("whitelist_entry_id");

-- CreateIndex
CREATE INDEX "whitelist_entries_type_idx" ON "whitelist_entries"("type");

-- CreateIndex
CREATE UNIQUE INDEX "whitelist_entries_type_value_key" ON "whitelist_entries"("type", "value");

-- AddForeignKey
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abilities" ADD CONSTRAINT "abilities_action_id_fkey" FOREIGN KEY ("action_id") REFERENCES "actions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_agent_logs" ADD CONSTRAINT "ai_agent_logs_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_agent_logs" ADD CONSTRAINT "ai_agent_logs_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "inquiry_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_entries" ADD CONSTRAINT "album_entries_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_entries" ADD CONSTRAINT "album_entries_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_entries" ADD CONSTRAINT "album_entries_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "album_entries" ADD CONSTRAINT "album_entries_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_cover_asset_id_fkey" FOREIGN KEY ("cover_asset_id") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "albums" ADD CONSTRAINT "albums_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_audit_logs" ADD CONSTRAINT "auth_audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "derivatives" ADD CONSTRAINT "derivatives_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "derivatives" ADD CONSTRAINT "derivatives_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "derivatives" ADD CONSTRAINT "derivatives_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_verifications" ADD CONSTRAINT "email_verifications_verified_user_id_fkey" FOREIGN KEY ("verified_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fitness_centers" ADD CONSTRAINT "fitness_centers_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fitness_centers" ADD CONSTRAINT "fitness_centers_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_parent_folder_id_fkey" FOREIGN KEY ("parent_folder_id") REFERENCES "folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_attachments" ADD CONSTRAINT "inquiry_attachments_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "inquiry_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_messages" ADD CONSTRAINT "inquiry_messages_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "inquiry_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_messages" ADD CONSTRAINT "inquiry_messages_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_messages" ADD CONSTRAINT "inquiry_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_participants" ADD CONSTRAINT "inquiry_participants_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_participants" ADD CONSTRAINT "inquiry_participants_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "inquiry_threads"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_participants" ADD CONSTRAINT "inquiry_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_tags" ADD CONSTRAINT "inquiry_tags_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_threads" ADD CONSTRAINT "inquiry_threads_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiry_threads" ADD CONSTRAINT "inquiry_threads_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inquiries" ADD CONSTRAINT "inquiries_assignee_id_fkey" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password_histories" ADD CONSTRAINT "password_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_entries" ADD CONSTRAINT "policy_entries_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_entries" ADD CONSTRAINT "policy_entries_ability_id_fkey" FOREIGN KEY ("ability_id") REFERENCES "abilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policies" ADD CONSTRAINT "policies_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_content_id_fkey" FOREIGN KEY ("content_id") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "program_activities" ADD CONSTRAINT "program_activities_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_routine_id_fkey" FOREIGN KEY ("routine_id") REFERENCES "routines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "programs" ADD CONSTRAINT "programs_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_timeline_id_fkey" FOREIGN KEY ("timeline_id") REFERENCES "timelines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_program_id_fkey" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_assignments" ADD CONSTRAINT "role_assignments_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_associations" ADD CONSTRAINT "role_associations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_associations" ADD CONSTRAINT "role_associations_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_classifications" ADD CONSTRAINT "role_classifications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_classifications" ADD CONSTRAINT "role_classifications_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "routines" ADD CONSTRAINT "routines_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_confirmations" ADD CONSTRAINT "safe_confirmations_safe_transaction_id_fkey" FOREIGN KEY ("safe_transaction_id") REFERENCES "safe_transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_transactions" ADD CONSTRAINT "safe_transactions_safe_wallet_id_fkey" FOREIGN KEY ("safe_wallet_id") REFERENCES "safe_wallets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_wallets" ADD CONSTRAINT "safe_wallets_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safe_wallets" ADD CONSTRAINT "safe_wallets_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentiment_analyses" ADD CONSTRAINT "sentiment_analyses_inquiry_id_fkey" FOREIGN KEY ("inquiry_id") REFERENCES "inquiries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sentiment_analyses" ADD CONSTRAINT "sentiment_analyses_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "inquiry_messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_timeline_id_fkey" FOREIGN KEY ("timeline_id") REFERENCES "timelines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_associations" ADD CONSTRAINT "space_associations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_associations" ADD CONSTRAINT "space_associations_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_classifications" ADD CONSTRAINT "space_classifications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "space_classifications" ADD CONSTRAINT "space_classifications_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "template_variables" ADD CONSTRAINT "template_variables_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_requested_role_id_fkey" FOREIGN KEY ("requested_role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_previous_role_id_fkey" FOREIGN KEY ("previous_role_id") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_access_requests" ADD CONSTRAINT "tenant_access_requests_applied_tenant_id_fkey" FOREIGN KEY ("applied_tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "spaces"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "timelines" ADD CONSTRAINT "timelines_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_associations" ADD CONSTRAINT "user_associations_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_associations" ADD CONSTRAINT "user_associations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_classifications" ADD CONSTRAINT "user_classifications_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_classifications" ADD CONSTRAINT "user_classifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_tenant_id_fkey" FOREIGN KEY ("current_tenant_id") REFERENCES "tenants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_asset_id_fkey" FOREIGN KEY ("asset_id") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
