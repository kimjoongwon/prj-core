import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import { View } from "react-native";
import {
  Radio as HeroRadio,
  radioClassNames,
  useRadio,
} from "heroui-native";
import { getTextContent, Text } from "../../data-display/Text";
type HeroRadioProps = ComponentPropsWithoutRef<typeof HeroRadio>;
export type RadioProps = HeroRadioProps & {};
const RadioComponent = forwardRef<ComponentRef<typeof HeroRadio>, RadioProps>(
  ({ children, ...props }, ref) => {
    const label =
      typeof children === "function" ? null : getTextContent(children);

    if (label === null) {
      return (
        <HeroRadio {...props} ref={ref}>
          {children}
        </HeroRadio>
      );
    }

    return (
      <View className="w-full flex-row items-center gap-3">
        <HeroRadio {...props} ref={ref} />
        <Text className="flex-1" variant="label">
          {label}
        </Text>
      </View>
    );
  },
);
RadioComponent.displayName = "Radio";
export const Radio = Object.assign(
  RadioComponent,
  HeroRadio,
) as typeof HeroRadio;
export { radioClassNames, useRadio };
