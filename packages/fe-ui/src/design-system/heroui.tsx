"use client";

import * as Hero from "@heroui/react";
import type {
	ChangeEvent,
	ComponentProps,
	CSSProperties,
	ElementType,
	HTMLAttributes,
	Key,
	MouseEvent,
	ReactElement,
	ReactNode,
} from "react";
import {
	Children,
	cloneElement,
	createContext,
	forwardRef,
	isValidElement,
	useContext,
	useState,
} from "react";

type AnyProps = any;
type LooseInputProps = {
	[key: string]: any;
	children?: ReactNode;
	onChange?: (event: any) => void;
	onKeyDown?: (event: any) => void;
	onInputChange?: (value: string) => void;
	onValueChange?: (value: string) => void;
};
type LooseSelectProps<T = any> = {
	[key: string]: any;
	children?: ReactNode | ((item: T) => ReactNode);
	defaultItems?: Iterable<T>;
	items?: Iterable<T>;
	onChange?: (event: any) => void;
	onSelectionChange?: (keys: Selection) => void;
};
type LooseAutocompleteProps<T = any> = Omit<LooseInputProps, "children"> & {
	children?: ReactNode | ((item: T) => ReactNode);
	defaultItems?: Iterable<T>;
	items?: Iterable<T>;
	onSelectionChange?: (key: string | number | null) => void;
};
type LooseListboxProps<T = any> = {
	[key: string]: any;
	children?: ReactNode | ((item: T) => ReactNode);
	defaultSelectedKeys?: Iterable<Key>;
	items?: Iterable<T>;
	onSelectionChange?: (keys: Selection) => void;
	options?: Array<{ text: string; value: any }>;
};
type LooseTableBodyProps<T = any> = {
	[key: string]: any;
	children?: ReactNode | ((item: T) => ReactNode);
	emptyContent?: ReactNode;
	items?: Iterable<T>;
};
type LooseTableRowProps = {
	[key: string]: any;
	children?: ReactNode | ((columnKey: Key) => ReactNode);
};
type LooseDropdownMenuProps = {
	[key: string]: any;
	children?: ReactNode;
	onAction?: (key: Key) => void;
	onSelectionChange?: (keys: Selection) => void;
	selectedKeys?: Iterable<Key> | "all";
};
type LooseRadioGroupProps = {
	[key: string]: any;
	children?: ReactNode;
	onValueChange?: (value: string) => void;
	options?: Array<{ text: string; value: any }>;
	value?: string;
};
type LooseCheckboxProps = {
	[key: string]: any;
	children?: ReactNode;
	onChange?: (event: any) => void;
	onValueChange?: (selected: boolean) => void;
};
type LooseCheckboxGroupProps = {
	[key: string]: any;
	children?: ReactNode;
	onValueChange?: (value: any) => void;
};
type LooseButtonProps = {
	[key: string]: any;
	children?: ReactNode;
	onClick?: (event: any) => void;
	onPress?: (event: any) => void;
};
type LooseTimeInputProps = {
	[key: string]: any;
	onChange?: (value: any) => void;
};
type LooseDateInputProps = {
	[key: string]: any;
	onChange?: (value: any) => void;
};

export type Selection = "all" | Set<Key>;
export type SharedSelection = Selection;
export type ButtonProps = LooseButtonProps;
export type LinkProps = AnyProps;
export type ChipProps = AnyProps;
export type InputProps = LooseInputProps;
export type TextAreaProps = LooseInputProps;
export type TextareaProps = LooseInputProps;
export type SelectProps<T = unknown> = LooseSelectProps<T>;
export type AutocompleteProps<T = unknown> = LooseAutocompleteProps<T>;
export type CheckboxProps = LooseCheckboxProps;
export type SwitchProps = LooseCheckboxProps;
export type RadioGroupProps = LooseRadioGroupProps;
export type DatePickerProps = LooseDateInputProps;
export type DateRangePickerProps = LooseDateInputProps;
export type DropdownProps = AnyProps;
export type DropdownItemProps = AnyProps;
export type ModalProps = AnyProps;
export type ModalHeaderProps = AnyProps;
export type ModalBodyProps = AnyProps;
export type ModalFooterProps = AnyProps;
export type PaginationProps = AnyProps;
export type SkeletonProps = AnyProps;
export type ListboxProps<T = unknown> = LooseListboxProps<T>;
export type TimeInputProps = LooseTimeInputProps;
export type AccordionItemIndicatorProps = AnyProps;

type LegacyColor =
	| "default"
	| "primary"
	| "secondary"
	| "success"
	| "warning"
	| "danger";
type LegacySize = "sm" | "md" | "lg";
type LegacyVariant =
	| "solid"
	| "flat"
	| "faded"
	| "bordered"
	| "light"
	| "ghost"
	| "shadow";

interface LegacyToastOptions {
	title?: ReactNode;
	description?: ReactNode;
	color?: LegacyColor;
	variant?: LegacyColor;
	timeout?: number;
}

interface LegacyButtonProps
	extends Omit<HTMLAttributes<HTMLElement>, "color" | "onClick"> {
	as?: ElementType;
	children?: ReactNode;
	className?: string;
	color?: LegacyColor;
	endContent?: ReactNode;
	fullWidth?: boolean;
	href?: string;
	isDisabled?: boolean;
	isIconOnly?: boolean;
	isLoading?: boolean;
	onClick?: (event: MouseEvent<HTMLElement>) => void;
	onPress?: (event: MouseEvent<HTMLElement>) => void;
	size?: LegacySize;
	startContent?: ReactNode;
	type?: "button" | "submit" | "reset";
	variant?: LegacyVariant;
}

interface LegacyLinkProps extends LegacyButtonProps {
	target?: string;
	rel?: string;
}

interface LegacyChipProps extends HTMLAttributes<HTMLSpanElement> {
	children?: ReactNode;
	color?: LegacyColor;
	endContent?: ReactNode;
	onClose?: () => void;
	size?: LegacySize;
	startContent?: ReactNode;
	variant?: LegacyVariant;
}

interface LegacyInputClassNames {
	base?: string;
	input?: string;
	inputWrapper?: string;
	label?: string;
	mainWrapper?: string;
}

