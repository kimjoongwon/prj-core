import { observer } from "mobx-react-lite";
import { type ReactNode } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	TextInput,
	View,
	type ViewProps,
} from "react-native";
import { tv } from "tailwind-variants";
import { Button } from "../../input/Button";
import { CommunityPostCard } from "../../data-display/CommunityPostCard";
import { Text } from "../../data-display/Text";
import { StatusFeedback } from "../../feedback/StatusFeedback";
import { BottomSheet } from "../../layout/BottomSheet";
import { ScreenActionBar } from "../../layout/ScreenActionBar";
import { ScreenFrame } from "../../layout/ScreenFrame";
import { HStack, VStack } from "../../rhythm";

export type CommunityScreenStatus = "loading" | "error" | "empty" | "ready";

export interface CommunityPostCardItem {
	authorName: ReactNode;
	createdAtLabel: ReactNode;
	id: string;
	isMine?: boolean;
	isPinned?: boolean;
	text: ReactNode;
	title?: ReactNode;
}

export interface CommunityComposerState {
	isOpen: boolean;
	isSubmitting?: boolean;
	text: string;
	textError?: ReactNode;
	title: string;
	titleError?: ReactNode;
}

export interface CommunityScreenProps extends Omit<ViewProps, "children"> {
	composer: CommunityComposerState;
	errorDescription?: ReactNode;
	onChangeComposerText?: (value: string) => void;
	onChangeComposerTitle?: (value: string) => void;
	onOpenChangeComposer?: (isOpen: boolean) => void;
	onPressCancelComposer?: () => void;
	onPressRetry?: () => void;
	onPressSubmitComposer?: () => void;
	onPressWrite?: () => void;
	posts: readonly CommunityPostCardItem[];
	status: CommunityScreenStatus;
}

