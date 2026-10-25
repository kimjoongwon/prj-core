export interface CommunityPostResult {
	id: string;
	title: string | null;
	text: string;
	authorName: string;
	createdAt: Date;
	isMine: boolean;
	isPinned: boolean;
}
