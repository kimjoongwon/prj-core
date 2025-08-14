import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue";
import { useColorScheme } from "@/src/components/useColorScheme";
import Colors from "@/src/constants/Colors";

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome>["name"];
	color: string;
}) {
	return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
	const colorScheme = useColorScheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				headerShown: useClientOnlyValue(false, true),
			}}
		>
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
