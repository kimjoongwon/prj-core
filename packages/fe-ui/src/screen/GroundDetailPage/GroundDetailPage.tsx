"use client";

import {
	DateTimeCell,
	DetailPage,
	DetailPageSurface,
	DetailSection,
	DetailSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, Pencil } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Badge, Button, Spinner } from "../../design-system/primitives";

export interface GroundDetailPageGround {
	name: string;
	label?: string | null;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
	createdAt: string;
	updatedAt?: string | null;
}

export interface GroundDetailPageProps {
	spaceId: string;
	ground?: GroundDetailPageGround;
	isLoading: boolean;
	isNotFound: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
}

export const GroundDetailPage = observer(
	({
		spaceId,
		ground,
		isLoading,
		isNotFound,
		onClickBackButton,
		onClickEditButton,
	}: GroundDetailPageProps) => {
		if (isLoading) {
			return (
				<DetailPage
					top={<PageTitleBar title="시설 정보" description="로딩 중..." />}
				>
					<DetailPageSurface>
						<DetailSectionCard>
							<div className="flex items-center justify-center p-8">
								<Spinner size="lg" />
							</div>
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		if (isNotFound || !ground) {
			return (
				<DetailPage
					top={
						<PageTitleBar
							title="시설 정보"
							description="시설 detail을 찾을 수 없습니다."
						/>
					}
				>
					<DetailPageSurface>
						<DetailSectionCard>
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
						</DetailSectionCard>
					</DetailPageSurface>
				</DetailPage>
			);
		}

		return (
			<DetailPage
				top={
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
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						<DetailSectionCard>
							<DetailSection top={<PageTitleBar level={2} title="기본 정보" />}>
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
											<DateTimeCell value={ground.updatedAt ?? "-"} />
										</div>
									</div>
								</div>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection
								top={<PageTitleBar level={2} title="연결된 Space" />}
							>
								<div>
									<label className="text-sm text-default-500">Space ID</label>
									<p className="mt-1 font-mono text-sm">{spaceId}</p>
								</div>
							</DetailSection>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
			</DetailPage>
		);
	},
);
