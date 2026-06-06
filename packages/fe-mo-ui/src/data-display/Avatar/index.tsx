import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactNode,
} from "react";
import type { ImageSourcePropType } from "react-native";
import {
  Avatar as HeroAvatar,
  avatarClassNames,
  useAvatar,
} from "heroui-native";
import { getTextContent, Text } from "../Text";
type HeroAvatarProps = ComponentPropsWithoutRef<typeof HeroAvatar>;
type HeroAvatarFallbackProps = ComponentPropsWithoutRef<
  typeof HeroAvatar.Fallback
>;
type HeroAvatarImageProps = ComponentPropsWithoutRef<typeof HeroAvatar.Image>;
export interface AvatarProps extends HeroAvatarProps {
  fallback?: ReactNode;
  imageProps?: Omit<HeroAvatarImageProps, "source">;
  name?: string;
  source?: ImageSourcePropType;
}
export type AvatarFallbackProps = HeroAvatarFallbackProps & {};
const initialsFromName = (name?: string) =>
  name
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
const AvatarComponent = forwardRef<
  ComponentRef<typeof HeroAvatar>,
  AvatarProps
>(({ children, fallback, imageProps, name, source, ...props }, ref) => (
  <HeroAvatar {...props} ref={ref}>
    {children ?? (
      <>
        {source && (
          <HeroAvatar.Image
            {...(imageProps as ComponentPropsWithoutRef<
              typeof HeroAvatar.Image
            >)}
            source={source}
          />
        )}
        <AvatarFallback>{fallback ?? initialsFromName(name)}</AvatarFallback>
      </>
    )}
  </HeroAvatar>
));
AvatarComponent.displayName = "Avatar";
const AvatarFallback = forwardRef<
  ComponentRef<typeof HeroAvatar.Fallback>,
  AvatarFallbackProps
>(({ children, ...props }, ref) => {
  const label = getTextContent(children as ReactNode);
  return (
    <HeroAvatar.Fallback {...props} ref={ref}>
      {label === null ? (
        children
      ) : (
        <Text align="center" variant="label">
          {label}
        </Text>
      )}
    </HeroAvatar.Fallback>
  );
});
AvatarFallback.displayName = "Avatar.Fallback";
export const Avatar = Object.assign(AvatarComponent, {
  Fallback: AvatarFallback,
  Image: HeroAvatar.Image,
}) as typeof AvatarComponent &
  Pick<typeof HeroAvatar, "Image"> & {
    Fallback: typeof AvatarFallback;
  };
export { avatarClassNames, useAvatar };
