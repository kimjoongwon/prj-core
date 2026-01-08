"use client";

import {
	useGetConfig,
	useSaveGlobalConfig,
	useSaveRoleConfig,
	useSaveUserConfig,
} from "@cocrepo/api";
import {
	type ColumnConfig,
	ColumnSettingsTable,
	UnsavedChangesIndicator,
} from "@cocrepo/ui";
import {
	Button,
	Card,
	CardBody,
	Select,
	SelectItem,
	Spinner,
	Tab,
	Tabs,
} from "@heroui/react";
import { Save, Settings } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useRef } from "react";
import { type ConfigScope, UIConfigsPageStore } from "./_stores";

/** 엔티티 옵션 목록 */
const ENTITY_OPTIONS = [
	{ value: "User", label: "회원" },
	{ value: "Reservation", label: "예약" },
	{ value: "Ground", label: "그라운드" },
	{ value: "Content", label: "콘텐츠" },
];

/** 역할 옵션 목록 */
const ROLE_OPTIONS = [
	{ value: "SUPER_ADMIN", label: "최고 관리자" },
	{ value: "ADMIN", label: "관리자" },
	{ value: "USER", label: "일반 사용자" },
];

/**
 * UI 설정 관리 페이지
 *
 * 테이블 컬럼의 표시/숨김, 순서, 너비를 관리합니다.
 * - 설정 범위 선택 (전역/역할별)
 * - 엔티티 선택
 * - 컬럼 설정 테이블
 * - 변경사항 저장
 */
