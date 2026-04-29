import { observable } from "mobx";
import {
	act,
	create,
	type ReactTestInstance,
	type ReactTestRenderer,
} from "react-test-renderer";
import { Text } from "react-native";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean })
	.IS_REACT_ACT_ENVIRONMENT = true;

jest.mock("react-native", () => {
	const React = require("react");

	const createHostComponent = (name) =>
		React.forwardRef(({ children, ...props }, ref) =>
			React.createElement(name, { ...props, ref }, children),
		);

	return {
		Pressable: createHostComponent("Pressable"),
		StyleSheet: {
			create: (styles) => styles,
		},
		Text: createHostComponent("Text"),
		TextInput: createHostComponent("TextInput"),
		View: createHostComponent("View"),
	};
});

jest.mock("heroui-native/text-field", () => {
	const React = require("react");
	const { View } = require("react-native");

	const TextField = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(
			View,
			{ ...props, accessibilityLabel: "text-field", ref },
			children,
		),
	);

	return {
		TextField,
		textFieldClassNames: {},
		useTextField: jest.fn(),
	};
});

jest.mock("heroui-native/control-field", () => {
	const React = require("react");
	const { Pressable, View } = require("react-native");

	const ControlField = React.forwardRef(
		({ children, isSelected, onSelectedChange, ...props }, ref) =>
			React.createElement(
				Pressable,
				{
					...props,
					onPress: () => onSelectedChange?.(!isSelected),
					ref,
					testID: "control-field",
				},
				children,
			),
	);

	ControlField.Indicator = ({ children, variant }) =>
		React.createElement(View, { testID: `control-field-indicator-${variant}` }, children);

	return {
		ControlField,
		controlFieldClassNames: {},
		useControlField: jest.fn(),
	};
});

jest.mock("heroui-native/label", () => {
	const React = require("react");
	const { Text } = require("react-native");

	const Label = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(Text, { ...props, ref }, children),
	);

	return {
		Label,
		labelClassNames: {},
		useLabel: jest.fn(),
	};
});

jest.mock("heroui-native/description", () => {
	const React = require("react");
	const { Text } = require("react-native");

	const Description = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(Text, { ...props, ref }, children),
	);

	return {
		Description,
		descriptionClassNames: {},
	};
});

jest.mock("heroui-native/field-error", () => {
	const React = require("react");
	const { Text } = require("react-native");

	const FieldError = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(Text, { ...props, ref }, children),
	);

	return {
		FieldError,
		fieldErrorClassNames: {},
	};
});

jest.mock("heroui-native/input", () => {
	const React = require("react");
	const { TextInput } = require("react-native");

	const Input = React.forwardRef((props, ref) =>
		React.createElement(TextInput, { ...props, ref }),
	);

	return {
		Input,
		inputClassNames: {},
	};
});

jest.mock("heroui-native/text-area", () => {
	const React = require("react");
	const { TextInput } = require("react-native");

	const TextArea = React.forwardRef((props, ref) =>
		React.createElement(TextInput, { ...props, ref }),
	);

	return {
		TextArea,
		textAreaClassNames: {},
	};
});

jest.mock("heroui-native/input-group", () => {
	const React = require("react");
	const { TextInput, View } = require("react-native");

	const InputGroup = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(View, { ...props, ref, testID: "input-group" }, children),
	);

	InputGroup.Prefix = ({ children, ...props }) =>
		React.createElement(View, { ...props, testID: "input-group-prefix" }, children);
	InputGroup.Suffix = ({ children, ...props }) =>
		React.createElement(View, { ...props, testID: "input-group-suffix" }, children);
	InputGroup.Input = React.forwardRef((props, ref) =>
		React.createElement(TextInput, { ...props, ref, testID: "input-group-input" }),
	);

	return {
		InputGroup,
		inputGroupClassNames: {},
	};
});

jest.mock("heroui-native/search-field", () => {
	const React = require("react");
	const { Pressable, Text, TextInput, View } = require("react-native");

	const SearchField = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(View, { ...props, ref, testID: "search-field" }, children),
	);

	SearchField.Group = ({ children }) => React.createElement(View, null, children);
	SearchField.SearchIcon = () => React.createElement(Text, null, "search");
	SearchField.Input = React.forwardRef((props, ref) =>
		React.createElement(TextInput, { ...props, ref }),
	);
	SearchField.ClearButton = ({ children, onPress }) =>
		React.createElement(Pressable, { onPress }, children);

	return {
		SearchField,
		searchFieldClassNames: {},
		useSearchField: jest.fn(),
	};
});

