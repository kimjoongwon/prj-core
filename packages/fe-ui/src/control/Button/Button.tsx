import { type ButtonProps, Button as NextUIButton } from "@heroui/react";

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
export const Button = (props: ButtonProps) => {
	const { children, onPress, ...rest } = props;

	return (
		<NextUIButton onPress={onPress} {...rest}>
			{children}
		</NextUIButton>
	);
};
