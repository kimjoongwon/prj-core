"use client";
import { type GroundDto, useGetSpaceGround } from "@cocrepo/api/core/spaces";

import {
	DateTimeCell,
	Page,
	PageSurface,
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Badge, Button, Spinner } from "@heroui/react";
import { ArrowLeft, Pencil } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface GroundDetailPageClientProps {
	spaceId: string;
}

/**
 * 공간의 시설 detail 페이지 - 클라이언트 컴포넌트
 */
function GroundDetailPageClient({ spaceId }: GroundDetailPageClientProps) {
	const router = useRouter();

	// 시설 detail 조회 (prefetch로 초기 데이터 보장)
	const { data: response, isLoading } = useGetSpaceGround(spaceId);
	const ground = response?.data as GroundDto | undefined;

	/** 목록으로 이동 핸들러 */
	const onClickBackButton = () => {
		router.push("/spaces" as Route);
	};

	/** 수정 페이지 이동 핸들러 */
	const onClickEditButton = () => {
		router.push(`/spaces/${spaceId}/ground/edit` as Route);
	};

	// 로딩 상태
	if (isLoading && !response) {
		return (
			<Page top={<PageTitleBar title="시설 정보" description="로딩 중..." />}>
				<PageSurface>
					<SectionSurface>
						<div className="flex items-center justify-center p-8">
							<Spinner size="lg" />
						</div>
					</SectionSurface>
				</PageSurface>
			</Page>
		);
	}

	// 데이터 없음
	if (!ground) {
		const pageHeader = (
			<PageTitleBar
				title="시설 정보"
				description="시설 detail을 찾을 수 없습니다."
			/>
		);

		return (
			<Page top={pageHeader}>
				<PageSurface>
					<SectionSurface>
						<div className="flex flex-col items-center justify-center gap-4 p-8">
							<p className="text-default-500">
								시설 detail을 찾을 수 없습니다.
							</p>
							<Button
								variant="flat"
								startContent={<ArrowLeft className="size-4" />}
								onPress={onClickBackButton}
							>
								목록으로
							</Button>
						</div>
					</SectionSurface>
				</PageSurface>
			</Page>
		);
	}

	const pageHeader = (
		<PageTitleBar
			title={ground.name ?? "시설 정보"}
			description="공간에 연결된 시설 detail입니다."
			actions={
				<Button
					color="primary"
					variant="flat"
					startContent={<Pencil className="h-4 w-4" />}
					onPress={onClickEditButton}
				>
					수정
				</Button>
			}
		/>
	);

	return (
		<Page top={pageHeader}>
			<PageSurface>
				<VStack gap={4}>
					<SectionSurface>
						<Section top={<PageTitleBar level={2} title="기본 정보" />}>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="text-sm text-default-500">시설명</label>
									<p className="mt-1 font-medium">{ground.name}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">라벨</label>
									<div className="mt-1">
										{ground.label ? (
											<Badge color="secondary" variant="flat">
												{ground.label}
											</Badge>
										) : (
											<span className="text-default-400">-</span>
										)}
									</div>
								</div>
								<div>
									<label className="text-sm text-default-500">주소</label>
									<p className="mt-1">{ground.address}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">전화번호</label>
									<p className="mt-1">{ground.phone}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">이메일</label>
									<div className="mt-1">
										<a
											href={`mailto:${ground.email}`}
											className="text-primary hover:underline"
										>
											{ground.email}
										</a>
									</div>
								</div>
								<div>
									<label className="text-sm text-default-500">
										사업자등록번호
									</label>
									<p className="mt-1 font-mono">{ground.businessNo}</p>
								</div>
								<div>
									<label className="text-sm text-default-500">등록일</label>
									<div className="mt-1">
										<DateTimeCell value={ground.createdAt} />
									</div>
								</div>
								<div>
									<label className="text-sm text-default-500">수정일</label>
									<div className="mt-1">
										<DateTimeCell value={ground.updatedAt} />
									</div>
								</div>
							</div>
						</Section>
					</SectionSurface>
					<SectionSurface>
						<Section top={<PageTitleBar level={2} title="연결된 Space" />}>
							<div>
								<label className="text-sm text-default-500">Space ID</label>
								<p className="mt-1 font-mono text-sm">{spaceId}</p>
							</div>
						</Section>
					</SectionSurface>
				</VStack>
			</PageSurface>
		</Page>
	);
}

export default observer(GroundDetailPageClient);
