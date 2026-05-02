"use client";

import { type ButtonProps, Button as NextUIButton } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { translateNode, useT } from "../../i18n";

/**
 * Button 컴포넌트
 * HeroUI Button의 래퍼 컴포넌트입니다.
 *
 * @example
 * ```tsx
 * // 기본 버튼
 * <Button onPress={handleClick}>클릭</Button>
 *
 * // 색상 변형
 * <Button color="primary">Primary</Button>
 * <Button color="danger">Danger</Button>
 *
 * // 스타일 변형
 * <Button variant="flat">Flat</Button>
 * <Button variant="bordered">Bordered</Button>
 * <Button variant="light">Light</Button>
 *
 * // 크기
 * <Button size="sm">Small</Button>
 * <Button size="lg">Large</Button>
 *
 * // 아이콘 전용
 * <Button isIconOnly><Plus /></Button>
 * ```
 */
export const Button = observer(function Button(props: ButtonProps) {
	const t = useT();
	const { children, onPress, ...rest } = props;
	const ariaLabel =
		typeof rest["aria-label"] === "string"
			? t(rest["aria-label"])
			: rest["aria-label"];
	const title = typeof rest.title === "string" ? t(rest.title) : rest.title;

	return (
		<NextUIButton
			onPress={onPress}
			{...rest}
			aria-label={ariaLabel}
			title={title}
		>
			{translateNode(children, t)}
		</NextUIButton>
	);
});
