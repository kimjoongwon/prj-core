"use client";

import { useDeletePolicy, useGetPolicies } from "@cocrepo/api/core/policies";
import { PolicyListPage } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function PoliciesPageRoute() {
	const router = useRouter();
	const { data: response, isLoading } = useGetPolicies();
	const { mutate: deletePolicy } = useDeletePolicy({
		mutation: {
			onSuccess: () => {
				toast.success("정책 삭제", {
					description: "정책 삭제 요청이 처리되었습니다.",
				});
			},
		},
	});

	const onClickCreateButton = () => {
		router.push("/policies/new" as Route);
	};

	const onClickPolicyRow = (policyId: string) => {
		router.push(`/policies/${policyId}` as Route);
	};

	const onClickEditPolicyButton = (policyId: string) => {
		router.push(`/policies/${policyId}/edit` as Route);
	};

	const onClickDeletePolicyButton = (policyId: string) => {
		deletePolicy({ policyId });
	};

	return (
		<PolicyListPage
			policies={response?.data}
			totalCount={response?.meta?.total ?? response?.data?.length ?? 0}
			isLoading={isLoading}
			onClickCreateButton={onClickCreateButton}
			onClickPolicyRow={onClickPolicyRow}
			onClickEditPolicyButton={onClickEditPolicyButton}
			onClickDeletePolicyButton={onClickDeletePolicyButton}
		/>
	);
});
