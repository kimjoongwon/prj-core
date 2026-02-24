"use client";

import { type AlbumEntryDto, useGetAlbumById } from "@cocrepo/api";
import { EmptyState, PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import { Button, cn, Spinner } from "@heroui/react";
import {
	ArrowLeft,
	GripVertical,
	Image as ImageIcon,
	Plus,
	Trash2,
} from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
	albumId: string;
}

/**
 * 앨범 상세 페이지 - 클라이언트 컴포넌트
 */
function AlbumDetailPageClient({ albumId }: Props) {
	const router = useRouter();

	const state = useLocalObservable(() => ({
		isReorderMode: false,
		searchQuery: "",
	}));

	// API 조회
	const { data: response, isLoading } = useGetAlbumById(albumId);

	const album = response?.data;
	const entries = album?.entries ?? [];
	const entryCount = entries.length;

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/albums");
	};

	/**
	 * 에셋 추가 버튼 클릭 핸들러
	 */
	const onClickAddAssetButton = () => {
		// TODO: 에셋 선택기 모달 구현
		console.log("에셋 추가 모달 열기");
	};

	/**
	 * 순서 편집 모드 토글 핸들러
	 */
	const onClickToggleReorderButton = () => {
		state.isReorderMode = !state.isReorderMode;
	};

	/**
	 * 앨범 수정 버튼 클릭 핸들러
	 */
	const onClickEditAlbumButton = () => {
		// TODO: 앨범 수정 모달 구현
		console.log("앨범 수정 모달 열기");
	};

	/**
	 * 앨범 삭제 버튼 클릭 핸들러
	 */
	const onClickDeleteAlbumButton = () => {
		// TODO: 앨범 삭제 확인 모달 구현
		console.log("앨범 삭제 확인");
	};

	/**
	 * 엔트리 제거 핸들러
	 */
	const onClickRemoveEntryButton = (entryId: string) => {
		// TODO: 엔트리 제거 API 호출
		console.log("엔트리 제거:", entryId);
	};

	/**
	 * 캡션 클릭 핸들러
	 */
	const onClickCaption = (entry: AlbumEntryDto) => {
		// TODO: 캡션 편집 모달 구현
		console.log("캡션 편집:", entry.id);
	};

	if (isLoading) {
		return (
			<PageSurface>
				<VStack className="py-32" alignItems="center" justifyContent="center">
					<Spinner size="lg" />
					<span className="text-sm text-foreground/60">
						앨범을 불러오는 중...
					</span>
				</VStack>
			</PageSurface>
		);
	}

	if (!album) {
		return (
			<PageSurface>
				<EmptyState
					title="앨범을 찾을 수 없습니다"
					description="요청하신 앨범이 존재하지 않거나 삭제되었습니다."
					action={
						<Button color="primary" variant="flat" onPress={onClickBackButton}>
							앨범 목록으로
						</Button>
					}
				/>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			description={album.description || "앨범에 포함된 에셋을 관리합니다."}
			actions={
				<div className="flex items-center gap-2">
					<Button
						color="primary"
						variant="flat"
						startContent={<Plus className="size-4" />}
						onPress={onClickAddAssetButton}
					>
						에셋 추가
					</Button>
					<Button
						variant="flat"
						onPress={onClickToggleReorderButton}
						color={state.isReorderMode ? "primary" : "default"}
					>
						{state.isReorderMode ? "편집 완료" : "순서 편집"}
					</Button>
					<Button variant="flat" onPress={onClickEditAlbumButton}>
						수정
					</Button>
					<Button
						variant="flat"
						color="danger"
						onPress={onClickDeleteAlbumButton}
					>
						삭제
					</Button>
				</div>
			}
		>
			<VStack gap={4}>
				{/* 앨범 헤더 */}
				<SectionSurface>
					<div className="flex items-center gap-4">
						<Button
							variant="light"
							size="sm"
							isIconOnly
							onPress={onClickBackButton}
						>
							<ArrowLeft className="size-4" />
						</Button>
						{album.coverAsset ? (
							<Image
								src={`/api/assets/${album.coverAsset.id}/file`}
								alt={album.name}
								width={64}
								height={64}
								className="size-16 rounded-lg object-cover"
							/>
						) : (
							<div className="size-16 rounded-lg bg-content2 flex items-center justify-center">
								<ImageIcon className="size-8 text-foreground/30" />
							</div>
						)}
						<div>
							<h2 className="text-xl font-semibold">{album.name}</h2>
							{album.description && (
								<p className="text-sm text-foreground/60">
									{album.description}
								</p>
							)}
							<p className="text-xs text-foreground/50 mt-1">
								총 {entryCount}개의 에셋 · 생성일: {formatDate(album.createdAt)}
							</p>
						</div>
					</div>
				</SectionSurface>

				{/* 에셋 그리드 */}
				<SectionSurface>
					{entries.length === 0 ? (
						<EmptyState
							title="에셋이 없습니다"
							description="이 앨범에 에셋을 추가해보세요."
							icon={<ImageIcon className="size-8 text-foreground/30" />}
							action={
								<Button
									color="primary"
									variant="flat"
									onPress={onClickAddAssetButton}
								>
									에셋 추가
								</Button>
							}
						/>
					) : (
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
							{entries.map((entry) => (
								<div
									key={entry.id}
									className={cn(
										"group relative overflow-hidden rounded-xl border bg-content1",
										state.isReorderMode
											? "border-primary/30"
											: "border-divider",
									)}
								>
									{/* 드래그 핸들 */}
									{state.isReorderMode && (
										<div className="absolute left-2 top-2 z-10 cursor-move rounded bg-background/80 p-1">
											<GripVertical className="size-4 text-foreground/60" />
										</div>
									)}

									{/* 미리보기 */}
									<div className="aspect-square bg-content2">
										{entry.asset ? (
											<Image
												src={`/api/assets/${entry.asset.id}/file`}
												alt={entry.caption || ""}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 50vw, 20vw"
											/>
										) : (
											<VStack
												className="h-full w-full"
												alignItems="center"
												justifyContent="center"
											>
												<ImageIcon className="size-8 text-foreground/30" />
											</VStack>
										)}
									</div>

									{/* 캡션 */}
									<button
										type="button"
										onClick={() => onClickCaption(entry)}
										className="w-full p-2 text-left hover:bg-content2 transition-colors"
									>
										<p className="truncate text-xs">
											{entry.caption ||
												entry.asset?.originalName ||
												"캡션 없음"}
										</p>
									</button>

									{/* 삭제 버튼 */}
									{!state.isReorderMode && (
										<button
											type="button"
											onClick={() => onClickRemoveEntryButton(entry.id)}
											className="absolute right-2 top-2 rounded bg-danger/80 p-1 opacity-0 transition-opacity group-hover:opacity-100"
										>
											<Trash2 className="size-3 text-white" />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

/**
 * 날짜 포맷팅 함수
 */
function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

export default observer(AlbumDetailPageClient);
