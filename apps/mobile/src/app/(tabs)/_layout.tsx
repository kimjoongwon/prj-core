import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	return (
		<Tabs>
			<Tabs.Screen
				name="index"
				options={{
					title: "Buttons",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="hand-pointer-o" color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="theme"
				options={{
					title: "Theme",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="paint-brush" color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
