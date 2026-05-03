import { Button } from "@cocrepo/mo-ui";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const implementedActions = [
	"Button",
	"CloseButton",
	"LinkButton",
];

const implementedInputs = [
	"Input",
	"InputOTP",
	"SearchField",
	"Textarea",
];

const implementedSelections = [
	"Checkbox",
	"Radio",
	"RadioGroup",
	"Select",
	"Slider",
	"Switch",
];

const implementedNavigation = ["Tabs"];

const implementedDisplays = [
	"Alert",
	"Avatar",
	"Chip",
	"Skeleton",
	"SkeletonGroup",
	"Spinner",
	"Surface",
	"TagGroup",
	"Toast",
];

const implementedLayouts = [
	"Accordion",
	"BottomSheet",
	"Card",
	"Dialog",
	"ListGroup",
	"Menu",
	"Popover",
	"ScrollShadow",
	"Separator",
	"SubMenu",
];

const buttonVariants = [
	"primary",
	"secondary",
	"tertiary",
	"outline",
	"ghost",
	"danger",
	"danger-soft",
] as const;

const buttonSizes = ["sm", "md", "lg"] as const;

const buttonFeedbackVariants = [
	"scale-highlight",
	"scale-ripple",
	"scale",
	"none",
] as const;

function InventorySection(props: { description: string; items: string[]; title: string }) {
	const { description, items, title } = props;

	return (
		<View style={styles.section}>
			<Text style={styles.sectionTitle}>{title}</Text>
			<Text style={styles.sectionDescription}>{description}</Text>
			<View style={styles.tagList}>
				{items.map((item) => (
					<View key={item} style={styles.tag}>
						<Text style={styles.tagLabel}>{item}</Text>
					</View>
				))}
			</View>
		</View>
	);
}

