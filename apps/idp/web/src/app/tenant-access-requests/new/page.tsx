"use client";

import {
	getGetMyTenantAccessRequestsQueryKey,
	type TenantAccessRequestCreateFormBootstrapDto,
	useCreateTenantAccessRequest,
	useGetCreateTenantAccessRequestForm,
} from "@cocrepo/api/core/tenant-access-requests";
import { IDP_PATHS } from "@cocrepo/constant";
import {
	type TenantAccessRequestCreateOption,
	TenantAccessRequestCreatePage,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default observer(function TenantAccessRequestNewPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: formResponse, isLoading } =
		useGetCreateTenantAccessRequestForm();
	const formState = useLocalObservable(() => ({
		initialized: false,
		spaceId: "",
		requestedRoleId: "",
		reason: "",
		setFromBootstrap(bootstrap: TenantAccessRequestCreateFormBootstrapDto) {
			if (this.initialized) {
				return;
			}
			this.spaceId = String(bootstrap.defaultObject.spaceId ?? "");
			this.requestedRoleId = String(
				bootstrap.defaultObject.requestedRoleId ?? "",
			);
			this.reason = String(bootstrap.defaultObject.reason ?? "");
			this.initialized = true;
		},
		setSpaceId(spaceId: string) {
			this.spaceId = spaceId;
		},
		setRequestedRoleId(roleId: string) {
			this.requestedRoleId = roleId;
		},
		setReason(reason: string) {
			this.reason = reason;
		},
	}));
	const { mutate: createRequest, isPending: isSubmitting } =
		useCreateTenantAccessRequest({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getGetMyTenantAccessRequestsQueryKey(),
					});
					addToast({
						title: "접근 신청을 제출했습니다.",
						color: "success",
					});
					router.push(IDP_PATHS.TENANT_ACCESS_REQUESTS as Route);
				},
				onError: () => {
					addToast({
						title: "접근 신청 제출에 실패했습니다.",
						color: "danger",
					});
				},
			},
		});

	useEffect(() => {
		if (formResponse?.data) {
			formState.setFromBootstrap(formResponse.data);
		}
	}, [formResponse?.data, formState]);

	return (
		<TenantAccessRequestCreatePage
			form={{
				spaceId: formState.spaceId,
				requestedRoleId: formState.requestedRoleId,
				reason: formState.reason,
			}}
			spaceOptions={mapOptions(formResponse?.data?.options.spaceId)}
			roleOptions={mapOptions(formResponse?.data?.options.requestedRoleId)}
			isLoading={isLoading}
			isSubmitting={isSubmitting}
			onClickBackButton={() => {
				router.push(IDP_PATHS.TENANT_ACCESS_REQUESTS as Route);
			}}
			onChangeSpaceSelection={(spaceId) => {
				formState.setSpaceId(spaceId);
			}}
			onChangeRoleSelection={(roleId) => {
				formState.setRequestedRoleId(roleId);
			}}
			onChangeReasonTextarea={(reason) => {
				formState.setReason(reason);
			}}
			onClickSubmitButton={() => {
				createRequest({
					data: {
						spaceId: formState.spaceId,
						requestedRoleId: formState.requestedRoleId,
						reason: formState.reason || null,
					},
				});
			}}
		/>
	);
});

function mapOptions(
	options?: Array<{ value: string; label: string; description?: string }>,
): TenantAccessRequestCreateOption[] {
	return (options ?? []).map((option) => ({
		value: option.value,
		label: option.label,
		description: option.description,
	}));
}
