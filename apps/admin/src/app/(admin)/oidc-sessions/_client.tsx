"use client";

import {
	useGetOidcSessions,
	useRevokeOidcSession,
	useRevokeOidcSessionsByGrant,
	type OidcSessionDto,
} from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	DateTimeCell,
	ExpiryCell,
	MetaDataGrid,
	ModelTypeCell,
	PageSurface,
	RevokeButtonCell,
	SectionSurface,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { Ban } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useQueryClient } from "@tanstack/react-query";

/**
 * 모델 타입 필터 옵션
 */
const MODEL_TYPE_OPTIONS = [
	{ value: "", label: "전체" },
	{ value: "AccessToken", label: "Access Token" },
	{ value: "RefreshToken", label: "Refresh Token" },
	{ value: "AuthorizationCode", label: "Auth Code" },
	{ value: "Session", label: "Session" },
	{ value: "Grant", label: "Grant" },
	{ value: "ClientCredentials", label: "Client Credentials" },
	{ value: "DeviceCode", label: "Device Code" },
	{ value: "Interaction", label: "Interaction" },
];

/**
 * 좌측 입력 정의 (모델 타입 필터)
 */
const leftInputs: InputConfig[] = [
	{
		type: "select",
		id: "modelType",
		placeholder: "모델 타입",
		props: {
			options: MODEL_TYPE_OPTIONS,
		},
	},
];

/**
 * OIDC 세션 목록 페이지 - 클라이언트 컴포넌트
 */
function OidcSessionsPageClient() {
	const queryClient = useQueryClient();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const state = useLocalObservable(() => ({
		grantIdToRevoke: null as string | null,
	}));

	const [queryStates, setQueryStates] =
		useMetaDataGridQueryStates(leftInputs);

	const { data: response, isLoading } = useGetOidcSessions({
		take: queryStates.take,
		skip: queryStates.skip,
		modelType: queryStates.modelType || undefined,
	});

	const { mutate: revokeSession } = useRevokeOidcSession({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["getOidcSessions"] });
			},
		},
	});

	const { mutate: revokeByGrant, isPending: isRevokingByGrant } =
		useRevokeOidcSessionsByGrant({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: ["getOidcSessions"],
					});
					onOpenChange();
				},
			},
		});

	const sessions = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.totalCount ?? 0;

	const onClickRevokeSession = (key: string) => {
		revokeSession({ key });
	};

	const onClickGrantId = (grantId: string) => {
		state.grantIdToRevoke = grantId;
		onOpen();
	};

	const onClickConfirmRevokeByGrant = () => {
		if (state.grantIdToRevoke) {
			revokeByGrant({ grantId: state.grantIdToRevoke });
		}
	};

	const columns: MetaDataGridColumnConfig<OidcSessionDto>[] = [
		{
			field: "key",
			label: "키",
			size: 140,
			isRequired: true,
			cell: ({ getValue }) => {
				const key = getValue() as string;
				return (
					<span className="font-mono text-sm" title={key}>
						{key.slice(0, 8)}...
					</span>
				);
			},
		},
		{
			field: "modelType",
			label: "모델 타입",
			size: 140,
			cell: ({ getValue }) => (
				<ModelTypeCell type={getValue() as string} />
			),
		},
		{
			field: "grantId",
			label: "Grant ID",
			size: 140,
			cell: ({ getValue }) => {
				const grantId = getValue() as string | null;
				if (!grantId) return <span className="text-default-400">-</span>;
				return (
					<Button
						size="sm"
						variant="light"
						className="font-mono text-sm"
						title={`${grantId}\n클릭하면 이 Grant의 모든 세션/토큰을 일괄 폐기합니다.`}
						onPress={() => onClickGrantId(grantId)}
					>
						{grantId.slice(0, 8)}...
					</Button>
				);
			},
		},
		{
			field: "expiresAt",
			label: "만료 시간",
			size: 180,
			cell: ({ getValue }) => (
				<ExpiryCell expiresAt={getValue() as string | null} />
			),
		},
		{
			field: "createdAt",
			label: "등록일",
			size: 150,
			cell: ({ getValue }) => (
				<DateTimeCell value={getValue() as string} />
			),
		},
		{
			field: "actions",
			label: "",
			size: 100,
			cell: ({ row }) => (
				<RevokeButtonCell
					onRevoke={() => onClickRevokeSession(row.original.key)}
				/>
			),
		},
	];

	return (
		<PageSurface
			title="OIDC 세션/토큰"
			description="OIDC 세션 및 토큰을 조회하고 관리합니다."
		>
			<SectionSurface>
				<MetaDataGrid
					config={{
						entity: "OidcSession",
						data: sessions,
						totalCount,
						isLoading,
						queryStates,
						setQueryStates,
						columns,
						leftInputs,
						emptyMessage: "등록된 OIDC 세션/토큰이 없습니다.",
					}}
				/>
			</SectionSurface>

			{/* Grant 일괄 폐기 확인 모달 */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>Grant 일괄 폐기</ModalHeader>
							<ModalBody>
								<p>
									이 Grant에 연결된 모든 세션 및 토큰을 일괄
									폐기하시겠습니까?
								</p>
								{state.grantIdToRevoke && (
									<p className="mt-2 rounded-lg bg-default-100 p-2 font-mono text-sm">
										Grant ID: {state.grantIdToRevoke}
									</p>
								)}
							</ModalBody>
							<ModalFooter>
								<Button variant="flat" onPress={onClose}>
									취소
								</Button>
								<Button
									color="danger"
									startContent={<Ban className="h-4 w-4" />}
									onPress={onClickConfirmRevokeByGrant}
									isLoading={isRevokingByGrant}
								>
									일괄 폐기
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</PageSurface>
	);
}

export default observer(OidcSessionsPageClient);
