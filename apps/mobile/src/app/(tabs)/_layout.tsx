import { Tabs } from "expo-router";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { CustomHeader } from "@cocrepo/mo-ui";
import { useThemeColor } from "heroui-native";
import { observer } from "mobx-react-lite";

const getTabHeaderTitle = (props: BottomTabHeaderProps) => {
	if (typeof props.options.title === "string") {
		return props.options.title;
	}

	return props.route.name;
};

const renderTabHeader = (props: BottomTabHeaderProps) => (
	<CustomHeader title={getTabHeaderTitle(props)} subtitle="Onora" />
);

const MainTabsLayout = observer(() => {
	const [accent, muted, surface, border] = useThemeColor([
		"accent",
		"muted",
		"surface",
		"border",
	]);

	return (
		<Tabs
			screenOptions={{
				header: renderTabHeader,
				tabBarActiveTintColor: accent,
				tabBarInactiveTintColor: muted,
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "700",
				},
				tabBarStyle: {
					backgroundColor: surface,
					borderTopColor: border,
					borderTopWidth: 1,
					minHeight: 64,
					paddingBottom: 8,
					paddingTop: 8,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarLabel: "홈",
					title: "오늘의 수업",
				}}
			/>
			<Tabs.Screen
				name="reservations"
				options={{
					tabBarLabel: "예약",
					title: "예약",
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarLabel: "내 정보",
					title: "내 정보",
				}}
			/>
		</Tabs>
	);
});

export default MainTabsLayout;