interface LegacyInputProps
	extends Omit<
		ComponentProps<"input">,
		"color" | "onChange" | "size" | "value"
	> {
	classNames?: LegacyInputClassNames;
	color?: LegacyColor;
	description?: ReactNode;
	endContent?: ReactNode;
	errorMessage?: ReactNode;
	fullWidth?: boolean;
	isClearable?: boolean;
	isDisabled?: boolean;
	isInvalid?: boolean;
	isRequired?: boolean;
	label?: ReactNode;
	onClear?: () => void;
	onValueChange?: (value: string) => void;
	size?: LegacySize;
	startContent?: ReactNode;
	value?: string | number | readonly string[];
	variant?: LegacyVariant;
	onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

interface LegacyTextAreaProps
	extends Omit<
		ComponentProps<"textarea">,
		"color" | "onChange" | "size" | "value"
	> {
	classNames?: LegacyInputClassNames;
	color?: LegacyColor;
	description?: ReactNode;
	errorMessage?: ReactNode;
	fullWidth?: boolean;
	isDisabled?: boolean;
	isInvalid?: boolean;
	isRequired?: boolean;
	label?: ReactNode;
	maxRows?: number;
	minRows?: number;
	onValueChange?: (value: string) => void;
	size?: LegacySize;
	value?: string | number | readonly string[];
	variant?: LegacyVariant;
	onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface LegacySelectProps<T = unknown>
	extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onChange"> {
	children?: ReactNode | ((item: T) => ReactNode);
	classNames?: LegacyInputClassNames;
	description?: ReactNode;
	errorMessage?: ReactNode;
	isDisabled?: boolean;
	isInvalid?: boolean;
	isRequired?: boolean;
	items?: Iterable<T>;
	label?: ReactNode;
	onChange?: (event: ChangeEvent<HTMLSelectElement>) => void;
	onSelectionChange?: (keys: Selection) => void;
	placeholder?: string;
	selectedKeys?: Iterable<Key> | "all";
	selectionMode?: "single" | "multiple";
	size?: LegacySize;
	variant?: LegacyVariant;
}

interface LegacyAutocompleteProps<T = unknown>
	extends Omit<LegacyInputProps, "children"> {
	children?: ReactNode | ((item: T) => ReactNode);
	items?: Iterable<T>;
	selectedKey?: Key | null;
	onSelectionChange?: (key: Key | null) => void;
}

interface LegacyCheckboxProps
	extends Omit<ComponentProps<"input">, "onChange" | "size" | "type"> {
	children?: ReactNode;
	isDisabled?: boolean;
	isSelected?: boolean;
	onValueChange?: (selected: boolean) => void;
	size?: LegacySize;
}

interface LegacySwitchProps extends LegacyCheckboxProps {
	startContent?: ReactNode;
	endContent?: ReactNode;
}

interface LegacyRadioGroupProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
	children?: ReactNode;
	label?: ReactNode;
	onValueChange?: (value: string) => void;
	value?: string;
}

interface LegacyDropdownProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	placement?: string;
}

interface LegacyDropdownMenuProps
	extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
	children?: ReactNode;
	onAction?: (key: Key) => void;
	onSelectionChange?: (keys: Selection) => void;
	selectedKeys?: Iterable<Key> | "all";
	selectionMode?: "single" | "multiple";
}

interface LegacyDropdownItemProps extends HTMLAttributes<HTMLButtonElement> {
	children?: ReactNode;
	color?: LegacyColor;
	endContent?: ReactNode;
	onPress?: () => void;
	startContent?: ReactNode;
	textValue?: string;
}

interface LegacyModalProps extends HTMLAttributes<HTMLDivElement> {
	children?: ReactNode;
	isDismissable?: boolean;
	isOpen?: boolean;
	onClose?: () => void;
	onOpenChange?: (isOpen: boolean) => void;
	placement?: string;
	size?: string;
}

interface LegacyPaginationProps {
	[key: string]: unknown;
	initialPage?: number;
	isDisabled?: boolean;
	onChange?: (page: number) => void;
	page?: number;
	showControls?: boolean;
	size?: LegacySize;
	total?: number;
}

interface LegacyDisclosureOptions {
	isOpen?: boolean;
	defaultOpen?: boolean;
	onClose?: () => void;
	onOpen?: () => void;
	onChange?: (isOpen: boolean | undefined) => void;
	id?: string;
}

const modalContext = createContext<{ onClose: () => void }>({
	onClose: () => undefined,
});

const dropdownContext = createContext<{
	close: () => void;
	isOpen: boolean;
	setOpen: (isOpen: boolean) => void;
}>({
	close: () => undefined,
	isOpen: false,
	setOpen: () => undefined,
});

const dropdownMenuContext = createContext<{
	close: () => void;
	onAction?: (key: Key) => void;
	onSelectionChange?: (keys: Selection) => void;
}>({
	close: () => undefined,
});

const tableClassNamesContext = createContext<{
	td?: string;
	th?: string;
	tr?: string;
}>({});

const HeroInput = Hero.Input as ElementType;
const HeroListBox = Hero.ListBox as ElementType;
const HeroListBoxItem = Hero.ListBoxItem as ElementType;
const HeroSelect = Hero.Select as ElementType;
const HeroSelectIndicator = (Hero.Select as AnyProps).Indicator as ElementType;
const HeroSelectPopover = (Hero.Select as AnyProps).Popover as ElementType;
const HeroSelectTrigger = (Hero.Select as AnyProps).Trigger as ElementType;
const HeroSelectValue = (Hero.Select as AnyProps).Value as ElementType;
const HeroTable = Hero.Table as ElementType;
const HeroTableBody = (Hero.Table as AnyProps).Body as ElementType;
const HeroTableCell = (Hero.Table as AnyProps).Cell as ElementType;
const HeroTableColumn = (Hero.Table as AnyProps).Column as ElementType;
const HeroTableContent = (Hero.Table as AnyProps).Content as ElementType;
const HeroTableHeader = (Hero.Table as AnyProps).Header as ElementType;
const HeroTableRow = (Hero.Table as AnyProps).Row as ElementType;
const HeroTableScrollContainer = (Hero.Table as AnyProps)
	.ScrollContainer as ElementType;
const HeroTextArea = Hero.TextArea as ElementType;

function joinClasses(...values: Array<string | false | null | undefined>) {
	return values.filter(Boolean).join(" ");
}

