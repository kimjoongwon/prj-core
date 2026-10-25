import type { Meta, StoryObj } from "@storybook/react-native";
import { makeAutoObservable } from "mobx";
import { useLocalObservable } from "mobx-react-lite";
import { ScrollView } from "react-native";
import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm";
import { SearchField } from "./index";

const createSearchFieldStoryState = () =>
	makeAutoObservable(
		{ query: "리포머" },
		{},
		{ autoBind: true, name: "SearchFieldStoryState" },
	);

const meta = {
	title: "input/SearchField",
	component: SearchField,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SearchField>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="block">
				<VStack>
					<Typography className="font-extrabold" type="h5">
						SearchField
					</Typography>
					<Typography color="muted" type="body-sm">
						클래스, 코치, 스튜디오 검색에 사용하는 검색 입력입니다.
					</Typography>
				</VStack>
				<SearchField
					description="검색어를 입력하면 가능한 예약 항목을 좁혀 봅니다."
					inputProps={{
						placeholder: "클래스 검색",
					}}
					label="검색"
					defaultValue="리포머"
				/>
			</VStack>
		</ScrollView>
	),
};

export const ExternalState: Story = {
	render: () => {
		const state = useLocalObservable(createSearchFieldStoryState);
		return (
			<SearchField
				label="검색"
				path="query"
				state={state}
				inputProps={{ placeholder: "클래스 검색" }}
			/>
		);
	},
};
