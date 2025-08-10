import { StyleSheet, ScrollView } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import Button from "@/components/Button/Button";

export default function TabOneScreen() {
	const handleButtonPress = (type: string) => {
		// Alert.alert("Button Pressed", `${type} button was pressed!`);
	};

	return (
		<ScrollView style={styles.scrollContainer}>
			<View style={styles.container}>
				<Text style={styles.title}>HeroUI Button Examples</Text>

				{/* Basic Buttons */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Basic Variants</Text>
					<View style={styles.buttonRow}>
						<Button onPress={() => handleButtonPress("Solid")}>Solid</Button>
						<Button
							variant="bordered"
							onPress={() => handleButtonPress("Bordered")}
						>
							Bordered
						</Button>
					</View>
					<View style={styles.buttonRow}>
						<Button variant="light" onPress={() => handleButtonPress("Light")}>
							Light
						</Button>
						<Button variant="ghost" onPress={() => handleButtonPress("Ghost")}>
							Ghost
						</Button>
					</View>
				</View>

				{/* Colors */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Colors</Text>
					<View style={styles.buttonRow}>
						<Button
							color="primary"
							onPress={() => handleButtonPress("Primary")}
						>
							Primary
						</Button>
						<Button
							color="secondary"
							onPress={() => handleButtonPress("Secondary")}
						>
							Secondary
						</Button>
					</View>
					<View style={styles.buttonRow}>
						<Button
							color="success"
							onPress={() => handleButtonPress("Success")}
						>
							Success
						</Button>
						<Button
							color="warning"
							onPress={() => handleButtonPress("Warning")}
						>
							Warning
						</Button>
					</View>
					<View style={styles.buttonRow}>
						<Button color="danger" onPress={() => handleButtonPress("Danger")}>
							Danger
						</Button>
					</View>
				</View>

				{/* Sizes */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Sizes</Text>
					<View style={styles.buttonColumn}>
						<Button size="sm" onPress={() => handleButtonPress("Small")}>
							Small
						</Button>
						<Button size="md" onPress={() => handleButtonPress("Medium")}>
							Medium
						</Button>
						<Button size="lg" onPress={() => handleButtonPress("Large")}>
							Large
						</Button>
					</View>
				</View>

				{/* Loading & Disabled */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>States</Text>
					<View style={styles.buttonRow}>
						<Button
							isLoading={true}
							onPress={() => handleButtonPress("Loading")}
						>
							Loading
						</Button>
						<Button
							isDisabled={true}
							onPress={() => handleButtonPress("Disabled")}
						>
							Disabled
						</Button>
					</View>
				</View>

				<View
					style={styles.separator}
					lightColor="#eee"
					darkColor="rgba(255,255,255,0.1)"
				/>
				<EditScreenInfo path="app/(tabs)/index.tsx" />
			</View>
		</ScrollView>
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
