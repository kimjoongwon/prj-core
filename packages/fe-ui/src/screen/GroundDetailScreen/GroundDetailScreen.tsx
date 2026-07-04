"use client";

import {
	Chip,
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, Pencil } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../input/Button/Button";

/** 시설 상세 화면에서 실제로 표시하는 시설 정보입니다. */
export interface GroundDetailScreenGround {
	name: string;
	label?: string | null;
	address: string;
	phone: string;
	email: string;
}

/** 시설 상세 화면의 순수 표시 계약입니다. */
export interface GroundDetailScreenProps {
	ground?: GroundDetailScreenGround;
	isNotFound: boolean;
	onClickBackButton: () => void;
	onClickEditButton: () => void;
}

/** 시설의 핵심 식별/연락 정보만 보여주는 상세 화면입니다. */
export const GroundDetailScreen = observer(
	({
		ground,
		isNotFound,
		onClickBackButton,
		onClickEditButton,
	}: GroundDetailScreenProps) => {
		if (isNotFound || !ground) {
			return (
				<VStack fullWidth>
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
			<VStack fullWidth>
				<PageTitleBar
					title={ground.name ?? "시설 정보"}
					description="시설 기본 정보를 확인합니다."
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
											<Chip color="primary" variant="soft">
												{ground.label}
											</Chip>
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
							</div>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
