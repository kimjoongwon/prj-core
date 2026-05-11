import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
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
  ComponentRef<typeof HeroBottomSheet>,
  BottomSheetProps
>((props, ref) => <HeroBottomSheet {...props} ref={ref} />);
BottomSheetComponent.displayName = "BottomSheet";
export const BottomSheet = Object.assign(
  BottomSheetComponent,
  HeroBottomSheet,
) as typeof HeroBottomSheet;
export { bottomSheetClassNames, useBottomSheet, useBottomSheetAnimation };
