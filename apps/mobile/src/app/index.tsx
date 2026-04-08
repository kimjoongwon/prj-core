import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>빈 화면</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#ffffff",
	},
	label: {
		fontSize: 16,
		color: "#111827",
	},
});
