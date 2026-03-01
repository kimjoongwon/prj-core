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
	id: string;
	threadId: string;
	inquiryId: string;
	senderType: "USER" | "AI" | "SYSTEM";
	senderId: string | null;
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
	id: string;
	inquiryId: string;
	threadId: string | null;
	userId: string;
	role: "CUSTOMER" | "AGENT" | "SUPERVISOR";
	isOnline: boolean;
	isTyping: boolean;
	unreadCount: number;
	joinedAt: string;
	lastSeenAt: string | null;
	lastReadAt: string | null;
	leftAt: string | null;
}