export const CommunityScreen = observer((props: CommunityScreenProps) => {
	const {
		composer,
		errorDescription,
		onChangeComposerText,
		onChangeComposerTitle,
		onOpenChangeComposer,
		onPressCancelComposer,
		onPressRetry,
		onPressSubmitComposer,
		onPressWrite,
		posts,
		status,
		style,
		...viewProps
	} = props;
	let content: ReactNode;
	const isSubmitDisabled = composer.isSubmitting || !composer.text.trim();

	if (status === "loading") {
		content = (
			<StatusFeedback
				description="지점 커뮤니티의 최신 글을 확인하고 있습니다."
				key="community-loading"
				status="loading"
				title="커뮤니티를 불러오는 중"
			/>
		);
	} else if (status === "error") {
		content = (
			<StatusFeedback
				description={errorDescription}
				key="community-error"
				onPressPrimaryAction={onPressRetry}
				primaryActionLabel="다시 시도"
				status="error"
				title="커뮤니티를 확인할 수 없습니다"
			/>
		);
	} else if (status === "empty") {
		content = (
			<StatusFeedback
				description="첫 글을 남겨 지점 소식을 함께 나눠보세요."
				key="community-empty"
				onPressPrimaryAction={onPressWrite}
				primaryActionLabel="첫 글 쓰기"
				status="empty"
				title="아직 커뮤니티 글이 없습니다"
			/>
		);
	} else {
		content = posts.map((post) => (
			<CommunityPostCard
				authorName={post.authorName}
				createdAtLabel={post.createdAtLabel}
				isMine={post.isMine}
				isPinned={post.isPinned}
				key={post.id}
				text={post.text}
				title={post.title}
			/>
		));
	}

	return (
		<>
			<ScreenFrame
				{...viewProps}
				bottom={
					<ScreenActionBar
						description="수업 전후로 나누고 싶은 짧은 소식을 남길 수 있습니다."
						onPressPrimaryAction={onPressWrite}
						primaryActionLabel="글쓰기"
					/>
				}
				className={classNames.screenFrame()}
				contentClassName={classNames.root()}
				edges={["right", "left"]}
				style={style}
			>
				<ScrollView
					contentContainerClassName={classNames.contentContainer()}
					showsVerticalScrollIndicator={false}
				>
					<VStack>
						<View className={classNames.intro()}>
							<VStack>
								<Text className={classNames.eyebrow()}>COMMUNITY</Text>
								<Text className={classNames.title()}>지점 커뮤니티</Text>
								<Text className={classNames.description()}>
									같은 지점 회원들과 수업 후기, 준비물, 운영 소식을 편하게
									나눕니다.
								</Text>
							</VStack>
						</View>
						<VStack>{content}</VStack>
					</VStack>
				</ScrollView>
			</ScreenFrame>
			<BottomSheet
				description="짧은 안내나 질문을 남겨 주세요. 댓글과 첨부는 다음 단계에서 다룹니다."
				isOpen={composer.isOpen}
				onOpenChange={onOpenChangeComposer}
				title="커뮤니티 글쓰기"
			>
				<KeyboardAvoidingView
					behavior={Platform.OS === "ios" ? "padding" : undefined}
					className={classNames.composer()}
				>
					<VStack>
						<VStack>
							<Text className={classNames.label()}>제목</Text>
							<TextInput
								accessibilityLabel="커뮤니티 글 제목"
								className={classNames.input()}
								editable={!composer.isSubmitting}
								maxLength={80}
								onChangeText={onChangeComposerTitle}
								placeholder="선택 입력"
								placeholderTextColorClassName="text-muted"
								value={composer.title}
							/>
							{composer.titleError ? (
								<Text accessibilityRole="alert" className={classNames.error()}>
									{composer.titleError}
								</Text>
							) : null}
						</VStack>
						<VStack>
							<Text className={classNames.label()}>내용</Text>
							<TextInput
								accessibilityLabel="커뮤니티 글 내용"
								className={classNames.textarea()}
								editable={!composer.isSubmitting}
								maxLength={1000}
								multiline
								onChangeText={onChangeComposerText}
								placeholder="나누고 싶은 내용을 적어 주세요."
								placeholderTextColorClassName="text-muted"
								style={{
									textAlignVertical: "top",
								}}
								value={composer.text}
							/>
							{composer.textError ? (
								<Text accessibilityRole="alert" className={classNames.error()}>
									{composer.textError}
								</Text>
							) : null}
						</VStack>
						<HStack>
							<Button
								accessibilityLabel="글쓰기 취소"
								className={classNames.sheetAction()}
								isDisabled={composer.isSubmitting}
								onPress={onPressCancelComposer}
								variant="secondary"
							>
								취소
							</Button>
							<Button
								accessibilityLabel="글 등록"
								className={classNames.sheetAction()}
								isDisabled={isSubmitDisabled}
								onPress={onPressSubmitComposer}
								variant="primary"
							>
								{composer.isSubmitting ? "등록 중" : "등록"}
							</Button>
						</HStack>
					</VStack>
				</KeyboardAvoidingView>
			</BottomSheet>
		</>
	);
});

CommunityScreen.displayName = "CommunityScreen";

const communityScreenClassNames = tv({
	slots: {
		composer: "gap-4 pt-2",
		contentContainer: "px-4 pb-8 pt-4",
		description: "text-[13px] leading-5 text-muted",
		error: "text-xs leading-4 text-danger",
		eyebrow: "text-xs font-extrabold leading-4 text-accent",
		input:
			"min-h-11 rounded-lg border border-border bg-surface-secondary px-3 text-sm text-foreground",
		intro: "rounded-2xl border border-border bg-surface p-4",
		label: "text-[13px] font-extrabold leading-5 text-foreground",
		root: "flex-1 bg-background",
		screenFrame: "bg-background",
		sheetAction: "min-h-11 flex-1 rounded-lg",
		textarea:
			"min-h-28 rounded-lg border border-border bg-surface-secondary px-3 py-3 text-sm leading-5 text-foreground",
		title: "text-xl font-extrabold leading-7 text-foreground",
	},
});

const classNames = communityScreenClassNames();
