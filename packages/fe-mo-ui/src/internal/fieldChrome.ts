import {
	Fragment,
	createElement,
	type ReactNode,
} from "react";
import { StyleSheet, View } from "react-native";
import {
	type ControlFieldProps,
	ControlField,
} from "../control/ControlField";
import {
	type DescriptionProps,
	Description,
} from "../control/Description";
import {
	type FieldErrorProps,
	FieldError,
} from "../control/FieldError";
import { type LabelProps, Label } from "../control/Label";
import { TextField } from "../control/TextField";

export interface FieldChromeProps {
	description?: ReactNode;
	descriptionProps?: Omit<DescriptionProps, "children">;
	error?: ReactNode;
	fieldErrorProps?: Omit<FieldErrorProps, "children">;
	isDisabled?: boolean;
	isInvalid?: boolean;
	isRequired?: boolean;
	label?: ReactNode;
	labelProps?: Omit<LabelProps, "children">;
}

export function isRenderableFieldNode(value: ReactNode) {
	if (value === undefined || value === null || value === false) {
		return false;
	}

	if (typeof value === "string") {
		return value.length > 0;
	}

	return true;
}

export function hasFieldChrome(props: FieldChromeProps) {
	return (
		isRenderableFieldNode(props.label) ||
		isRenderableFieldNode(props.description) ||
		isRenderableFieldNode(props.error) ||
		props.isRequired === true
	);
}

export function resolveFieldInvalid(props: FieldChromeProps) {
	return props.isInvalid ?? isRenderableFieldNode(props.error);
}

export function renderTextFieldChrome(
	props: FieldChromeProps,
	control: ReactNode,
) {
	if (!hasFieldChrome(props)) {
		return control;
	}

	const children: ReactNode[] = [];

	if (isRenderableFieldNode(props.label)) {
		children.push(
			createElement(Label, {
				...props.labelProps,
				children: props.label,
				key: "label",
			}),
		);
	}

	children.push(createElement(Fragment, { key: "control" }, control));

	if (isRenderableFieldNode(props.description)) {
		children.push(
			createElement(Description, {
				...props.descriptionProps,
				children: props.description,
				key: "description",
			}),
		);
	}

	if (isRenderableFieldNode(props.error)) {
		children.push(
			createElement(FieldError, {
				...props.fieldErrorProps,
				children: props.error,
				key: "error",
			}),
		);
	}

	return createElement(
		TextField,
		{
			isDisabled: props.isDisabled,
			isInvalid: resolveFieldInvalid(props),
			isRequired: props.isRequired,
		},
		children,
	);
}

interface RenderControlFieldChromeOptions extends FieldChromeProps {
	control: ReactNode;
	controlFieldProps: Pick<
		ControlFieldProps,
		"isDisabled" | "isInvalid" | "isRequired" | "isSelected" | "onSelectedChange"
	>;
	indicatorVariant: "checkbox" | "switch";
}

export function renderControlFieldChrome(
	options: RenderControlFieldChromeOptions,
) {
	if (!hasFieldChrome(options)) {
		return options.control;
	}

	const copyChildren: ReactNode[] = [];

	if (isRenderableFieldNode(options.label)) {
		copyChildren.push(
			createElement(Label, {
				...options.labelProps,
				children: options.label,
				key: "label",
			}),
		);
	}

	if (isRenderableFieldNode(options.description)) {
		copyChildren.push(
			createElement(Description, {
				...options.descriptionProps,
				children: options.description,
				key: "description",
			}),
		);
	}

	const indicator = createElement(
		ControlField.Indicator,
		{
			key: "indicator",
			variant: options.indicatorVariant,
		},
		options.control,
	);

	const row = createElement(
		View,
		{
			key: "row",
			style: fieldChromeStyles.controlRow,
		},
		[
			createElement(
				View,
				{
					key: "copy",
					style: fieldChromeStyles.controlCopy,
				},
				copyChildren,
			),
			indicator,
		],
	);

	const children: ReactNode[] = [row];

	if (isRenderableFieldNode(options.error)) {
		children.push(
			createElement(FieldError, {
				...options.fieldErrorProps,
				children: options.error,
				key: "error",
			}),
		);
	}

	return createElement(
		ControlField,
		{
			...options.controlFieldProps,
			className: isRenderableFieldNode(options.error)
				? "flex-col items-start gap-1"
				: undefined,
			isInvalid: resolveFieldInvalid(options),
		},
		children,
	);
}

const fieldChromeStyles = StyleSheet.create({
	controlCopy: {
		flex: 1,
	},
	controlRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 8,
		width: "100%",
	},
});
