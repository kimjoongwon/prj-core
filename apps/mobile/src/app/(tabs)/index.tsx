import { StyleSheet, View, Text } from "react-native";

export default function TabOneScreen() {
	const handleButtonPress = (_type: string) => {
		// Alert.alert("Button Pressed", `${type} button was pressed!`);
	};

	return (
		<View>
			<Text>aa</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	scrollContainer: {
		flex: 1,
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	section: {
		width: "100%",
		marginBottom: 24,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 12,
		textAlign: "center",
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginBottom: 12,
		flexWrap: "wrap",
	},
	buttonColumn: {
		alignItems: "center",
		gap: 12,
	},
	separator: {
		marginVertical: 30,
		height: 1,
		width: "80%",
	},
});
