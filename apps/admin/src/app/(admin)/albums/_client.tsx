"use client";

import { type AlbumDto, useGetAlbums } from "@cocrepo/api";
import { EmptyState, PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import { Button, cn, Input, Spinner } from "@heroui/react";
import { Image as ImageIcon, Pencil, Plus, Trash2 } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Image from "next/image";
import { useRouter } from "next/navigation";

/**
 * 앨범 목록 페이지 - 클라이언트 컴포넌트
 */
function AlbumsPageClient() {
	const router = useRouter();

	const state = useLocalObservable(() => ({
		searchQuery: "",
	}));

	// API 조회
	const { data: response, isLoading } = useGetAlbums({
		take: 50,
		skip: 0,
		name: state.searchQuery || undefined,
	});

	const albums = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.total ?? 0;

	/**
	 * 검색어 변경 핸들러
	 */
	const handleSearchChange = (value: string) => {
		state.searchQuery = value;
	};

	/**
	 * 앨범 생성 버튼 클릭 핸들러
	 */
	const onClickCreateAlbumButton = () => {
		// TODO: 앨범 생성 모달 구현
		console.log("앨범 생성 모달 열기");
	};

	/**
	 * 앨범 카드 클릭 핸들러
	 */
	const onClickAlbumCard = (albumId: string) => {
		router.push(`/albums/${albumId}`);
	};

	/**
	 * 앨범 수정 버튼 클릭 핸들러
	 */
	const onClickEditAlbumButton = (albumId: string) => {
		// TODO: 앨범 수정 모달 구현
		console.log("앨범 수정 모달 열기:", albumId);
	};

	/**
	 * 앨범 삭제 버튼 클릭 핸들러
	 */
	const onClickDeleteAlbumButton = (albumId: string) => {
		// TODO: 앨범 삭제 확인 모달 구현
		console.log("앨범 삭제 확인:", albumId);
	};

	return (
		<PageSurface
			title="앨범"
			description="사용자 정의 에셋 컬렉션을 관리합니다."
			actions={
				<Button
					color="primary"
					startContent={<Plus className="size-4" />}
					onPress={onClickCreateAlbumButton}
				>
					앨범 생성
				</Button>
			}
		>
			<VStack gap={4}>
				{/* 검색 */}
				<SectionSurface>
					<Input
						placeholder="앨범명 검색..."
						value={state.searchQuery}
						onValueChange={handleSearchChange}
						className="max-w-md"
						startContent={
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-4 text-default-400"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
								/>
							</svg>
						}
						isClearable
					/>
				</SectionSurface>

				{/* 앨범 그리드 */}
				<SectionSurface>
					{isLoading ? (
						<VStack
							className="py-16"
							alignItems="center"
							justifyContent="center"
						>
							<Spinner size="lg" />
							<span className="text-sm text-foreground/60">
								앨범을 불러오는 중...
							</span>
						</VStack>
					) : albums.length === 0 ? (
						<EmptyState
							title="앨범이 없습니다"
							description="새로운 앨범을 생성해보세요."
							icon={<ImageIcon className="size-8 text-foreground/30" />}
							action={
								<Button
									color="primary"
									variant="flat"
									onPress={onClickCreateAlbumButton}
								>
									첫 앨범 만들기
								</Button>
							}
						/>
					) : (
						<>
							<div className="mb-4 text-sm text-foreground/60">
								총 {totalCount}개의 앨범
							</div>
							<div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
								{albums.map((album) => (
									<AlbumCard
										key={album.id}
										album={album}
										onClick={() => onClickAlbumCard(album.id)}
										onEdit={() => onClickEditAlbumButton(album.id)}
										onDelete={() => onClickDeleteAlbumButton(album.id)}
									/>
								))}
							</div>
						</>
					)}
				</SectionSurface>
			</VStack>
		</PageSurface>
	);
}

/**
 * 앨범 카드 컴포넌트
 */
interface AlbumCardProps {
	album: AlbumDto;
	onClick: () => void;
	onEdit: () => void;
	onDelete: () => void;
}

function AlbumCard({ album, onClick, onEdit, onDelete }: AlbumCardProps) {
	return (
		<div
			className={cn(
				"group relative overflow-hidden rounded-xl border border-divider bg-content1",
				"transition-all hover:border-primary/30 hover:shadow-md cursor-pointer",
			)}
		>
			{/* 커버 영역 */}
			<button
				type="button"
				onClick={onClick}
				className="w-full aspect-square bg-content2 block relative"
			>
				{album.coverAsset ? (
					<Image
						src={`/api/assets/${album.coverAsset.id}/file`}
						alt={album.name}
						fill
						className="object-cover"
						sizes="(max-width: 768px) 50vw, 16vw"
					/>
				) : (
					<VStack
						className="h-full w-full"
						alignItems="center"
						justifyContent="center"
					>
						<ImageIcon className="size-12 text-foreground/30" />
					</VStack>
				)}
			</button>

			{/* 정보 영역 */}
			<button
				type="button"
				onClick={onClick}
				className="w-full p-3 text-left block"
			>
				<p className="truncate font-medium text-sm">{album.name}</p>
				<p className="text-xs text-foreground/50">
					{formatDate(album.createdAt)}
				</p>
			</button>

			{/* 액션 버튼 (호버 시 표시) */}
			<div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onEdit();
					}}
					className="rounded bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-background"
				>
					<Pencil className="size-3.5 text-foreground/60" />
				</button>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onDelete();
					}}
					className="rounded bg-background/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-danger/20"
				>
					<Trash2 className="size-3.5 text-danger" />
				</button>
			</div>
		</div>
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

export default observer(AlbumsPageClient);