function colorClass(color?: LegacyColor) {
	const colors: Record<LegacyColor, string> = {
		default: "text-foreground bg-default-100",
		primary: "text-primary bg-primary-100",
		secondary: "text-secondary bg-secondary-100",
		success: "text-success bg-success-100",
		warning: "text-warning bg-warning-100",
		danger: "text-danger bg-danger-100",
	};

	return colors[color ?? "default"];
}

function buttonClass(props: {
	className?: string;
	color?: LegacyColor;
	fullWidth?: boolean;
	isIconOnly?: boolean;
	size?: LegacySize;
	variant?: LegacyVariant;
}) {
	const { className, color, fullWidth, isIconOnly, size, variant } = props;

	return joinClasses(
		"inline-flex items-center justify-center gap-2 rounded-lg font-medium outline-none transition-colors disabled:pointer-events-none disabled:opacity-50",
		size === "sm" ? "h-8 px-3 text-sm" : undefined,
		!size || size === "md" ? "h-10 px-4 text-sm" : undefined,
		size === "lg" ? "h-12 px-5 text-base" : undefined,
		isIconOnly ? "aspect-square px-0" : undefined,
		fullWidth ? "w-full" : undefined,
		variant === "light" || variant === "ghost"
			? "bg-transparent hover:bg-default-100"
			: undefined,
		variant === "bordered" || variant === "faded"
			? "border border-divider bg-transparent"
			: undefined,
		!variant || variant === "solid" || variant === "shadow"
			? color === "primary"
				? "bg-primary text-primary-foreground hover:opacity-90"
				: color === "danger"
					? "bg-danger text-white hover:opacity-90"
					: "bg-default-200 text-foreground hover:bg-default-300"
			: undefined,
		variant === "flat" ? colorClass(color) : undefined,
		className,
	);
}

function inputWrapperClass(
	props: Pick<
		LegacyInputProps,
		"className" | "classNames" | "fullWidth" | "isInvalid"
	>,
) {
	return joinClasses(
		"flex flex-col gap-1.5",
		props.fullWidth === false ? undefined : "w-full",
		props.classNames?.base,
		props.className,
	);
}

function controlFrameClass(
	className?: string,
	isInvalid?: boolean,
	isDisabled?: boolean,
) {
	return joinClasses(
		"flex min-h-10 items-center gap-2 rounded-lg border bg-content1 px-3 text-sm shadow-sm transition-colors",
		isInvalid ? "border-danger" : "border-divider",
		isDisabled ? "opacity-60" : undefined,
		className,
	);
}

function toKeyArray(keys?: Iterable<Key> | "all") {
	if (!keys || keys === "all") return [];
	return Array.from(keys);
}

function normalizeReactKey(key: Key | null | undefined) {
	if (key === null || key === undefined) return undefined;
	return String(key).replace(/^\.\$/, "").replace(/^\./, "");
}

function getElementKey(element: ReactElement) {
	return normalizeReactKey(element.key as Key | null);
}

function renderItemLabel(node: ReactNode) {
	if (typeof node === "string" || typeof node === "number") {
		return node;
	}
	return node;
}

function renderSelectOptions<T>(
	items: Iterable<T> | undefined,
	children: LegacySelectProps<T>["children"],
) {
	if (items && typeof children === "function") {
		return Array.from(items).map((item, index) => {
			const rendered = children(item);
			return isValidElement(rendered)
				? cloneElement(rendered as ReactElement, { key: rendered.key ?? index })
				: rendered;
		});
	}

	return children as ReactNode;
}

function nativeOptionFromChild(child: ReactNode) {
	if (!isValidElement(child)) return child;
	const optionKey = getElementKey(child);
	const props = child.props as {
		children?: ReactNode;
		textValue?: string;
		value?: string;
	};

	return (
		<option key={optionKey ?? props.value} value={String(optionKey ?? props.value ?? "")}>
			{props.textValue ?? renderItemLabel(props.children)}
		</option>
	);
}

function getSelectionValue(keys: Iterable<Key> | "all" | undefined) {
	const selected = toKeyArray(keys);
	return selected[0] === undefined ? "" : String(selected[0]);
}

function textValueFromNode(node: ReactNode): string {
	if (typeof node === "string" || typeof node === "number") return String(node);
	if (Array.isArray(node)) return node.map(textValueFromNode).join("");
	if (isValidElement(node)) {
		return textValueFromNode((node.props as { children?: ReactNode }).children);
	}
	return "";
}

function selectOptionKey(child: ReactElement, index: number) {
	const props = child.props as { id?: Key; value?: Key };
	const key = props.value ?? props.id ?? getElementKey(child) ?? index;
	return String(key);
}

function selectOptionsFromChildren(renderedChildren: ReactNode) {
	return Children.toArray(renderedChildren).flatMap((child, index) => {
		if (!isValidElement(child)) return [];
		const props = child.props as {
			children?: ReactNode;
			className?: string;
			disabled?: boolean;
			id?: Key;
			isDisabled?: boolean;
			textValue?: string;
			value?: Key;
		};
		const id = selectOptionKey(child as ReactElement, index);
		const label = props.children ?? props.textValue ?? id;
		const textValue = props.textValue ?? textValueFromNode(label) ?? id;

		return [
			{
				id,
				isDisabled: props.isDisabled ?? props.disabled,
				label,
				textValue: textValue || id,
			},
		];
	});
}

function selectChangeEvent(value: string) {
	return {
		currentTarget: { value },
		target: { value },
	} as ChangeEvent<HTMLSelectElement>;
}

function tableChildrenFromItems<T>(
	items: Iterable<T> | undefined,
	children: ReactNode | ((item: T) => ReactNode),
) {
	if (items && typeof children === "function") {
		return Array.from(items).map((item, index) => {
			const rendered = children(item);
			return isValidElement(rendered)
				? cloneElement(rendered as ReactElement, { key: rendered.key ?? index })
				: rendered;
		});
	}
	return children as ReactNode;
}

function withStableChildKeys(children: ReactNode) {
	return Children.toArray(children);
}

export const cn = Hero.cn;

export function addToast(options: LegacyToastOptions) {
	const title = options.title ?? options.description ?? "";
	const variant =
		options.color === "success" ||
		options.color === "warning" ||
		options.color === "danger"
			? options.color
		: options.color === "primary" || options.color === "secondary"
			? "accent"
			: "default";

	return Hero.toast(String(title), {
		description:
			options.title && options.description
				? String(options.description)
				: undefined,
		timeout: options.timeout,
		variant,
	});
}

