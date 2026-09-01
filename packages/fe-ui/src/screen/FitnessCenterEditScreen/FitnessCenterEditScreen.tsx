"use client";

import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import {
	FitnessCenterForm,
	type FitnessCenterFormState,
} from "../../form/FitnessCenterForm";
import { Button } from "../../input/Button/Button";
import { Screen } from "../../layout/Screen";
import { Section } from "../../layout/Section/Section";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";

export interface FitnessCenterEditScreenProps {
	title?: ReactNode;
	description?: ReactNode;
	state: FitnessCenterFormState;
	readOnly?: boolean;
	actions?: ReactNode;
	isLoading: boolean;
	isNotFound: boolean;
	isSubmitPending: boolean;
	onClickCancelButton: () => void;
	onClickSaveButton?: () => void;
}

/** FitnessCenter 상세/수정 route가 공유하는 편집 화면입니다. */
export const FitnessCenterEditScreen = observer(
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
	}: FitnessCenterEditScreenProps) => {
		const resolvedTitle =
			title ?? (readOnly ? "피트니스 센터 정보" : "피트니스 센터 정보 수정");
		const resolvedDescription =
			description ??
			(readOnly
				? "피트니스 센터 기본 정보를 확인합니다."
				: "피트니스 센터 정보와 Space 콘텐츠 언어를 수정합니다.");
		if (isLoading) {
			return (
				<VStack fullWidth>
					<Screen.Header title={resolvedTitle} description="로딩 중..." />
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
					<Screen.Header
						title={resolvedTitle}
						description="피트니스 센터 정보를 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">
										피트니스 센터 정보를 찾을 수 없습니다.
									</p>
									<Button variant="tertiary" onPress={onClickCancelButton}>
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
				<Screen.Header
					title={resolvedTitle}
					description={resolvedDescription}
					actions={actions}
				/>
				<SectionSurface>
					<Section>
						<Section.Header title="피트니스 센터 정보" />
						<Section.Body>
							<VStack>
								<FitnessCenterForm state={state} readOnly={readOnly} />
								{readOnly ? null : (
									<div className="flex justify-end gap-2 pt-4">
										<Button variant="tertiary" onPress={onClickCancelButton}>
											취소
										</Button>
										<Button
											variant="primary"
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
