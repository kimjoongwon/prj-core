import {
	CommunityScreen,
	type CommunityPostCardItem,
	type CommunityScreenStatus,
} from "@cocrepo/mo-ui";
import {
	getGetCommunityPostsQueryKey,
	useCreateCommunityPost,
	useGetCommunityPosts,
} from "@cocrepo/api/core/community";
import { ApiClientError } from "@cocrepo/api/core/client";
import type { CommunityPostDto } from "@cocrepo/api/core/model";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { formatDatabaseId } from "@cocrepo/type";
import { mobileApiScope } from "@/auth/mobile-api-scope";

const COMMUNITY_QUERY_PARAMS = {
	skip: 0,
	take: 20,
};

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

const formatCommunityCreatedAtLabel = (date: Date) => {
	if (Number.isNaN(date.getTime())) {
		return "날짜 미정";
	}

	const diff = Date.now() - date.getTime();
	if (diff < MS_PER_MINUTE) {
		return "방금 전";
	}

	if (diff < MS_PER_HOUR) {
		return `${Math.max(1, Math.floor(diff / MS_PER_MINUTE))}분 전`;
	}

	if (diff < MS_PER_DAY) {
		return `${Math.floor(diff / MS_PER_HOUR)}시간 전`;
	}

	return `${date.getMonth() + 1}월 ${date.getDate()}일`;
};

const getApiErrorDescription = (error: unknown) => {
	const status = (error as ApiClientError).status;

	switch (status) {
		case 401:
			return "로그인이 만료되었습니다. 다시 로그인한 뒤 확인해 주세요.";
		case 403:
			return "현재 지점 커뮤니티를 볼 권한이 없습니다.";
		default:
			return "커뮤니티 글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.";
	}
};

const toCommunityPostCardItem = (
	post: CommunityPostDto,
): CommunityPostCardItem => ({
	authorName: post.authorName,
	createdAtLabel: formatCommunityCreatedAtLabel(post.createdAt),
	id: formatDatabaseId(post.id),
	isMine: post.isMine,
	isPinned: post.isPinned,
	text: post.text,
	title: post.title ?? undefined,
});

const getCommunityStatus = (params: {
	isError: boolean;
	isLoading: boolean;
	itemCount: number;
}): CommunityScreenStatus => {
	if (params.isLoading) {
		return "loading";
	}

	if (params.isError) {
		return "error";
	}

	if (params.itemCount === 0) {
		return "empty";
	}

	return "ready";
};

const CommunityTabRoute = observer(() => {
	const queryClient = useQueryClient();
	const [isComposerOpen, setIsComposerOpen] = useState(false);
	const [composerTitle, setComposerTitle] = useState("");
	const [composerText, setComposerText] = useState("");
	const [composerTextError, setComposerTextError] = useState("");
	const isSpaceSelectionPending = !mobileApiScope.isSpaceSelectionResolved;
	const hasSelectedSpace = Boolean(mobileApiScope.spaceId);
	const isSpaceUnavailable =
		mobileApiScope.isSpaceSelectionResolved && !hasSelectedSpace;
	const communityQuery = useGetCommunityPosts(COMMUNITY_QUERY_PARAMS, {
		query: { enabled: hasSelectedSpace },
	});
	const createPostMutation = useCreateCommunityPost({
	});
	const posts = communityQuery.data?.data ?? [];
	const items = posts.map(toCommunityPostCardItem);
	const status = getCommunityStatus({
		isError: isSpaceUnavailable || communityQuery.isError,
		isLoading:
			isSpaceSelectionPending ||
			(hasSelectedSpace && communityQuery.isLoading),
		itemCount: items.length,
	});

	const resetComposer = () => {
		setComposerTitle("");
		setComposerText("");
		setComposerTextError("");
	};

	const onPressWrite = () => {
		setComposerTextError("");
		setIsComposerOpen(true);
	};

	const onOpenChangeComposer = (isOpen: boolean) => {
		setIsComposerOpen(isOpen);
		if (!isOpen) {
			resetComposer();
		}
	};

	const onChangeComposerTitle = (value: string) => {
		setComposerTitle(value);
	};

	const onChangeComposerText = (value: string) => {
		setComposerText(value);
		if (value.trim()) {
			setComposerTextError("");
		}
	};

	const onPressCancelComposer = () => {
		setIsComposerOpen(false);
		resetComposer();
	};

	const onPressRetry = () => {
		void communityQuery.refetch();
	};

	const onPressSubmitComposer = async () => {
		const text = composerText.trim();
		const title = composerTitle.trim();

		if (!text) {
			setComposerTextError("내용을 입력해 주세요.");
			return;
		}

		try {
			await createPostMutation.mutateAsync({
				data: {
					text,
					title: title || undefined,
				},
			});
			setIsComposerOpen(false);
			resetComposer();
			await queryClient.invalidateQueries({
				queryKey: getGetCommunityPostsQueryKey(COMMUNITY_QUERY_PARAMS),
			});
		} catch {
			setComposerTextError("글을 등록하지 못했습니다. 잠시 후 다시 시도해 주세요.");
		}
	};

	return (
		<CommunityScreen
			composer={{
				isOpen: isComposerOpen,
				isSubmitting: createPostMutation.isPending,
				text: composerText,
				textError: composerTextError || undefined,
				title: composerTitle,
			}}
			errorDescription={
				isSpaceUnavailable
					? "커뮤니티를 볼 지점을 먼저 선택해 주세요."
					: communityQuery.isError
						? getApiErrorDescription(communityQuery.error)
						: undefined
			}
			onChangeComposerText={onChangeComposerText}
			onChangeComposerTitle={onChangeComposerTitle}
			onOpenChangeComposer={onOpenChangeComposer}
			onPressCancelComposer={onPressCancelComposer}
			onPressRetry={onPressRetry}
			onPressSubmitComposer={onPressSubmitComposer}
			onPressWrite={onPressWrite}
			posts={items}
			status={status}
		/>
	);
});

export default CommunityTabRoute;