export function useDisclosure(options: LegacyDisclosureOptions = {}) {
	const [uncontrolledOpen, setUncontrolledOpen] = useState(
		options.defaultOpen ?? false,
	);
	const isControlled = typeof options.isOpen === "boolean";
	const isOpen = isControlled ? Boolean(options.isOpen) : uncontrolledOpen;

	const setOpen = (nextOpen: boolean) => {
		if (!isControlled) setUncontrolledOpen(nextOpen);
		options.onChange?.(nextOpen);
		if (nextOpen) options.onOpen?.();
		else options.onClose?.();
	};

	const onOpen = () => setOpen(true);
	const onClose = () => setOpen(false);
	const onOpenChange = (nextOpen?: boolean) => {
		setOpen(typeof nextOpen === "boolean" ? nextOpen : !isOpen);
	};

	return {
		isOpen,
		onOpen,
		onClose,
		onOpenChange,
		isControlled,
		getButtonProps: () => ({
			"aria-controls": options.id,
			"aria-expanded": isOpen,
			onPress: onOpen,
		}),
		getDisclosureProps: () => ({
			id: options.id,
		}),
	};
}

export const ToastProvider = Hero.ToastProvider;
export const Toast = Hero.Toast;

const ButtonImpl = forwardRef<HTMLElement, LooseButtonProps>(
	function Button(
		{
			as,
			children,
			color,
			endContent,
			fullWidth,
			isDisabled,
			isIconOnly,
			isLoading,
			onClick,
			onPress,
			size,
			startContent,
			type = "button",
			variant,
			...rest
		},
		ref,
	) {
		const Component = as ?? (rest.href ? "a" : "button");
		const handleClick = (event: MouseEvent<HTMLElement>) => {
			if (isDisabled || isLoading) {
				event.preventDefault();
				return;
			}
			onClick?.(event);
			onPress?.(event);
		};

		return (
			<Component
				{...rest}
				aria-disabled={isDisabled || undefined}
				className={buttonClass({
					className: rest.className,
					color,
					fullWidth,
					isIconOnly,
					size,
					variant,
				})}
				disabled={Component === "button" ? isDisabled || isLoading : undefined}
				onClick={handleClick}
				ref={ref}
				type={Component === "button" ? type : undefined}
			>
				{isLoading ? <Spinner size="sm" /> : startContent}
				{children}
				{endContent}
			</Component>
		);
	},
);

export const Button = ButtonImpl as (props: LooseButtonProps & { ref?: any }) => ReactElement;

const LinkImpl = forwardRef<HTMLElement, AnyProps>(function Link(
	props,
	ref,
) {
	return <Button {...props} as={props.as ?? "a"} ref={ref} variant="light" />;
});

export const Link = LinkImpl as (props: AnyProps & { ref?: any }) => ReactElement;

export function Chip({
	children,
	className,
	color,
	endContent,
	onClose,
	size,
	startContent,
	variant,
	...rest
}: AnyProps) {
	return (
		<span
			{...rest}
			className={joinClasses(
				"inline-flex items-center gap-1 rounded-full font-medium",
				size === "sm" ? "min-h-6 px-2 text-xs" : "min-h-7 px-2.5 text-sm",
				variant === "bordered" ? "border border-divider bg-transparent" : undefined,
				variant !== "bordered" ? colorClass(color) : undefined,
				className,
			)}
		>
			{startContent}
			{children}
			{endContent}
			{onClose ? (
				<button
					aria-label="remove"
					className="ml-1 rounded-full px-1 opacity-70 hover:opacity-100"
					onClick={onClose}
					type="button"
				>
					x
				</button>
			) : null}
		</span>
	);
}

const InputImpl = forwardRef<HTMLInputElement, LooseInputProps>(
	function Input(
		{
			className,
			classNames,
			color: _color,
			description,
			endContent,
			errorMessage,
			fullWidth,
			isClearable,
			isDisabled,
			isInvalid,
			isRequired,
			label,
			onChange,
			onClear,
			onValueChange,
			size: _size,
			startContent,
			value,
			variant = "bordered",
			...rest
		},
		ref,
	) {
		const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
			onChange?.(event);
			onValueChange?.(event.target.value);
		};

		return (
			<label
				className={inputWrapperClass({
					className,
					classNames,
					fullWidth,
					isInvalid,
				})}
			>
				{label ? (
					<span className={joinClasses("text-sm font-medium", classNames?.label)}>
						{label}
						{isRequired ? <span className="text-danger"> *</span> : null}
					</span>
				) : null}
				<span className="relative flex w-full items-center">
					{startContent ? (
						<span className="pointer-events-none absolute left-3 z-10 inline-flex text-default-400">
							{startContent}
						</span>
					) : null}
					<HeroInput
						{...rest}
						className={joinClasses(
							"w-full",
							startContent ? "pl-9" : undefined,
							endContent || (isClearable && value) ? "pr-9" : undefined,
							classNames?.inputWrapper,
							classNames?.input,
						)}
						disabled={isDisabled}
						aria-invalid={isInvalid || undefined}
						onChange={handleChange}
						ref={ref}
						required={isRequired}
						value={value}
						variant={variant === "faded" ? "bordered" : variant}
					/>
					{isClearable && value ? (
						<button
							aria-label="clear"
							className="absolute right-3 z-10 text-default-400 transition-colors hover:text-foreground"
							onClick={onClear}
							type="button"
						>
							x
						</button>
					) : null}
					{endContent && !(isClearable && value) ? (
						<span className="absolute right-3 z-10 inline-flex text-default-400">
							{endContent}
						</span>
					) : null}
				</span>
				{description ? (
					<span className="text-xs text-default-500">{description}</span>
				) : null}
				{isInvalid && errorMessage ? (
					<span className="text-xs text-danger">{errorMessage}</span>
				) : null}
			</label>
		);
	},
);

export const Input = InputImpl as (props: LooseInputProps & { ref?: any }) => ReactElement;