function UIConfigsPage() {
	// Store 인스턴스 (useRef 사용)
	const storeRef = useRef<UIConfigsPageStore | null>(null);
	if (!storeRef.current) {
		storeRef.current = new UIConfigsPageStore();
	}
	const store = storeRef.current;

	// API 훅
	const {
		data: configData,
		isLoading: isLoadingConfig,
		refetch: refetchConfig,
	} = useGetConfig(store.selectedEntity, "table");

	const saveUserConfigMutation = useSaveUserConfig();
	const saveRoleConfigMutation = useSaveRoleConfig();
	const saveGlobalConfigMutation = useSaveGlobalConfig();

	// API 데이터로 초기화
	useEffect(() => {
		if (configData?.data?.config?.fields) {
			// API에서 받은 설정을 ColumnConfig 형식으로 변환
			const apiColumns: ColumnConfig[] = configData.data.config.fields.map(
				(field, index) => ({
					id: String(index + 1),
					field: field.field,
					label: field.label || field.field,
					visible: field.visible,
					width: field.width || 150,
					sortOrder: field.order,
					responsive: { desktop: true, tablet: true, mobile: true },
				}),
			);
			store.setOriginalColumns(apiColumns);
		} else {
			// API 데이터가 없으면 목 데이터 사용
			const mockColumns: ColumnConfig[] = [
				{
					id: "1",
					field: "name",
					label: "이름",
					visible: true,
					width: 150,
					sortOrder: 1,
					responsive: { desktop: true, tablet: true, mobile: true },
				},
				{
					id: "2",
					field: "email",
					label: "이메일",
					visible: true,
					width: 200,
					sortOrder: 2,
					responsive: { desktop: true, tablet: true, mobile: false },
				},
				{
					id: "3",
					field: "phone",
					label: "전화번호",
					visible: true,
					width: 120,
					sortOrder: 3,
					responsive: { desktop: true, tablet: false, mobile: false },
				},
				{
					id: "4",
					field: "createdAt",
					label: "가입일",
					visible: false,
					width: 100,
					sortOrder: 4,
					responsive: { desktop: true, tablet: false, mobile: false },
				},
			];
			store.setOriginalColumns(mockColumns);
		}
	}, [configData, store]);

	// 로딩 상태 업데이트
	useEffect(() => {
		store.setLoading(isLoadingConfig);
	}, [isLoadingConfig, store]);

	// 범위 탭 변경 핸들러
	const onChangeScopeTab = (key: React.Key) => {
		store.setScope(key as ConfigScope);
	};

	// 역할 선택 핸들러
	const onSelectRoleDropdown = (keys: "all" | Set<React.Key>) => {
		if (keys !== "all") {
			const selected = [...keys][0] as string;
			store.setSelectedRoleId(selected);
		}
	};

	// 엔티티 선택 핸들러
	const onSelectEntityDropdown = (keys: "all" | Set<React.Key>) => {
		if (keys !== "all") {
			const selected = [...keys][0] as string;
			store.setSelectedEntity(selected);
		}
	};

	// 컬럼 변경 핸들러
	const onChangeColumns = (columns: ColumnConfig[]) => {
		store.setColumns(columns);
	};

	// 저장 버튼 클릭 핸들러
	const onClickSaveButton = async () => {
		if (!store.isDirty) return;

		store.setSaving(true);
		store.setError(null);

		try {
			// ColumnConfig를 API DTO 형식으로 변환
			const fields = store.columns.map((col) => ({
				field: col.field,
				visible: col.visible,
				order: col.sortOrder,
				label: col.label,
				width: col.width,
			}));

			const payload = {
				fields,
				pageSize: 20,
			};

			// scope에 따라 적절한 API 호출
			if (store.scope === "GLOBAL") {
				await saveGlobalConfigMutation.mutateAsync({
					entity: store.selectedEntity,
					view: "table",
					data: payload,
				});
			} else if (store.scope === "ROLE" && store.selectedRoleId) {
				await saveRoleConfigMutation.mutateAsync({
					entity: store.selectedEntity,
					view: "table",
					roleId: store.selectedRoleId,
					data: payload,
				});
			} else {
				// USER scope
				await saveUserConfigMutation.mutateAsync({
					entity: store.selectedEntity,
					view: "table",
					data: payload,
				});
			}

			// 저장 성공 후 데이터 새로고침
			await refetchConfig();
			store.setOriginalColumns(store.columns);
		} catch (error) {
			console.error("Failed to save config:", error);
			store.setError("설정 저장에 실패했습니다.");
		} finally {
			store.setSaving(false);
		}
	};

	// 초기화 버튼 클릭 핸들러
	const onClickResetButton = () => {
		store.resetChanges();
	};

	return (
		<div className="flex flex-col gap-6 p-4 md:p-6">
			{/* 헤더 */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-1">
					<div className="flex items-center gap-2">
						<Settings className="h-6 w-6 text-primary" />
						<h1 className="text-2xl font-bold md:text-3xl">UI 설정 관리</h1>
					</div>
					<p className="text-default-500">
						테이블 컬럼의 표시/숨김, 순서, 너비를 설정합니다
					</p>
				</div>

				{/* 저장 버튼 */}
				<div className="flex gap-2">
					{store.isDirty && (
						<Button
							variant="flat"
							onPress={onClickResetButton}
							isDisabled={store.isSaving}
						>
							<span>초기화</span>
						</Button>
					)}
					<Button
						color="primary"
						startContent={
							store.isSaving ? (
								<Spinner size="sm" color="current" />
							) : (
								<Save className="h-4 w-4" />
							)
						}
						onPress={onClickSaveButton}
						isDisabled={!store.isDirty || store.isSaving}
					>
						<span>{store.isSaving ? "저장 중..." : "저장"}</span>
					</Button>
				</div>
			</div>

			{/* 에러 표시 */}
			{store.error && (
				<div className="rounded-lg bg-danger-50 p-4">
					<span className="text-danger">{store.error}</span>
				</div>
			)}

			{/* 범위/역할/엔티티 선택 */}
			<Card className="border-none shadow-sm">
				<CardBody className="flex flex-col gap-4 p-4 md:flex-row md:items-center">
					{/* 범위 탭 */}
					<Tabs
						selectedKey={store.scope}
						onSelectionChange={onChangeScopeTab}
						aria-label="설정 범위"
					>
						<Tab key="GLOBAL" title="전역 설정" />
						<Tab key="ROLE" title="역할별 설정" />
					</Tabs>

					{/* 역할 선택 (ROLE 범위일 때만) */}
					{store.scope === "ROLE" && (
						<Select
							label="역할"
							placeholder="역할 선택"
							selectedKeys={store.selectedRoleId ? [store.selectedRoleId] : []}
							onSelectionChange={onSelectRoleDropdown}
							className="max-w-xs"
						>
							{ROLE_OPTIONS.map((role) => (
								<SelectItem key={role.value}>{role.label}</SelectItem>
							))}
						</Select>
					)}

					{/* 엔티티 선택 */}
					<Select
						label="엔티티"
						selectedKeys={[store.selectedEntity]}
						onSelectionChange={onSelectEntityDropdown}
						className="max-w-xs"
					>
						{ENTITY_OPTIONS.map((entity) => (
							<SelectItem key={entity.value}>{entity.label}</SelectItem>
						))}
					</Select>
				</CardBody>
			</Card>

			{/* 컬럼 설정 테이블 */}
			{store.isLoading ? (
				<div className="flex items-center justify-center py-12">
					<Spinner size="lg" />
				</div>
			) : (
				<ColumnSettingsTable
					entityLabel={
						ENTITY_OPTIONS.find((e) => e.value === store.selectedEntity)
							?.label || store.selectedEntity
					}
					columns={store.columns}
					onChange={onChangeColumns}
				/>
			)}

			{/* 안내 문구 */}
			<div className="flex flex-col gap-1 text-sm text-default-400">
				<span>[D]=Desktop [T]=Tablet [M]=Mobile</span>
				<span>* 드래그로 순서 변경, 체크박스로 표시/숨김 토글</span>
				<span>* 코드 기본값에서 변경된 항목만 저장됩니다</span>
			</div>

			{/* 변경사항 표시 */}
			<UnsavedChangesIndicator
				visible={store.isDirty}
				isSaving={store.isSaving}
				onSave={onClickSaveButton}
				onReset={onClickResetButton}
			/>
		</div>
	);
}

export default observer(UIConfigsPage);
