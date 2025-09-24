import { cn } from "@heroui/react";
import { Button } from "../Button/Button";
import { HStack } from "../HStack/HStack";

export interface LogoProps {
	onClick?: () => void;
	className?: string;
	children?: React.ReactNode;
}

export const Logo = (props: LogoProps) => {
	const { className, onClick } = props;

	return (
		<HStack className="items-center">
			<Button
				variant="light"
				className={cn(className, "p-0 font-bold text-2xl")}
				onPress={onClick}
			>
				플레이트
			</Button>
		</HStack>
	);
};