const TextareaImpl = forwardRef<HTMLTextAreaElement, LooseInputProps>(
	function Textarea(
		{
			className,
			classNames,
			color: _color,
			description,
			errorMessage,
			fullWidth,
			isDisabled,
			isInvalid,
			isRequired,
			label,
			maxRows,
			minRows,
			onChange,
			onValueChange,
			size: _size,
			value,
			variant = "bordered",
			...rest
		},
		ref,
	) {
		const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
			onChange?.(event);
			onValueChange?.(event.target.value);
		};
		const style: CSSProperties = {
			...rest.style,
			minHeight: minRows ? `${minRows * 1.5}rem` : rest.style?.minHeight,
			maxHeight: maxRows ? `${maxRows * 1.5}rem` : rest.style?.maxHeight,
		};

		return (
			<label
				className={inputWrapperClass({
					className,
					classNames,
					fullWidth,
					isInvalid,
				})}
			>
				{label ? (
					<span className={joinClasses("text-sm font-medium", classNames?.label)}>
						{label}
						{isRequired ? <span className="text-danger"> *</span> : null}
					</span>
				) : null}
				<HeroTextArea
					{...rest}
					className={joinClasses(
						"w-full resize-y",
						classNames?.inputWrapper,
						classNames?.input,
					)}
					disabled={isDisabled}
					aria-invalid={isInvalid || undefined}
					onChange={handleChange}
					ref={ref}
					required={isRequired}
					style={style}
					value={value}
					variant={variant === "faded" ? "bordered" : variant}
				/>
				{description ? (
					<span className="text-xs text-default-500">{description}</span>
				) : null}
				{isInvalid && errorMessage ? (
					<span className="text-xs text-danger">{errorMessage}</span>
				) : null}
			</label>
		);
	},
);

export const Textarea = TextareaImpl as (props: LooseInputProps & { ref?: any }) => ReactElement;
export const TextArea = Textarea;

export function Select<T = any>({
	children,
	className,
	classNames,
	color: _color,
	defaultSelectedKey,
	defaultSelectedKeys,
	description,
	errorMessage,
	isClearable,
	isDisabled,
	isInvalid,
	isRequired,
	items,
	label,
	onChange,
	onClear,
	onSelectionChange,
	placeholder,
	selectedKey,
	selectedKeys,
	selectionMode,
	size: _size,
	variant = "bordered",
	...rest
}: LooseSelectProps<T>) {
	const renderedChildren = renderSelectOptions(items, children);
	const options = selectOptionsFromChildren(renderedChildren);
	const value =
		selectedKey === null || selectedKey === undefined
			? getSelectionValue(selectedKeys ?? defaultSelectedKeys)
			: String(selectedKey);
	const defaultValue =
		defaultSelectedKey === null || defaultSelectedKey === undefined
			? getSelectionValue(defaultSelectedKeys)
			: String(defaultSelectedKey);
	const selectedLabel =
		options.find((option) => option.id === value)?.label ?? undefined;
	const handleNativeChange = (event: ChangeEvent<HTMLSelectElement>) => {
		onChange?.(event);
		const values =
			selectionMode === "multiple"
				? Array.from(event.target.selectedOptions).map((option) => option.value)
				: [event.target.value];
		onSelectionChange?.(new Set(values));
	};
	const handleSelectionChange = (key: Key | null) => {
		const nextValue = key === null || key === undefined ? "" : String(key);
		onChange?.(selectChangeEvent(nextValue));
		onSelectionChange?.(nextValue ? new Set([nextValue]) : new Set());
	};
	const handleClear = () => {
		onClear?.();
		onChange?.(selectChangeEvent(""));
		onSelectionChange?.(new Set());
	};

	if (selectionMode === "multiple") {
		return (
			<label className={inputWrapperClass({ className, classNames, isInvalid })}>
				{label ? (
					<span className={joinClasses("text-sm font-medium", classNames?.label)}>
						{label}
						{isRequired ? <span className="text-danger"> *</span> : null}
					</span>
				) : null}
				<select
					{...rest}
					className={joinClasses(
						controlFrameClass(classNames?.inputWrapper, isInvalid, isDisabled),
						"w-full appearance-auto",
						classNames?.input,
					)}
					disabled={isDisabled}
					multiple
					onChange={handleNativeChange}
					required={isRequired}
					value={value}
				>
					{placeholder ? <option value="">{placeholder}</option> : null}
					{Children.map(renderedChildren, nativeOptionFromChild)}
				</select>
				{description ? (
					<span className="text-xs text-default-500">{description}</span>
				) : null}
				{isInvalid && errorMessage ? (
					<span className="text-xs text-danger">{errorMessage}</span>
				) : null}
			</label>
		);
	}

	return (
		<label className={inputWrapperClass({ className, classNames, isInvalid })}>
			{label ? (
				<span className={joinClasses("text-sm font-medium", classNames?.label)}>
					{label}
					{isRequired ? <span className="text-danger"> *</span> : null}
				</span>
			) : null}
			<HeroSelect
				{...rest}
				aria-label={
					rest["aria-label"] ??
					(typeof label === "string" ? label : placeholder ?? "select")
				}
				className="w-full"
				defaultSelectedKey={defaultValue || undefined}
				isDisabled={isDisabled}
				isRequired={isRequired}
				onSelectionChange={handleSelectionChange}
				selectedKey={value || null}
			>
				<HeroSelectTrigger
					key="trigger"
					className={joinClasses(
						"min-h-10 w-full",
						isInvalid ? "border-danger" : undefined,
						classNames?.inputWrapper,
					)}
					data-invalid={isInvalid || undefined}
					variant={variant === "faded" ? "bordered" : variant}
				>
					<HeroSelectValue
						className={joinClasses("min-w-0 flex-1 text-left", classNames?.input)}
					>
						{selectedLabel ?? (
							<span className="text-default-400">{placeholder}</span>
						)}
					</HeroSelectValue>
					{isClearable && value ? (
						<button
							aria-label="clear"
							className="mr-1 text-default-400 transition-colors hover:text-foreground"
							onClick={(event) => {
								event.preventDefault();
								event.stopPropagation();
								handleClear();
							}}
							type="button"
						>
							x
						</button>
				) : null}
					<HeroSelectIndicator />
				</HeroSelectTrigger>
				<HeroSelectPopover key="popover">
					<HeroListBox
						key="options"
						aria-label={
							rest["aria-label"] ??
							(typeof label === "string" ? label : placeholder ?? "select")
						}
					>
						{placeholder ? (
							<HeroListBoxItem key="__placeholder" id="" textValue={placeholder}>
								{placeholder}
							</HeroListBoxItem>
						) : null}
						{options.map((option) => (
							<HeroListBoxItem
								id={option.id}
								isDisabled={option.isDisabled}
								key={option.id}
								textValue={option.textValue}
							>
								{option.label}
							</HeroListBoxItem>
						))}
					</HeroListBox>
				</HeroSelectPopover>
			</HeroSelect>
			{description ? (
				<span className="text-xs text-default-500">{description}</span>
			) : null}
			{isInvalid && errorMessage ? (
				<span className="text-xs text-danger">{errorMessage}</span>
			) : null}
		</label>
	);
}

