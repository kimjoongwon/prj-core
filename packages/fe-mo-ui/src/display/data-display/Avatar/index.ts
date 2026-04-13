import {
	createElement,
	forwardRef,
	type ComponentPropsWithoutRef,
	type ElementRef,
} from "react";
import { Avatar as HeroAvatar, avatarClassNames, useAvatar } from "heroui-native/avatar";

type HeroAvatarProps = ComponentPropsWithoutRef<typeof HeroAvatar>;

export type AvatarProps = HeroAvatarProps & {};

const AvatarComponent = forwardRef<ElementRef<typeof HeroAvatar>, AvatarProps>(
	(props, ref) => createElement(HeroAvatar, { ...props, ref }),
);

AvatarComponent.displayName = "Avatar";

export const Avatar = Object.assign(AvatarComponent, HeroAvatar) as typeof HeroAvatar;

export { avatarClassNames, useAvatar };
