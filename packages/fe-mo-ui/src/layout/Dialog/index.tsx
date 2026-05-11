import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Dialog as HeroDialog,
  dialogClassNames,
  useDialog,
  useDialogAnimation,
} from "heroui-native/dialog";
type HeroDialogProps = ComponentPropsWithoutRef<typeof HeroDialog>;
export type DialogProps = HeroDialogProps & {};
const DialogComponent = forwardRef<
  ComponentRef<typeof HeroDialog>,
  DialogProps
>((props, ref) => <HeroDialog {...props} ref={ref} />);
DialogComponent.displayName = "Dialog";
export const Dialog = Object.assign(
  DialogComponent,
  HeroDialog,
) as typeof HeroDialog;
export { dialogClassNames, useDialog, useDialogAnimation };
