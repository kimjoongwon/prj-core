import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from "react";
import {
  Avatar as HeroAvatar,
  avatarClassNames,
  useAvatar,
} from "heroui-native/avatar";
type HeroAvatarProps = ComponentPropsWithoutRef<typeof HeroAvatar>;
export type AvatarProps = HeroAvatarProps & {};
const AvatarComponent = forwardRef<
  ComponentRef<typeof HeroAvatar>,
  AvatarProps
>((props, ref) => <HeroAvatar {...props} ref={ref} />);
AvatarComponent.displayName = "Avatar";
export const Avatar = Object.assign(
  AvatarComponent,
  HeroAvatar,
) as typeof HeroAvatar;
export { avatarClassNames, useAvatar };