export function SelectItem(props: AnyProps) {
	return <span className={props.className}>{props.children}</span>;
}

export function Autocomplete<T = any>(props: LooseAutocompleteProps<T>) {
	const {
		children: _children,
		defaultItems: _defaultItems,
		items: _items,
		onInputChange,
		onSelectionChange: _onSelectionChange,
		...rest
	} = props;

	return <Input {...rest} onValueChange={onInputChange ?? rest.onValueChange} />;
}

export function AutocompleteItem(props: AnyProps) {
	return <option value={props.value}>{props.children}</option>;
}

export function Checkbox({
	children,
	isDisabled,
	isSelected,
	onValueChange,
	...rest
}: LooseCheckboxProps) {
	return (
		<label className={joinClasses("inline-flex items-center gap-2", rest.className)}>
			<input
				{...rest}
				checked={isSelected}
				disabled={isDisabled}
				onChange={(event) => onValueChange?.(event.target.checked)}
				type="checkbox"
			/>
			<span>{children}</span>
		</label>
	);
}

export function CheckboxGroup({
	children,
	className,
	label,
	...rest
}: LooseCheckboxGroupProps) {
	return (
		<div {...rest} className={joinClasses("flex flex-col gap-2", className)}>
			{label ? <span className="text-sm font-medium">{label}</span> : null}
			{children}
		</div>
	);
}

export function Switch(props: LooseCheckboxProps) {
	const { children, endContent, startContent, ...rest } = props;
	return (
		<Checkbox {...rest}>
			{startContent}
			{children}
			{endContent}
		</Checkbox>
	);
}

export function Radio({
	children,
	value,
	...rest
}: AnyProps) {
	return (
		<label className="inline-flex items-center gap-2">
			<input {...rest} type="radio" value={value} />
			<span>{children}</span>
		</label>
	);
}

export function RadioGroup({
	children,
	className,
	label,
	onValueChange,
	value,
	...rest
}: LooseRadioGroupProps) {
	return (
		<div
			{...rest}
			className={joinClasses("flex flex-col gap-2", className)}
			onChange={(event) => {
				const target = event.target as HTMLInputElement;
				if (target?.type === "radio") onValueChange?.(target.value);
			}}
		>
			{label ? <span className="text-sm font-medium">{label}</span> : null}
			{Children.map(children, (child) =>
				isValidElement(child)
					? cloneElement(child as ReactElement<{ checked?: boolean }>, {
							checked:
								(child.props as { value?: string }).value !== undefined &&
								(child.props as { value?: string }).value === value,
						})
					: child,
			)}
		</div>
	);
}

export function Spinner({
	className,
	size,
	...rest
}: LooseDropdownMenuProps) {
	return (
		<span
			{...rest}
			className={joinClasses(
				"inline-block animate-spin rounded-full border-2 border-current border-r-transparent",
				size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-6 w-6",
				className,
			)}
		/>
	);
}

export function Skeleton({
	children,
	className,
	isLoaded,
	...rest
}: AnyProps) {
	if (isLoaded) return <>{children}</>;
	return (
		<div
			{...rest}
			className={joinClasses("animate-pulse bg-default-200", className)}
		>
			{children}
		</div>
	);
}

export function Progress(props: AnyProps) {
	return (
		<div
			{...props}
			className={joinClasses("h-2 overflow-hidden rounded-full bg-default-200", props.className)}
		>
			<div
				className="h-full bg-primary"
				style={{ width: `${Math.max(0, Math.min(props.value ?? 0, 100))}%` }}
			/>
		</div>
	);
}

export const CircularProgress = Spinner;

export function Card({
	children,
	className,
	isPressable,
	onPress,
	shadow: _shadow,
	...rest
}: AnyProps) {
	return (
		<div
			{...rest}
			className={joinClasses("rounded-lg bg-content1 shadow-sm", className)}
			onClick={onPress}
			role={isPressable ? "button" : rest.role}
		>
			{children}
		</div>
	);
}

export function CardBody(props: AnyProps) {
	return <div {...props} className={joinClasses("p-4", props.className)} />;
}

export function CardHeader(props: AnyProps) {
	return <div {...props} className={joinClasses("p-4 pb-0", props.className)} />;
}

export function CardFooter(props: AnyProps) {
	return <div {...props} className={joinClasses("p-4 pt-0", props.className)} />;
}

export function Divider(props: AnyProps) {
	return <hr {...props} className={joinClasses("border-divider", props.className)} />;
}

export const Separator = Divider;

export function Tooltip({
	children,
	className,
	content,
	...rest
}: AnyProps) {
	return (
		<span {...rest} className={joinClasses("inline-flex", className)} title={typeof content === "string" ? content : undefined}>
			{children}
		</span>
	);
}

export function Modal({
	children,
	className,
	isOpen,
	onClose,
	onOpenChange,
	...rest
}: AnyProps) {
	if (!isOpen) return null;
	const close = () => {
		onClose?.();
		onOpenChange?.(false);
	};

	return (
		<modalContext.Provider value={{ onClose: close }}>
			<div
				{...rest}
				className={joinClasses(
					"fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
					className,
				)}
				onClick={close}
			>
				{children}
			</div>
		</modalContext.Provider>
	);
}

export function ModalContent({
	children,
	className,
	...rest
}: AnyProps) {
	const { onClose } = useContext(modalContext);
	return (
		<div
			{...rest}
			className={joinClasses("w-full max-w-lg rounded-xl bg-content1 p-0 shadow-xl", className)}
			onClick={(event) => event.stopPropagation()}
		>
			{typeof children === "function" ? children(onClose) : children}
		</div>
	);
}

export function ModalHeader(props: AnyProps) {
	return <div {...props} className={joinClasses("p-6 pb-2 text-lg font-semibold", props.className)} />;
}

export function ModalBody(props: AnyProps) {
	return <div {...props} className={joinClasses("p-6", props.className)} />;
}

