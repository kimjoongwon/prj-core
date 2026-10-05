import {
	BigIntIdField,
	BooleanField,
	DateField,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator/field";

export class CommunityPostDto {
	@BigIntIdField({ description: "커뮤니티 게시글 ID" })
	id!: bigint;

	@StringFieldOptional({
		description: "게시글 제목",
		maxLength: 80,
		nullable: true,
	})
	title!: string | null;

	@StringField({ description: "게시글 본문", maxLength: 1000 })
	text!: string;

	@StringField({ description: "작성자 표시 이름" })
	authorName!: string;

	@DateField({ description: "작성 시각" })
	createdAt!: Date;

	@BooleanField({ description: "현재 로그인 사용자가 작성한 글 여부" })
	isMine!: boolean;

	@BooleanField({ description: "공지/고정 게시글 여부" })
	isPinned!: boolean;
}
