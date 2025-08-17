import { Card, CardBody } from "@heroui/react";
import { getDate } from "@shared/utils";
import { Text } from "../../../ui/Text/Text";

export interface DateProps {
	value: string;
	selected?: boolean;
	isPressable?: boolean;
	className?: string;
	onDateClick?: (value: string) => void;
}

export const Date = (props: DateProps) => {
	const {
		value,
		selected = false,
		isPressable = true,
		className = "",
		onDateClick,
	} = props;
	const date = getDate(value);

	return (
		<Card
			isPressable={isPressable}
			shadow="sm"
			radius="sm"
			isHoverable
			onClick={() => onDateClick?.(value)}
			className={`${className} h-20 relative`}
		>
			{selected && (
				<div className="absolute top-1 left-1 bg-green-500 rounded-full p-0.5">
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="white"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						className="checkmark-animation"
					>
						<polyline
							points="20,6 9,17 4,12"
							style={{
								strokeDasharray: "22",
								strokeDashoffset: "22",
								animation: "draw 0.4s ease-in-out 0.1s forwards",
							}}
						/>
					</svg>
				</div>
			)}
			<style
				dangerouslySetInnerHTML={{
					__html: `
					@keyframes draw {
						to {
							stroke-dashoffset: 0;
						}
					}
				`,
				}}
			/>
			<CardBody className="text-right">
				<Text className={!isPressable ? "text-gray-400" : ""}>{date}일</Text>
			</CardBody>
		</Card>
	);
};
