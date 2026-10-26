import type { DecimalId } from "./database-id";

export type InquiryStatus =
	| "NEW"
	| "IN_PROGRESS"
	| "PENDING_CUSTOMER"
	| "RESOLVED"
	| "CLOSED";

export type InquiryChannel = "WEB" | "EMAIL" | "PHONE" | "CHAT" | "SOCIAL";

export type InquiryCategory =
	| "GENERAL"
	| "TECHNICAL"
	| "BILLING"
	| "COMPLAINT"
	| "FEEDBACK"
	| "OTHER";

export type InquiryPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface InquiryMessage {
	id: DecimalId;
	threadId: DecimalId;
	inquiryId: DecimalId;
	senderType: "USER" | "AI" | "SYSTEM";
	senderId: DecimalId | null;
	content: string;
	contentType: string;
	isEdited: boolean;
	isDeleted: boolean;
	deliveredAt: string | null;
	readAt: string | null;
	editedAt: string | null;
	createdAt: string;
}

export interface InquiryParticipant {
	id: DecimalId;
	inquiryId: DecimalId;
	threadId: DecimalId | null;
	userId: DecimalId;
	role: "CUSTOMER" | "AGENT" | "SUPERVISOR";
	isOnline: boolean;
	isTyping: boolean;
	unreadCount: number;
	joinedAt: string;
	lastSeenAt: string | null;
	lastReadAt: string | null;
	leftAt: string | null;
}