export function ModalFooter(props: AnyProps) {
	return <div {...props} className={joinClasses("flex justify-end gap-2 p-6 pt-2", props.className)} />;
}

export function Popover({
	children,
	className,
	...rest
}: AnyProps) {
	return (
		<div {...rest} className={joinClasses("relative inline-flex", className)}>
			{children}
		</div>
	);
}

export function PopoverTrigger({ children }: AnyProps) {
	return <>{children}</>;
}

export function PopoverContent(props: AnyProps) {
	return (
		<div
			{...props}
			className={joinClasses("absolute right-0 top-full z-40 mt-2 rounded-lg bg-content1 p-3 shadow-lg", props.className)}
		/>
	);
}

export function Dropdown({ children, className, ...rest }: AnyProps) {
	const [isOpen, setOpen] = useState(false);
	const contextValue = {
		close: () => setOpen(false),
		isOpen,
		setOpen,
	};

	return (
		<dropdownContext.Provider value={contextValue}>
			<div {...rest} className={joinClasses("relative inline-flex", className)}>
				{children}
			</div>
		</dropdownContext.Provider>
	);
}

export function DropdownTrigger({ children }: AnyProps) {
	const context = useContext(dropdownContext);
	if (!isValidElement(children)) return <>{children}</>;
	return cloneElement(children as ReactElement<Record<string, unknown>>, {
		onPress: () => context.setOpen(!context.isOpen),
	});
}

export function DropdownMenu({
	children,
	className,
	onAction,
	onSelectionChange,
	selectionMode: _selectionMode,
	selectedKeys: _selectedKeys,
	variant: _variant,
	...rest
}: LooseDropdownMenuProps) {
	const context = useContext(dropdownContext);

	if (!context.isOpen) return null;

	return (
		<dropdownMenuContext.Provider
			value={{
				close: context.close,
				onAction,
				onSelectionChange,
			}}
		>
			<div
				{...rest}
				className={joinClasses(
					"absolute right-0 top-full z-40 mt-2 min-w-44 rounded-lg border border-divider bg-content1 p-1 shadow-lg",
					className,
				)}
				role="menu"
			>
				{Children.map(children, (child) =>
					isValidElement(child)
						? cloneElement(child as ReactElement<{ itemKey?: Key }>, {
								itemKey: normalizeReactKey(child.key as Key | null),
							})
						: child,
				)}
			</div>
		</dropdownMenuContext.Provider>
	);
}
DropdownMenu.displayName = "DropdownMenu";

export function DropdownItem({
	children,
	className,
	color: _color,
	endContent,
	onPress,
	startContent,
	itemKey,
	textValue: _textValue,
	variant: _variant,
	...rest
}: AnyProps) {
	const context = useContext(dropdownMenuContext);
	const resolvedItemKey = itemKey ?? rest.id ?? "";
	const handleClick = () => {
		onPress?.();
		if (resolvedItemKey) {
			context.onAction?.(resolvedItemKey);
			context.onSelectionChange?.(new Set([resolvedItemKey]));
		}
		context.close();
	};

	return (
		<button
			{...rest}
			className={joinClasses(
				"flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-default-100",
				className,
			)}
			onClick={handleClick}
			type="button"
		>
			{startContent}
			<span className="min-w-0 flex-1">{children}</span>
			{endContent}
		</button>
	);
}

export const DropdownSection = ({ children }: AnyProps) => (
	<div className="py-1">{children}</div>
);

export function Table({
	children,
	className,
	classNames,
	removeWrapper: _removeWrapper,
	...rest
}: AnyProps) {
	return (
		<tableClassNamesContext.Provider
			value={{
				td: classNames?.td,
				th: classNames?.th,
				tr: classNames?.tr,
			}}
		>
			<HeroTable
				className={joinClasses("w-full", classNames?.base, className)}
			>
				<HeroTableScrollContainer
					className={joinClasses("w-full", classNames?.wrapper)}
				>
					<HeroTableContent
						{...rest}
						className={joinClasses("min-w-full text-sm", classNames?.table)}
					>
						{withStableChildKeys(children)}
					</HeroTableContent>
				</HeroTableScrollContainer>
			</HeroTable>
		</tableClassNamesContext.Provider>
	);
}

export function TableHeader<T>({
	children,
	columns,
}: AnyProps) {
	const headerCells = Children.map(
		tableChildrenFromItems(columns, children),
		(child, index) =>
			isValidElement(child)
				? cloneElement(
						child as ReactElement<{ columnKey?: Key; isRowHeader?: boolean }>,
						{
							columnKey: getElementKey(child as ReactElement) ?? index,
							isRowHeader:
								(child.props as { isRowHeader?: boolean }).isRowHeader ??
								index === 0,
						},
					)
				: child,
	);

	return <HeroTableHeader>{headerCells}</HeroTableHeader>;
}

export function TableColumn({
	align,
	children,
	className,
	columnKey,
	...rest
}: AnyProps) {
	const classNames = useContext(tableClassNamesContext);
	const columnId =
		columnKey ?? rest.id ?? rest.uid ?? textValueFromNode(children) ?? undefined;

	return (
		<HeroTableColumn
			{...rest}
			id={columnId}
			key={columnId}
			className={joinClasses(
				"bg-content2 px-3 py-2 text-left text-xs font-semibold uppercase text-default-500",
				align === "end" ? "text-right" : align === "center" ? "text-center" : undefined,
				classNames.th,
				className,
			)}
		>
			{children}
		</HeroTableColumn>
	);
}

export function TableBody<T = any>({
	children,
	emptyContent,
	items,
	...rest
}: LooseTableBodyProps<T>) {
	const rows = tableChildrenFromItems(items, children);
	const rowArray = Children.toArray(rows).map((child, index) =>
		isValidElement(child)
			? cloneElement(child as ReactElement<{ rowKey?: Key }>, {
					rowKey: getElementKey(child as ReactElement) ?? index,
				})
			: child,
	);
	return (
		<HeroTableBody
			{...rest}
			renderEmptyState={() => (
				<div className="px-3 py-8 text-center text-default-500">
					{emptyContent}
				</div>
			)}
		>
			{rowArray}
		</HeroTableBody>
	);
}

