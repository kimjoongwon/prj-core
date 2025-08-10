import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Text, View } from "@/components/Themed";
import Input from "@/components/Input/Input";

export default function InputScreen() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [search, setSearch] = useState("");
	const [username, setUsername] = useState("");
	const [message, setMessage] = useState("");

	return (
		<ScrollView style={styles.scrollContainer}>
			<View style={styles.container}>
				<Text style={styles.title}>HeroUI Input Examples</Text>

				{/* Basic Variants */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Basic Variants</Text>
					<Input
						variant="flat"
						label="Flat Input"
						placeholder="Enter text here"
						style={styles.inputSpacing}
					/>
					<Input
						variant="bordered"
						label="Bordered Input"
						placeholder="Enter text here"
						style={styles.inputSpacing}
					/>
					<Input
						variant="underlined"
						label="Underlined Input"
						placeholder="Enter text here"
						style={styles.inputSpacing}
					/>
					<Input
						variant="faded"
						label="Faded Input"
						placeholder="Enter text here"
						style={styles.inputSpacing}
					/>
				</View>

				{/* Colors */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Colors</Text>
					<Input
						color="primary"
						label="Primary Input"
						placeholder="Primary color"
						style={styles.inputSpacing}
					/>
					<Input
						color="secondary"
						label="Secondary Input"
						placeholder="Secondary color"
						style={styles.inputSpacing}
					/>
					<Input
						color="success"
						label="Success Input"
						placeholder="Success color"
						style={styles.inputSpacing}
					/>
					<Input
						color="warning"
						label="Warning Input"
						placeholder="Warning color"
						style={styles.inputSpacing}
					/>
					<Input
						color="danger"
						label="Danger Input"
						placeholder="Danger color"
						style={styles.inputSpacing}
					/>
				</View>

				{/* Sizes */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Sizes</Text>
					<Input
						size="sm"
						label="Small Input"
						placeholder="Small size"
						style={styles.inputSpacing}
					/>
					<Input
						size="md"
						label="Medium Input"
						placeholder="Medium size"
						style={styles.inputSpacing}
					/>
					<Input
						size="lg"
						label="Large Input"
						placeholder="Large size"
						style={styles.inputSpacing}
					/>
				</View>

				{/* Label Placements */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Label Placements</Text>
					<Input
						labelPlacement="inside"
						label="Inside Label"
						placeholder="Inside label placement"
						style={styles.inputSpacing}
					/>
					<Input
						labelPlacement="outside"
						label="Outside Label"
						placeholder="Outside label placement"
						style={styles.inputSpacing}
					/>
					<Input
						labelPlacement="outside-left"
						label="Outside Left"
						placeholder="Outside left placement"
						style={styles.inputSpacing}
					/>
				</View>

				{/* Input Types and Features */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Input Types & Features</Text>
					<Input
						label="Email"
						placeholder="Enter your email"
						keyboardType="email-address"
						autoCapitalize="none"
						value={email}
						onChangeText={setEmail}
						isClearable
						startContent={<Ionicons name="mail-outline" size={16} color="#71717a" />}
						style={styles.inputSpacing}
					/>
					<Input
						label="Password"
						placeholder="Enter your password"
						secureTextEntry
						value={password}
						onChangeText={setPassword}
						isClearable
						startContent={<Ionicons name="lock-closed-outline" size={16} color="#71717a" />}
						endContent={<Ionicons name="eye-outline" size={16} color="#71717a" />}
						style={styles.inputSpacing}
					/>
					<Input
						label="Search"
						placeholder="Search..."
						value={search}
						onChangeText={setSearch}
						isClearable
						startContent={<Ionicons name="search-outline" size={16} color="#71717a" />}
						style={styles.inputSpacing}
					/>
				</View>

				{/* States */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>States</Text>
					<Input
						label="Required Field"
						placeholder="This field is required"
						isRequired
						style={styles.inputSpacing}
					/>
					<Input
						label="Disabled Input"
						placeholder="This input is disabled"
						isDisabled
						style={styles.inputSpacing}
					/>
					<Input
						label="Read Only Input"
						value="This is read-only"
						isReadOnly
						style={styles.inputSpacing}
					/>
					<Input
						label="Invalid Input"
						placeholder="Invalid input"
						isInvalid
						errorMessage="Please enter a valid value"
						style={styles.inputSpacing}
					/>
				</View>

				{/* With Descriptions */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>With Descriptions</Text>
					<Input
						label="Username"
						placeholder="Enter your username"
						description="Username must be at least 3 characters long"
						value={username}
						onChangeText={setUsername}
						style={styles.inputSpacing}
					/>
					<Input
						label="Message"
						placeholder="Enter your message"
						description="Tell us about yourself"
						multiline
						numberOfLines={4}
						value={message}
						onChangeText={setMessage}
						style={[styles.inputSpacing, { height: 100 }]}
					/>
				</View>
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
		paddingHorizontal: 20,
		paddingVertical: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		textAlign: "center",
	},
	section: {
		marginBottom: 32,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginBottom: 16,
		textAlign: "center",
	},
	inputSpacing: {
		marginBottom: 16,
	},
});