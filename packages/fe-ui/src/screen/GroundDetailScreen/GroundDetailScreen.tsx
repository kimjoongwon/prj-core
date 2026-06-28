"use client";

import {
	DateTimeCell,
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Badge, Spinner } from "@heroui/react";
import { ArrowLeft, Pencil } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
export interface GroundDetailScreenGround {
	name: string;
	label?: string | null;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
	createdAt: string;
	updatedAt?: string | null;
}
export interface GroundDetailScreenProps {
	spaceId: string;
	ground?: GroundDetailScreenGround;
	isLoading: boolean;
	isNotFound: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
}
export const GroundDetailScreen = observer(
	({
		spaceId,
		ground,
		isLoading,
		isNotFound,
		onClickBackButton,
		onClickEditButton,
	}: GroundDetailScreenProps) => {
		if (isLoading) {
			return (
				<VStack gap="section" fullWidth>
					<PageTitleBar title="시설 정보" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center p-8">
									<Spinner size="lg" />
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (isNotFound || !ground) {
			return (
				<VStack gap="section" fullWidth>
					<PageTitleBar
						title="시설 정보"
						description="시설 detail을 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">시설 detail을 찾을 수 없습니다.</p>
									<Button
										variant="flat"
										startContent={<ArrowLeft className="size-4" />}
										onPress={onClickBackButton}
									>
										목록으로
									</Button>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		return (
			<VStack gap="section" fullWidth>
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
				<SectionSurface>
					<Section>
						<Section.Header>
							<PageTitleBar level={2} title="기본 정보" />
						</Section.Header>
						<Section.Body>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="text-sm text-muted">시설명</label>
									<p className="mt-1 font-medium">{ground.name}</p>
								</div>
								<div>
									<label className="text-sm text-muted">라벨</label>
									<div className="mt-1">
										{ground.label ? (
											<Badge color="accent" variant="soft">
												{ground.label}
											</Badge>
										) : (
											<span className="text-muted">-</span>
										)}
									</div>
								</div>
								<div>
									<label className="text-sm text-muted">주소</label>
									<p className="mt-1">{ground.address}</p>
								</div>
								<div>
									<label className="text-sm text-muted">전화번호</label>
									<p className="mt-1">{ground.phone}</p>
								</div>
								<div>
									<label className="text-sm text-muted">이메일</label>
									<div className="mt-1">
										<a
											href={`mailto:${ground.email}`}
											className="text-accent hover:underline"
										>
											{ground.email}
										</a>
									</div>
								</div>
								<div>
									<label className="text-sm text-muted">사업자등록번호</label>
									<p className="mt-1 font-mono">{ground.businessNo}</p>
								</div>
								<div>
									<label className="text-sm text-muted">등록일</label>
									<div className="mt-1">
										<DateTimeCell value={ground.createdAt} />
									</div>
								</div>
								<div>
									<label className="text-sm text-muted">수정일</label>
									<div className="mt-1">
										<DateTimeCell value={ground.updatedAt ?? "-"} />
									</div>
								</div>
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
				<SectionSurface>
					<Section>
						<Section.Header>
							<PageTitleBar level={2} title="연결된 Space" />
						</Section.Header>
						<Section.Body>
							<div>
								<label className="text-sm text-muted">Space ID</label>
								<p className="mt-1 font-mono text-sm">{spaceId}</p>
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
