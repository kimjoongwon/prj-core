import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import { View } from "react-native";
import {
  BottomSheet as HeroBottomSheet,
  bottomSheetClassNames,
  useBottomSheet,
  useBottomSheetAnimation,
} from "heroui-native";
import { Text } from "../../data-display/Text";
type HeroBottomSheetProps = ComponentPropsWithoutRef<typeof HeroBottomSheet>;
type HeroBottomSheetContentProps = ComponentPropsWithoutRef<
  typeof HeroBottomSheet.Content
>;
type HeroBottomSheetDescriptionProps = ComponentPropsWithoutRef<
  typeof HeroBottomSheet.Description
>;
type HeroBottomSheetOverlayProps = ComponentPropsWithoutRef<
  typeof HeroBottomSheet.Overlay
>;
type HeroBottomSheetPortalProps = ComponentPropsWithoutRef<
  typeof HeroBottomSheet.Portal
>;
type HeroBottomSheetTitleProps = ComponentPropsWithoutRef<
  typeof HeroBottomSheet.Title
>;
export interface BottomSheetProps extends HeroBottomSheetProps {
  actions?: ReactNode;
  contentProps?: HeroBottomSheetContentProps;
  description?: ReactNode;
  overlayProps?: HeroBottomSheetOverlayProps;
  portalProps?: HeroBottomSheetPortalProps;
  showClose?: boolean;
  title?: ReactNode;
  trigger?: ReactNode;
}
export type BottomSheetTitleProps = HeroBottomSheetTitleProps & {};
export type BottomSheetDescriptionProps = HeroBottomSheetDescriptionProps & {};
const BottomSheetComponent = forwardRef<
  ComponentRef<typeof HeroBottomSheet>,
  BottomSheetProps
>(
  (
    {
      actions,
      children,
      contentProps,
      description,
      overlayProps,
      portalProps,
      showClose = true,
      title,
      trigger,
      ...props
    },
    ref,
  ) => {
    const hasScaffold =
      trigger ||
      title ||
      description ||
      actions ||
      contentProps ||
      overlayProps ||
      portalProps;

    return (
      <HeroBottomSheet {...props} ref={ref}>
        {hasScaffold ? (
          <>
            {trigger && (
              <HeroBottomSheet.Trigger>{trigger}</HeroBottomSheet.Trigger>
            )}
            <HeroBottomSheet.Portal {...portalProps}>
              <HeroBottomSheet.Overlay {...overlayProps} />
              <HeroBottomSheet.Content {...contentProps}>
                {(title || description || showClose) && (
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 gap-1">
                      {title && <BottomSheetTitle>{title}</BottomSheetTitle>}
                      {description && (
                        <BottomSheetDescription>
                          {description}
                        </BottomSheetDescription>
                      )}
                    </View>
                    {showClose && <HeroBottomSheet.Close />}
                  </View>
                )}
                {children}
                {actions && <View className="flex-row gap-2">{actions}</View>}
              </HeroBottomSheet.Content>
            </HeroBottomSheet.Portal>
          </>
        ) : (
          children
        )}
      </HeroBottomSheet>
    );
  },
);
BottomSheetComponent.displayName = "BottomSheet";
const BottomSheetTitle = forwardRef<
  ComponentRef<typeof Text>,
  BottomSheetTitleProps
>(({ children, className, ...props }, ref) => {
  const { nativeID } = useBottomSheet();
  return (
    <Text
      {...props}
      ref={ref}
      accessibilityRole="text"
      className={className}
      nativeID={`${nativeID}_title`}
      variant="title"
    >
      {children}
    </Text>
  );
});
BottomSheetTitle.displayName = "BottomSheet.Title";
const BottomSheetDescription = forwardRef<
  ComponentRef<typeof Text>,
  BottomSheetDescriptionProps
>(({ children, className, ...props }, ref) => {
  const { nativeID } = useBottomSheet();
  return (
    <Text
      {...props}
      ref={ref}
      accessibilityRole="text"
      className={className}
      nativeID={`${nativeID}_desc`}
      tone="muted"
      variant="body"
    >
      {children}
    </Text>
  );
});
BottomSheetDescription.displayName = "BottomSheet.Description";
export const BottomSheet = Object.assign(BottomSheetComponent, {
  Close: HeroBottomSheet.Close,
  Content: HeroBottomSheet.Content,
  Description: BottomSheetDescription,
  Overlay: HeroBottomSheet.Overlay,
  Portal: HeroBottomSheet.Portal,
  Title: BottomSheetTitle,
  Trigger: HeroBottomSheet.Trigger,
}) as typeof BottomSheetComponent &
  Pick<
    typeof HeroBottomSheet,
    "Close" | "Content" | "Overlay" | "Portal" | "Trigger"
  > & {
    Description: typeof BottomSheetDescription;
    Title: typeof BottomSheetTitle;
  };
export { bottomSheetClassNames, useBottomSheet, useBottomSheetAnimation };
