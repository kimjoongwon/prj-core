import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import {
	BottomSheet as HeroBottomSheet,
	bottomSheetClassNames,
	useBottomSheet,
	useBottomSheetAnimation,
} from "heroui-native/bottom-sheet";

type HeroBottomSheetProps = ComponentPropsWithoutRef<typeof HeroBottomSheet>;

export type BottomSheetProps = HeroBottomSheetProps & {};

const BottomSheetComponent = forwardRef<
	ElementRef<typeof HeroBottomSheet>,
	BottomSheetProps
>((props, ref) => createElement(HeroBottomSheet, { ...props, ref }));

BottomSheetComponent.displayName = "BottomSheet";

export const BottomSheet = Object.assign(
	BottomSheetComponent,
	HeroBottomSheet,
) as typeof HeroBottomSheet;

export { bottomSheetClassNames, useBottomSheet, useBottomSheetAnimation };
