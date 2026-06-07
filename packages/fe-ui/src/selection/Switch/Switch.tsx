"use client";

import { Switch as HeroSwitch } from "@heroui/react";
import { observer } from "mobx-react-lite";
import type { SwitchProps } from "./Switch.props";

/**
 * Switch 컴포넌트
 * 토글 스위치 컴포넌트입니다.
 */
export const Switch = observer((props: SwitchProps) => {
	const {
		children,
		classNames,
		onChange,
		onValueChange,
		size,
		value,
		...rest
	} = props;

	const handleChange = (isSelected: boolean) => {
		onChange?.(isSelected);
		onValueChange?.(isSelected);
	};

	return (
		<HeroSwitch
			{...rest}
			className={classNames?.base ?? rest.className}
			isSelected={rest.isSelected ?? value}
			onChange={handleChange}
			size={size}
		>
			<HeroSwitch.Control className={classNames?.control}>
				<HeroSwitch.Thumb className={classNames?.thumb} />
			</HeroSwitch.Control>
			{children ? (
				<HeroSwitch.Content className={classNames?.content}>
					{children}
				</HeroSwitch.Content>
			) : null}
		</HeroSwitch>
	);
});
