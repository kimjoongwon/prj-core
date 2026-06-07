"use client";

import { FormPage, PageTitleBar } from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Spinner } from "@heroui/react";
import {
	type PolicyCreatePageAbilityOption,
	type PolicyCreatePageChangeHandlers,
	type PolicyCreatePageForm,
	PolicyFormBody,
} from "../PolicyCreatePage/PolicyCreatePage";

export interface PolicyEditPagePolicy {
	id: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	isSystem?: boolean;
	abilityIds?: string[];
}

export interface PolicyEditPageProps {
	status: "loading" | "not_found" | "ready";
	form: PolicyCreatePageForm;
	abilities: PolicyCreatePageAbilityOption[];
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onClickSubmitButton: () => void;
	onChange: PolicyCreatePageChangeHandlers;
}

export const PolicyEditPage = observer((props: PolicyEditPageProps) => {
	if (props.status === "loading") {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="정책 수정"
						description="정책을 불러오는 중입니다."
					/>
				}
			>
				<div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface/70 p-8">
					<Spinner size="sm" />
					<span className="text-muted">로딩 중...</span>
				</div>
			</FormPage>
		);
	}

	if (props.status === "not_found") {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="정책 수정"
						description="정책을 찾을 수 없습니다."
					/>
				}
			>
				<div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface/70 p-8">
					<p className="text-muted">정책을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={props.onClickBackButton}>
						목록으로
					</Button>
				</div>
			</FormPage>
		);
	}

	const selectedAbilityIds = new Set(props.form.abilityIds);

	return (
		<FormPage
			top={
				<PageTitleBar
					title="정책 수정"
					description="정책 기본 정보와 연결 Ability를 수정합니다."
					actions={
						<div className="flex gap-2">
							<Button
								variant="flat"
								startContent={<ArrowLeft className="h-4 w-4" />}
								onPress={props.onClickBackButton}
							>
								목록으로
							</Button>
							<Button
								color="primary"
								startContent={<Save className="h-4 w-4" />}
								isLoading={props.isSubmitting}
								onPress={props.onClickSubmitButton}
							>
								저장
							</Button>
						</div>
					}
				/>
			}
		>
			<PolicyFormBody
				form={props.form}
				abilities={props.abilities}
				selectedAbilityIds={selectedAbilityIds}
				onChange={props.onChange}
			/>
		</FormPage>
	);
});

PolicyEditPage.displayName = "PolicyEditPage";