jest.mock("heroui-native/select", () => {
	const React = require("react");
	const { Text, View } = require("react-native");

	const Select = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(View, { ...props, ref, testID: "select" }, children),
	);

	Select.Trigger = ({ children }) => React.createElement(View, null, children);
	Select.Value = ({ placeholder }) => React.createElement(Text, null, placeholder);
	Select.TriggerIndicator = () => React.createElement(Text, null, "chevron");
	Select.Portal = ({ children }) => React.createElement(View, null, children);
	Select.Overlay = () => React.createElement(View, null);
	Select.Content = ({ children }) => React.createElement(View, null, children);
	Select.ListLabel = ({ children }) => React.createElement(Text, null, children);
	Select.Item = ({ children }) => React.createElement(View, null, children);
	Select.ItemLabel = ({ children }) => React.createElement(Text, null, children);
	Select.ItemDescription = ({ children }) => React.createElement(Text, null, children);
	Select.ItemIndicator = () => React.createElement(Text, null, "selected");
	Select.Close = ({ children }) => React.createElement(View, null, children);

	return {
		Select,
		selectClassNames: {},
		useSelect: jest.fn(),
		useSelectAnimation: jest.fn(),
		useSelectItem: jest.fn(),
	};
});

jest.mock("heroui-native/radio-group", () => {
	const React = require("react");
	const { Pressable, Text, View } = require("react-native");

	const RadioGroup = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(View, { ...props, ref, testID: "radio-group" }, children),
	);

	RadioGroup.Item = ({ children, value }) =>
		React.createElement(
			Pressable,
			{ testID: `radio-${value}` },
			typeof children === "string" ? React.createElement(Text, null, children) : children,
		);

	return {
		RadioGroup,
		radioGroupClassNames: {},
		useRadioGroup: jest.fn(),
		useRadioGroupItem: jest.fn(),
	};
});

jest.mock("heroui-native/slider", () => {
	const React = require("react");
	const { Text, View } = require("react-native");

	const Slider = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(View, { ...props, ref, testID: "slider" }, children),
	);

	Slider.Output = () => React.createElement(Text, null, "slider-output");
	Slider.Track = ({ children }) => React.createElement(View, null, children);
	Slider.Fill = () => React.createElement(View, null);
	Slider.Thumb = () => React.createElement(View, null);

	return {
		Slider,
		sliderClassNames: {},
		useSlider: jest.fn(),
	};
});

jest.mock("heroui-native/input-otp", () => {
	const React = require("react");
	const { Text, View } = require("react-native");

	const InputOTP = React.forwardRef(({ children, ...props }, ref) =>
		React.createElement(View, { ...props, ref, testID: "input-otp" }, children),
	);

	InputOTP.Group = ({ children }) => React.createElement(View, null, children);
	InputOTP.Slot = ({ index }) => React.createElement(Text, null, `slot-${index}`);
	InputOTP.Separator = () => React.createElement(Text, null, "-");
	InputOTP.SlotCaret = () => React.createElement(Text, null, "caret");
	InputOTP.SlotPlaceholder = () => React.createElement(Text, null, "placeholder");
	InputOTP.SlotValue = () => React.createElement(Text, null, "value");

	return {
		InputOTP,
		REGEXP_ONLY_CHARS: /^[A-Za-z]+$/,
		REGEXP_ONLY_DIGITS: /^\d+$/,
		REGEXP_ONLY_DIGITS_AND_CHARS: /^[A-Za-z0-9]+$/,
		inputOTPClassNames: {},
		useInputOTP: jest.fn(),
	};
});

jest.mock("heroui-native/checkbox", () => {
	const React = require("react");
	const { Pressable, Text } = require("react-native");

	const Checkbox = React.forwardRef(
		({ isSelected, onSelectedChange, ...props }, ref) =>
			React.createElement(
				Pressable,
				{
					...props,
					accessibilityRole: "checkbox",
					accessibilityState: { checked: Boolean(isSelected) },
					onPress: () => onSelectedChange?.(!isSelected),
					ref,
					testID: "checkbox",
				},
				React.createElement(Text, null, isSelected ? "checked" : "unchecked"),
			),
	);

	Checkbox.Indicator = ({ children }) => children;

	return {
		Checkbox,
		checkboxClassNames: {},
		useCheckbox: jest.fn(),
	};
});

jest.mock("heroui-native/switch", () => {
	const React = require("react");
	const { Pressable, Text } = require("react-native");

	const Switch = React.forwardRef(({ isSelected, onSelectedChange, ...props }, ref) =>
		React.createElement(
			Pressable,
			{
				...props,
				accessibilityRole: "switch",
				accessibilityState: { checked: Boolean(isSelected) },
				onPress: () => onSelectedChange?.(!isSelected),
				ref,
				testID: "switch",
			},
			React.createElement(Text, null, isSelected ? "on" : "off"),
		),
	);

	Switch.Thumb = ({ children }) => children;
	Switch.StartContent = ({ children }) => children;
	Switch.EndContent = ({ children }) => children;

	return {
		Switch,
		switchClassNames: {},
		useSwitch: jest.fn(),
	};
});

import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { InputOTP } from "./InputOTP";
import { RadioGroup } from "./RadioGroup";
import { SearchField } from "./SearchField";
import { Select } from "./Select";
import { Slider } from "./Slider";
import { Switch } from "./Switch";
import { Textarea } from "./Textarea";

