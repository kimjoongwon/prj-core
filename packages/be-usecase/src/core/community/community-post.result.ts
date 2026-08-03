export interface CommunityPostResult {
	id: bigint;
	title: string | null;
	text: string;
	authorName: string;
	createdAt: Date;
	isMine: boolean;
	isPinned: boolean;
}
