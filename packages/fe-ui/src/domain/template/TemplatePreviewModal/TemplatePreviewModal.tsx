"use client";

import { usePreviewTemplate } from "@cocrepo/api/core/templates";
import type { ModalState } from "@cocrepo/store";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Chip } from "../../../data-display/Chip/Chip";
import { VariableInputForm } from "../../../form/VariableInputForm";
import { Button } from "../../../input/Button/Button";
import { TemplateEmailPreviewResult } from "./TemplateEmailPreviewResult";
import type { TemplatePreviewModalState } from "./TemplatePreviewModalState";
import { TemplatePushPreviewResult } from "./TemplatePushPreviewResult";
import { TemplateSmsPreviewResult } from "./TemplateSmsPreviewResult";
import type { TemplatePreviewResult } from "./types";

/** 템플릿 미리보기 API와 상태별 body를 소유하는 Modal content입니다. */
export const TemplatePreviewModal = observer(function TemplatePreviewModal({
	state,
}: {
	state: ModalState<TemplatePreviewModalState>;
}) {
	const preview = state.contentState;
	const { mutateAsync: previewTemplate } = usePreviewTemplate();

	const handlePreview = async () => {
		preview.startPreview();

		try {
			const response = await previewTemplate({
				templateId: preview.templateId,
				data: { variables: preview.variableValues },
			});
			const result = (response as { data?: TemplatePreviewResult }).data;
			if (!result) {
				throw new Error("미리보기 결과가 없습니다.");
			}
			preview.completePreview(result);
		} catch (error) {
			preview.failPreview(
				error instanceof Error
					? error.message
					: "미리보기 실행 중 오류가 발생했습니다.",
			);
		}
	};

	return (
		<>
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-3">
					<p className="text-sm font-semibold text-foreground">변수 입력</p>
					<VariableInputForm
						variables={preview.variables}
						values={preview.variableValues}
						onChange={(values) => preview.setVariableValues(values)}
					/>
				</div>

				<Button
					variant="primary"
					onPress={handlePreview}
					isDisabled={preview.isLoading}
				>
					미리보기 실행
				</Button>

				{preview.status === "error" && preview.errorMessage ? (
					<p className="text-sm text-danger">{preview.errorMessage}</p>
				) : null}

				{preview.isLoading ? (
					<div className="flex justify-center">
						<Spinner size="lg" />
					</div>
				) : null}

				{preview.status === "success" && preview.result ? (
					<div className="flex flex-col gap-4">
						{preview.result.unresolvedVariables.length > 0 ? (
							<div className="flex flex-col gap-2">
								<p className="text-sm font-semibold text-warning">
									미치환 변수
								</p>
								<div className="flex flex-wrap gap-2">
									{preview.result.unresolvedVariables.map((variableName) => (
										<Chip
											key={variableName}
											color="warning"
											size="sm"
											variant="soft"
										>
											{variableName}
										</Chip>
									))}
								</div>
							</div>
						) : null}

						{preview.result.type === "EMAIL" ? (
							<TemplateEmailPreviewResult
								subject={preview.result.subject}
								content={preview.result.content}
							/>
						) : null}
						{preview.result.type === "SMS" ? (
							<TemplateSmsPreviewResult content={preview.result.content} />
						) : null}
						{preview.result.type === "PUSH" ? (
							<TemplatePushPreviewResult
								subject={preview.result.subject}
								content={preview.result.content}
							/>
						) : null}
					</div>
				) : null}
			</div>

			<div className="flex justify-end">
				<Button variant="tertiary" onPress={() => state.close()}>
					닫기
				</Button>
			</div>
		</>
	);
});

TemplatePreviewModal.displayName = "TemplatePreviewModal";