export default function HomeScreen() {
	return (
		<SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
			<ScrollView
				contentContainerStyle={styles.contentContainer}
				showsVerticalScrollIndicator={false}
			>
				<View style={styles.hero}>
					<Text style={styles.eyebrow}>@cocrepo/mo-ui</Text>
					<Text style={styles.heroTitle}>모바일 컴포넌트 인벤토리</Text>
					<Text style={styles.heroDescription}>
						빈 홈 화면 대신 현재 구현된 모바일 wrapper 목록을 카테고리별로 정리해
						보여줍니다.
					</Text>
				</View>

				<View style={styles.summaryRow}>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryValue}>{implementedActions.length}</Text>
						<Text style={styles.summaryLabel}>Action</Text>
					</View>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryValue}>{implementedInputs.length}</Text>
						<Text style={styles.summaryLabel}>Input</Text>
					</View>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryValue}>{implementedSelections.length}</Text>
						<Text style={styles.summaryLabel}>Selection</Text>
					</View>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryValue}>{implementedNavigation.length}</Text>
						<Text style={styles.summaryLabel}>Navigation</Text>
					</View>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryValue}>{implementedDisplays.length}</Text>
						<Text style={styles.summaryLabel}>Display</Text>
					</View>
					<View style={styles.summaryCard}>
						<Text style={styles.summaryValue}>{implementedLayouts.length}</Text>
						<Text style={styles.summaryLabel}>Layout</Text>
					</View>
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Button Showcase</Text>
					<Text style={styles.sectionDescription}>
						`@cocrepo/mo-ui` Button wrapper를 주요 속성별로 바로 확인하는 영역입니다.
					</Text>

					<View style={styles.demoBlock}>
						<Text style={styles.demoTitle}>Variant</Text>
						<View style={styles.buttonList}>
							{buttonVariants.map((variant) => (
								<Button key={variant} onPress={() => undefined} variant={variant}>
									{variant}
								</Button>
							))}
						</View>
					</View>

					<View style={styles.demoBlock}>
						<Text style={styles.demoTitle}>Size</Text>
						<View style={styles.buttonList}>
							{buttonSizes.map((size) => (
								<Button key={size} onPress={() => undefined} size={size}>
									{`size ${size}`}
								</Button>
							))}
						</View>
					</View>

					<View style={styles.demoBlock}>
						<Text style={styles.demoTitle}>Feedback Variant</Text>
						<View style={styles.buttonList}>
							{buttonFeedbackVariants.map((feedbackVariant) => (
								<Button
									feedbackVariant={feedbackVariant}
									key={feedbackVariant}
									onPress={() => undefined}
									variant="secondary"
								>
									{feedbackVariant}
								</Button>
							))}
						</View>
					</View>

					<View style={styles.demoBlock}>
						<Text style={styles.demoTitle}>Disabled State</Text>
						<View style={styles.buttonList}>
							<Button isDisabled onPress={() => undefined}>
								disabled primary
							</Button>
							<Button isDisabled onPress={() => undefined} variant="outline">
								disabled outline
							</Button>
							<Button isDisabled onPress={() => undefined} variant="danger">
								disabled danger
							</Button>
						</View>
					</View>
				</View>

				<InventorySection
					title="Action"
					description="명령을 실행하는 pressable 계열 wrapper입니다."
					items={implementedActions}
				/>

				<InventorySection
					title="Input"
					description="사용자가 값을 직접 입력하는 wrapper입니다."
					items={implementedInputs}
				/>

				<InventorySection
					title="Selection"
					description="checkbox, radio, select, switch, slider처럼 선택 상태를 다루는 wrapper입니다."
					items={implementedSelections}
				/>

				<InventorySection
					title="Navigation"
					description="탭처럼 뷰 전환을 담당하는 wrapper입니다."
					items={implementedNavigation}
				/>

				<InventorySection
					title="Display"
					description="표시, 피드백, surface 계열 wrapper입니다."
					items={implementedDisplays}
				/>

				<InventorySection
					title="Layout"
					description="compound layout과 overlay 관련 wrapper입니다."
					items={implementedLayouts}
				/>

				<View style={styles.noteBox}>
					<Text style={styles.noteTitle}>현재 상태</Text>
					<Text style={styles.noteBody}>
						이 화면은 Expo Go에서 우선적으로 열리도록 인벤토리 중심으로 단순화했습니다.
						다음 단계에서는 각 wrapper를 안정적인 순서대로 다시 데모 화면에 붙일 수
						있습니다.
					</Text>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	buttonList: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	contentContainer: {
		gap: 16,
		padding: 20,
		paddingBottom: 32,
	},
	demoBlock: {
		gap: 10,
	},
	demoTitle: {
		color: "#0f172a",
		fontSize: 15,
		fontWeight: "700",
	},
	eyebrow: {
		color: "#2563eb",
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	hero: {
		backgroundColor: "#eff6ff",
		borderColor: "#bfdbfe",
		borderRadius: 24,
		borderWidth: 1,
		gap: 10,
		padding: 20,
	},
	heroDescription: {
		color: "#475569",
		fontSize: 15,
		lineHeight: 22,
	},
	heroTitle: {
		color: "#0f172a",
		fontSize: 28,
		fontWeight: "700",
	},
	noteBody: {
		color: "#475569",
		fontSize: 14,
		lineHeight: 21,
	},
	noteBox: {
		backgroundColor: "#ffffff",
		borderColor: "#e2e8f0",
		borderRadius: 20,
		borderWidth: 1,
		gap: 8,
		padding: 18,
	},
	noteTitle: {
		color: "#0f172a",
		fontSize: 16,
		fontWeight: "700",
	},
	safeArea: {
		backgroundColor: "#f8fafc",
		flex: 1,
	},
	section: {
		backgroundColor: "#ffffff",
		borderColor: "#e2e8f0",
		borderRadius: 20,
		borderWidth: 1,
		gap: 10,
		padding: 18,
	},
	sectionDescription: {
		color: "#64748b",
		fontSize: 14,
		lineHeight: 20,
	},
	sectionTitle: {
		color: "#0f172a",
		fontSize: 18,
		fontWeight: "700",
	},
	summaryCard: {
		backgroundColor: "#0f172a",
		borderRadius: 18,
		flex: 1,
		gap: 6,
		paddingHorizontal: 14,
		paddingVertical: 16,
	},
	summaryLabel: {
		color: "#cbd5e1",
		fontSize: 13,
	},
	summaryRow: {
		flexDirection: "row",
		gap: 12,
	},
	summaryValue: {
		color: "#ffffff",
		fontSize: 26,
		fontWeight: "700",
	},
	tag: {
		backgroundColor: "#e2e8f0",
		borderRadius: 999,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	tagLabel: {
		color: "#0f172a",
		fontSize: 13,
		fontWeight: "600",
	},
	tagList: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
});
