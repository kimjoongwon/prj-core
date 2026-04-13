import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	Dialog as HeroDialog,
	dialogClassNames,
	useDialog,
	useDialogAnimation,
} from "heroui-native/dialog";

type HeroDialogProps = ComponentPropsWithoutRef<typeof HeroDialog>;

export type DialogProps = HeroDialogProps & {};

const DialogComponent = forwardRef<ElementRef<typeof HeroDialog>, DialogProps>(
	(props, ref) => createElement(HeroDialog, { ...props, ref }),
);

DialogComponent.displayName = "Dialog";

export const Dialog = Object.assign(DialogComponent, HeroDialog) as typeof HeroDialog;

export { dialogClassNames, useDialog, useDialogAnimation };