export function TableRow({
	children,
	className,
	rowKey,
	...rest
}: LooseTableRowProps) {
	const classNames = useContext(tableClassNamesContext);
	const resolvedRowKey = rowKey ?? rest.id;
	return (
		<HeroTableRow
			{...rest}
			className={joinClasses("border-b border-divider", classNames.tr, className)}
			id={resolvedRowKey}
			key={resolvedRowKey}
		>
			{children}
		</HeroTableRow>
	);
}

export function TableCell({
	children,
	className,
	...rest
}: AnyProps) {
	const classNames = useContext(tableClassNamesContext);
	return (
		<HeroTableCell
			{...rest}
			className={joinClasses("px-3 py-3 align-middle", classNames.td, className)}
		>
			{children}
		</HeroTableCell>
	);
}

export function Listbox<T = any>({
	children,
	className,
	classNames,
	defaultSelectedKeys,
	items,
	onSelectionChange,
	selectedKeys,
	selectionMode,
	variant = "flat",
	...rest
}: LooseListboxProps<T>) {
	const renderedChildren = tableChildrenFromItems(items, children);
	const listItems = Children.map(renderedChildren, (child, index) =>
		isValidElement(child)
			? cloneElement(child as ReactElement<{ itemKey?: Key }>, {
					itemKey: getElementKey(child as ReactElement) ?? index,
				})
			: child,
	);

	return (
		<HeroListBox
			{...rest}
			className={joinClasses("w-full", classNames?.list, className)}
			defaultSelectedKeys={defaultSelectedKeys}
			onSelectionChange={onSelectionChange}
			selectedKeys={selectedKeys}
			selectionMode={selectionMode}
			variant={variant}
		>
			{listItems}
		</HeroListBox>
	);
}

export function ListboxItem({
	children,
	className,
	itemKey,
	textValue,
	value,
	variant,
	...rest
}: AnyProps) {
	const resolvedId =
		itemKey ?? value ?? rest.id ?? textValue ?? textValueFromNode(children);

	return (
		<HeroListBoxItem
			{...rest}
			className={joinClasses("rounded-md px-3 py-2 hover:bg-default-100", className)}
			id={resolvedId}
			textValue={textValue ?? textValueFromNode(children)}
			variant={variant}
		>
			{children}
		</HeroListBoxItem>
	);
}

export function Tabs({
	children,
	className,
	...rest
}: AnyProps) {
	return <div {...rest} className={joinClasses("flex gap-2", className)}>{children}</div>;
}

export function Tab({
	children,
	className,
	...rest
}: AnyProps) {
	return <button {...rest} className={joinClasses(buttonClass({ variant: "flat", size: "sm" }), className)} type="button">{children}</button>;
}

export function Pagination({
	className,
	onChange,
	page = 1,
	showControls,
	total = 1,
	...rest
}: AnyProps) {
	const pages = Array.from({ length: total }, (_, index) => index + 1).slice(0, 7);
	return (
		<nav {...rest} className={joinClasses("flex items-center gap-1", className)}>
			{showControls ? (
				<Button isDisabled={page <= 1} size="sm" variant="light" onPress={() => onChange?.(page - 1)}>
					이전
				</Button>
			) : null}
			{pages.map((item) => (
				<Button
					key={item}
					size="sm"
					variant={item === page ? "solid" : "light"}
					onPress={() => onChange?.(item)}
				>
					{item}
				</Button>
			))}
			{showControls ? (
				<Button isDisabled={page >= total} size="sm" variant="light" onPress={() => onChange?.(page + 1)}>
					다음
				</Button>
			) : null}
		</nav>
	);
}

export function Avatar({
	as,
	className,
	icon,
	name,
	showFallback = true,
	src,
	...rest
}: AnyProps) {
	const Component = as ?? "span";
	const fallback = icon ?? name?.slice(0, 1) ?? "?";
	return (
		<Component
			{...rest}
			className={joinClasses(
				"inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-default-200 text-sm font-medium",
				className,
			)}
		>
			{src ? <img alt={name ?? ""} className="h-full w-full object-cover" src={src} /> : showFallback ? fallback : null}
		</Component>
	);
}

export function User({
	avatarProps,
	className,
	description,
	name,
	...rest
}: AnyProps) {
	return (
		<div className={joinClasses("flex items-center gap-2", className)} {...rest}>
			{avatarProps ? <Avatar {...avatarProps} /> : null}
			<div>
				{name ? <div>{name}</div> : null}
				{description ? <div className="text-sm text-default-500">{description}</div> : null}
			</div>
		</div>
	);
}

export function ScrollShadow(props: AnyProps) {
	return <div {...props} className={joinClasses("overflow-auto", props.className)} />;
}

export function Badge({
	children,
	content,
	...rest
}: AnyProps) {
	return (
		<span {...rest} className={joinClasses("relative inline-flex", rest.className)}>
			{children}
			{content ? (
				<span className="absolute -right-1 -top-1 rounded-full bg-danger px-1 text-[10px] text-white">
					{content}
				</span>
			) : null}
		</span>
	);
}

export function Spacer(props: ComponentProps<"span"> & { x?: number; y?: number }) {
	const { x, y, style, ...rest } = props;

	return (
		<span
			aria-hidden="true"
			style={{
				display: "inline-block",
				width: x ? `${x * 0.25}rem` : undefined,
				height: y ? `${y * 0.25}rem` : undefined,
				...style,
			}}
			{...rest}
		/>
	);
}

export function Image(props: ComponentProps<"img"> & { removeWrapper?: boolean }) {
	const { removeWrapper: _removeWrapper, alt = "", ...rest } = props;
	return <img alt={alt} {...rest} />;
}

export function Snippet(props: AnyProps) {
	const { children, className, symbol, ...rest } = props;
	return (
		<code className={className} {...rest}>
			{symbol}
			{children}
		</code>
	);
}

export function NavbarItem(props: ComponentProps<"div">) {
	return <div {...props} />;
}

export const DatePicker = Hero.DatePicker as unknown as (props: LooseDateInputProps) => ReactElement;
export const DateRangePicker = Hero.DateRangePicker as unknown as (props: LooseDateInputProps) => ReactElement;
export const TimeInput = Input;
export const Accordion = Hero.Accordion as unknown as (props: AnyProps) => ReactElement;
export const AccordionItem = Hero.AccordionItem as unknown as (props: AnyProps) => ReactElement;
export const SelectSection = ({ children }: AnyProps) => <>{children}</>;
