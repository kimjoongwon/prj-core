import { Tabs } from "expo-router";
import { observer } from "mobx-react-lite";

const MainTabsLayout = observer(() => {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#f59e0b",
				tabBarInactiveTintColor: "#a8a29e",
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "700",
				},
				tabBarStyle: {
					backgroundColor: "#111310",
					borderTopColor: "#2c3128",
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
					title: "홈",
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
