import { Tabs } from "expo-router";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { CustomHeader, Icon } from "@cocrepo/mo-ui";
import { useThemeColor } from "heroui-native";
import { observer } from "mobx-react-lite";

interface TabBarIconProps {
	color: string;
	focused: boolean;
	size: number;
}

const getTabHeaderTitle = (props: BottomTabHeaderProps) => {
	if (typeof props.options.title === "string") {
		return props.options.title;
	}

	return props.route.name;
};

const renderTabHeader = (props: BottomTabHeaderProps) => (
	<CustomHeader title={getTabHeaderTitle(props)} subtitle="Onora" />
);

const renderHomeTabIcon = ({ color, focused, size }: TabBarIconProps) => (
	<Icon
		color={color}
		name="house"
		size={focused ? size + 1 : size}
		strokeWidth={focused ? 2 : 1.75}
	/>
);

const renderReservationsTabIcon = ({
	color,
	focused,
	size,
}: TabBarIconProps) => (
	<Icon
		color={color}
		name="calendarCheck"
		size={focused ? size + 1 : size}
		strokeWidth={focused ? 2 : 1.75}
	/>
);

const renderProfileTabIcon = ({ color, focused, size }: TabBarIconProps) => (
	<Icon
		color={color}
		name="userRound"
		size={focused ? size + 1 : size}
		strokeWidth={focused ? 2 : 1.75}
	/>
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
					fontSize: 11,
					fontWeight: "800",
				},
				tabBarStyle: {
					backgroundColor: surface,
					borderTopColor: border,
					borderTopWidth: 1,
					minHeight: 56,
					paddingBottom: 6,
					paddingTop: 6,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarIcon: renderHomeTabIcon,
					tabBarLabel: "홈",
					title: "오늘의 수업",
				}}
			/>
			<Tabs.Screen
				name="reservations"
				options={{
					tabBarIcon: renderReservationsTabIcon,
					tabBarLabel: "예약",
					title: "예약",
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					tabBarIcon: renderProfileTabIcon,
					tabBarLabel: "내 정보",
					title: "내 정보",
				}}
			/>
		</Tabs>
	);
});

export default MainTabsLayout;
