"use client";

import { SectionSurface } from "../../surface";
import { ArrowLeft, Send } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Select } from "../../selection/Select/Select";
import { Skeleton } from "../../feedback/Skeleton/Skeleton";
import { TextArea } from "../../input/TextArea/TextArea";
import { ListBox } from "@heroui/react";
import { HStack } from "../../rhythm/HStack/HStack";
import { VStack } from "../../rhythm/VStack/VStack";
import { PageTitleBar } from "../../widget/PageTitleBar";
export interface TenantAccessRequestCreateOption {
	value: string;
	label: string;
	description?: string;
}
export interface TenantAccessRequestCreateForm {
	spaceId: string;
	requestedRoleId: string;
	reason: string;
}
export interface TenantAccessRequestCreateScreenProps {
	form: TenantAccessRequestCreateForm;
	spaceOptions: TenantAccessRequestCreateOption[];
	roleOptions: TenantAccessRequestCreateOption[];
	isLoading: boolean;
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onChangeSpaceSelection: (spaceId: string) => void;
	onChangeRoleSelection: (roleId: string) => void;
	onChangeReasonTextArea: (reason: string) => void;
	onClickSubmitButton: () => void;
}
export const TenantAccessRequestCreateScreen = observer(
	({
		form,
		spaceOptions,
		roleOptions,
		isLoading,
		isSubmitting,
		onClickBackButton,
		onChangeSpaceSelection,
		onChangeRoleSelection,
		onChangeReasonTextArea,
		onClickSubmitButton,
	}: TenantAccessRequestCreateScreenProps) => (
		<VStack gap={5}>
			<PageTitleBar
				title="접근 신청"
				description="필요한 Space와 역할을 선택해 승인을 요청합니다."
				actions={
					<Button
						variant="flat"
						startContent={<ArrowLeft className="size-4" />}
						onPress={onClickBackButton}
					>
						목록
					</Button>
				}
			/>
			<SectionSurface>
				{isLoading ? (
					<Skeleton className="h-72 rounded-lg" />
				) : (
					<VStack gap={4}>
						<PageTitleBar
							level={2}
							title="신청 정보"
							description="승인자는 선택한 역할을 변경하지 않고 승인 또는 반려합니다."
						/>
						<div className="grid gap-4 md:grid-cols-2">
							<Select
								label="Space"
								labelPlacement="outside"
								placeholder="Space 선택"
								value={form.spaceId || null}
								onChange={(value) => {
									onChangeSpaceSelection(String(value ?? ""));
								}}
								isRequired
							>
								{spaceOptions.map((option) => (
									<ListBox.Item
										key={option.value}
										id={option.value}
										textValue={option.label}
									>
										<div className="flex flex-col">
											<span>{option.label}</span>
											{option.description ? (
												<span className="text-xs text-muted">
													{option.description}
												</span>
											) : null}
										</div>
									</ListBox.Item>
								))}
							</Select>
							<Select
								label="희망 역할"
								labelPlacement="outside"
								placeholder="Role 선택"
								value={form.requestedRoleId || null}
								onChange={(value) => {
									onChangeRoleSelection(String(value ?? ""));
								}}
								isRequired
							>
								{roleOptions.map((option) => (
									<ListBox.Item
										key={option.value}
										id={option.value}
										textValue={option.label}
									>
										<div className="flex flex-col">
											<span>{option.label}</span>
											{option.description ? (
												<span className="text-xs text-muted">
													{option.description}
												</span>
											) : null}
										</div>
									</ListBox.Item>
								))}
							</Select>
						</div>
						<TextArea
							label="신청 사유"
							labelPlacement="outside"
							placeholder="권한이 필요한 업무 목적을 입력하세요."
							value={form.reason}
							onValueChange={onChangeReasonTextArea}
							maxLength={1000}
							description={`${form.reason.length} / 1000`}
						/>
						<HStack justifyContent="end" fullWidth>
							<Button variant="flat" onPress={onClickBackButton}>
								취소
							</Button>
							<Button
								color="primary"
								startContent={<Send className="size-4" />}
								isLoading={isSubmitting}
								isDisabled={!form.spaceId || !form.requestedRoleId}
								onPress={onClickSubmitButton}
							>
								신청 제출
							</Button>
						</HStack>
					</VStack>
				)}
			</SectionSurface>
		</VStack>
	),
);
