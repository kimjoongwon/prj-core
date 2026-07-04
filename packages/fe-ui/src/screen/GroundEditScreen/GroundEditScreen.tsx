"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	GroundForm,
	type GroundFormState,
} from "../../form/GroundForm";
import { Button } from "../../input/Button/Button";
import { Section } from "../../layout/Section/Section";
import { SectionSurface } from "../../surface";
import { VStack } from "../../rhythm";
import { PageTitleBar } from "../../widget/PageTitleBar";

export interface GroundEditScreenProps {
	title?: ReactNode;
	description?: ReactNode;
	state: GroundFormState;
	readOnly?: boolean;
	actions?: ReactNode;
	isLoading: boolean;
	isNotFound: boolean;
	isSubmitPending: boolean;
	onClickCancelButton: () => void;
	onClickSaveButton?: () => void;
}

/** Ground aggregate의 생성/상세/수정 route가 공유하는 편집 화면입니다. */
export const GroundEditScreen = observer(
	({
		title,
		description,
		state,
		readOnly = false,
		actions,
		isLoading,
		isNotFound,
		isSubmitPending,
		onClickCancelButton,
		onClickSaveButton,
	}: GroundEditScreenProps) => {
		const resolvedTitle = title ?? (readOnly ? "시설 정보" : "시설 정보 수정");
		const resolvedDescription =
			description ??
			(readOnly ? "시설 기본 정보를 확인합니다." : "시설 detail을 수정합니다.");

		if (isLoading) {
			return (
				<VStack fullWidth>
					<PageTitleBar title={resolvedTitle} description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center gap-2 p-8">
									<Spinner size="sm" />
									<span className="text-muted">로딩 중...</span>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (isNotFound) {
			return (
				<VStack fullWidth>
					<PageTitleBar
						title={resolvedTitle}
						description="시설 detail을 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">
										시설 detail을 찾을 수 없습니다.
									</p>
									<Button variant="flat" onPress={onClickCancelButton}>
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
					title={resolvedTitle}
					description={resolvedDescription}
					actions={actions}
				/>
				<SectionSurface>
					<Section>
						<Section.Header>
							<PageTitleBar level={2} title="기본 정보" />
						</Section.Header>
						<Section.Body>
							<VStack>
								<GroundForm
									state={state}
									readOnly={readOnly}
								/>
								{readOnly ? null : (
									<div className="flex justify-end gap-2 pt-4">
										<Button variant="flat" onPress={onClickCancelButton}>
											취소
										</Button>
										<Button
											color="primary"
											onPress={onClickSaveButton}
											isLoading={isSubmitPending}
										>
											저장
										</Button>
									</div>
								)}
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