function renderRoot(element: React.ReactElement) {
	let renderer: ReactTestRenderer | undefined;

	act(() => {
		renderer = create(element);
	});

	if (!renderer) {
		throw new Error("Renderer was not created.");
	}

	return renderer.root;
}

function getTextContent(node: ReactTestInstance): string {
	return node.children
		.map((child) => {
			if (typeof child === "string") {
				return child;
			}

			return getTextContent(child);
		})
		.join("");
}

function findAllByText(root: ReactTestInstance, text: string) {
	return root.findAll(
		(node) => node.type === "Text" && getTextContent(node) === text,
	);
}

function expectText(root: ReactTestInstance, text: string) {
	expect(findAllByText(root, text).length).toBeGreaterThan(0);
}

function findTextInputByPlaceholder(root: ReactTestInstance, placeholder: string) {
	const input = root.findAll(
		(node) =>
			node.props.placeholder === placeholder &&
			typeof node.props.onChangeText === "function",
	)[0];

	if (!input) {
		throw new Error(`TextInput with placeholder "${placeholder}" was not found.`);
	}

	return input;
}

function findControlFields(root: ReactTestInstance) {
	return root.findAll(
		(node) => node.type === "Pressable" && node.props.testID === "control-field",
	);
}

describe("assembled field chrome controls", () => {
	let consoleError: typeof console.error;

	beforeAll(() => {
		consoleError = console.error;
		jest.spyOn(console, "error").mockImplementation((message, ...rest) => {
			if (
				typeof message === "string" &&
				message.includes("react-test-renderer is deprecated")
			) {
				return;
			}

			consoleError(message, ...rest);
		});
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it("renders Input chrome and updates MobX state by path", () => {
		const state = observable({ email: "" });

		const root = renderRoot(
			<Input
				state={state}
				path="email"
				label="Email"
				description="Used for login"
				error="Email is required"
				placeholder="Email"
			/>,
		);

		expectText(root, "Email");
		expectText(root, "Used for login");
		expectText(root, "Email is required");

		act(() => {
			findTextInputByPlaceholder(root, "Email").props.onChangeText("user@example.com");
		});

		expect(state.email).toBe("user@example.com");
	});

	it("uses InputGroup when Input receives prefix or suffix", () => {
		const state = observable({ password: "" });

		const root = renderRoot(
			<Input
				state={state}
				path="password"
				label="Password"
				prefix={<Text>lock</Text>}
				suffix={<Text>show</Text>}
				placeholder="Password"
			/>,
		);

		expect(root.findByProps({ testID: "input-group" })).toBeTruthy();
		expectText(root, "lock");
		expectText(root, "show");
	});

	it("renders field chrome for select, radio, slider, otp, textarea, and search", () => {
		const state = observable({
			code: "",
			message: "",
			query: "",
			role: "admin",
			size: 1,
			status: "active",
		});

		const root = renderRoot(
			<>
				<Select
					state={state}
					path="role"
					label="Role"
					error="Choose a role"
					options={[{ label: "Admin", value: "admin" }]}
				/>
				<RadioGroup
					state={state}
					path="status"
					label="Status"
					options={[{ text: "Active", value: "active" }]}
				/>
				<Slider state={state} path="size" label="Size" />
				<InputOTP state={state} path="code" label="Code" maxLength={4} />
				<Textarea state={state} path="message" label="Message" />
				<SearchField state={state} path="query" label="Search" />
			</>,
		);

		expectText(root, "Role");
		expectText(root, "Choose a role");
		expectText(root, "Status");
		expectText(root, "Size");
		expectText(root, "Code");
		expectText(root, "Message");
		expectText(root, "Search");
	});

	it("renders Checkbox and Switch with ControlField chrome and updates boolean state", () => {
		const state = observable({
			accepted: false,
			marketing: false,
		});

		const root = renderRoot(
			<>
				<Checkbox
					state={state}
					path="accepted"
					label="Accept terms"
					error="Required"
				/>
				<Switch
					state={state}
					path="marketing"
					label="Marketing messages"
					description="Receive product updates"
				/>
			</>,
		);

		expectText(root, "Accept terms");
		expectText(root, "Required");
		expectText(root, "Marketing messages");
		expectText(root, "Receive product updates");
		expect(findControlFields(root)).toHaveLength(2);

		act(() => {
			root.findByProps({ testID: "checkbox" }).props.onPress();
		});
		act(() => {
			root.findByProps({ testID: "switch" }).props.onPress();
		});

		expect(state.accepted).toBe(true);
		expect(state.marketing).toBe(true);
	});

	it("keeps compound children as an escape hatch", () => {
		const state = observable({ role: "" });

		const root = renderRoot(
			<Select state={state} path="role" options={[{ label: "Admin", value: "admin" }]}>
				<Text>Custom select body</Text>
			</Select>,
		);

		expectText(root, "Custom select body");
		expect(findAllByText(root, "Admin")).toHaveLength(0);
	});
});
