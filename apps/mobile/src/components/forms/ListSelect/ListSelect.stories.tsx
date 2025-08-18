import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { ListSelect } from "./ListSelect";
import type { ListSelectProps } from "./ListSelect";
import { ObservedListSelect } from "./index";
import { ListItem } from "../../ui/ListItem";
import { Text } from "../../ui/Text";
import { makeAutoObservable } from "mobx";

// 샘플 데이터 타입 정의
type User = { id: number; name: string; email: string };

const meta: Meta<ListSelectProps<User>> = {
	title: "forms/ListSelect",
	component: ListSelect as any, // 오버로드된 컴포넌트를 위해 any로 캐스팅
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"선택 가능한 리스트 컴포넌트입니다. 단일 선택(single)과 다중 선택(multiple) 모드를 지원합니다.",
			},
		},
	},
	decorators: [
		(Story) => (
			<View style={{ padding: 16, minWidth: 320, minHeight: 400 }}>
				<Story />
			</View>
		),
	],
};

export default meta;
type Story = StoryObj<ListSelectProps<User>>;

// 샘플 데이터
const 샘플사용자들: User[] = [
	{ id: 1, name: "홍길동", email: "hong@example.com" },
	{ id: 2, name: "김철수", email: "kim@example.com" },
	{ id: 3, name: "이영희", email: "lee@example.com" },
	{ id: 4, name: "박민수", email: "park@example.com" },
];

export const 단일_선택: Story = {
	render: () => {
		const [selectedUser, setSelectedUser] = useState<User | null>(null);

		return (
			<View style={{ gap: 16 }}>
				<Text style={{ fontSize: 16, fontWeight: "600" }}>
					선택된 사용자: {selectedUser?.name || "없음"}
				</Text>
				<ListSelect<User>
					data={샘플사용자들}
					selectionMode="single"
					onChangeSelection={setSelectedUser}
					renderItem={(user, isSelected) => (
						<ListItem
							title={user.name}
							description={user.email}
							isSelected={isSelected}
						/>
					)}
				/>
			</View>
		);
	},
};

export const 다중_선택: Story = {
	render: () => {
		const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

		return (
			<View style={{ gap: 16 }}>
				<Text style={{ fontSize: 16, fontWeight: "600" }}>
					선택된 사용자: {selectedUsers.length}명
				</Text>
				<ListSelect<User>
					data={샘플사용자들}
					selectionMode="multiple"
					onChangeSelection={setSelectedUsers}
					renderItem={(user, isSelected) => (
						<ListItem
							title={user.name}
							description={user.email}
							isSelected={isSelected}
						/>
					)}
				/>
			</View>
		);
	},
};

export const 기본_선택값: Story = {
	render: () => {
		const [selectedUser, setSelectedUser] = useState<User | null>(
			샘플사용자들[0],
		);

		return (
			<View style={{ gap: 16 }}>
				<Text style={{ fontSize: 16, fontWeight: "600" }}>
					선택된 사용자: {selectedUser?.name || "없음"}
				</Text>
				<ListSelect<User>
					data={샘플사용자들}
					selectionMode="single"
					selectedItems={selectedUser}
					onChangeSelection={(user) => setSelectedUser(user)}
					renderItem={(user, isSelected) => (
						<ListItem
							title={user.name}
							description={user.email}
							isSelected={isSelected}
						/>
					)}
				/>
			</View>
		);
	},
};

export const 커스텀_렌더링: Story = {
	render: () => {
		const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

		return (
			<View style={{ gap: 16 }}>
				<Text style={{ fontSize: 16, fontWeight: "600" }}>
					선택된 사용자: {selectedUsers.length}명
				</Text>
				<ListSelect<User>
					data={샘플사용자들}
					selectionMode="multiple"
					onChangeSelection={setSelectedUsers}
					renderItem={(user, isSelected) => (
						<View
							style={{
								padding: 16,
								backgroundColor: isSelected ? "#E3F2FD" : "#F5F5F5",
								borderRadius: 8,
								borderWidth: isSelected ? 2 : 1,
								borderColor: isSelected ? "#2196F3" : "#E0E0E0",
							}}
						>
							<Text style={{ fontWeight: isSelected ? "600" : "400" }}>
								{user.name}
							</Text>
							<Text style={{ fontSize: 12, opacity: 0.6 }}>{user.email}</Text>
						</View>
					)}
				/>
			</View>
		);
	},
};

export const 비활성화_상태: Story = {
	render: () => (
		<View style={{ gap: 16 }}>
			<Text style={{ fontSize: 16, fontWeight: "600", opacity: 0.5 }}>
				비활성화된 리스트
			</Text>
			<ListSelect<User>
				data={샘플사용자들}
				selectionMode="single"
				isDisabled={true}
				renderItem={(user, isSelected) => (
					<ListItem
						title={user.name}
						description={user.email}
						isSelected={isSelected}
					/>
				)}
			/>
		</View>
	),
};

// MobX 스토리들
class TestFormState {
	selectedUser: User | null = null;
	selectedUsers: User[] = [];

	constructor() {
		makeAutoObservable(this);
	}
}

export const MobX_단일_선택: Story = {
	render: () => {
		const formState = new TestFormState();

		return (
			<View style={{ gap: 16 }}>
				<Text style={{ fontSize: 16, fontWeight: "600" }}>MobX 단일 선택</Text>
				<ObservedListSelect<TestFormState, User>
					state={formState}
					path="selectedUser"
					data={샘플사용자들}
					selectionMode="single"
					renderItem={(user, isSelected) => (
						<ListItem
							title={user.name}
							description={user.email}
							isSelected={isSelected}
						/>
					)}
				/>
			</View>
		);
	},
};

export const MobX_다중_선택: Story = {
	render: () => {
		const formState = new TestFormState();

		return (
			<View style={{ gap: 16 }}>
				<Text style={{ fontSize: 16, fontWeight: "600" }}>MobX 다중 선택</Text>
				<ObservedListSelect<TestFormState, User>
					state={formState}
					path="selectedUsers"
					data={샘플사용자들}
					selectionMode="multiple"
					renderItem={(user, isSelected) => (
						<ListItem
							title={user.name}
							description={user.email}
							isSelected={isSelected}
						/>
					)}
				/>
			</View>
		);
	},
};
