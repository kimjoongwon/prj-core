"use client";

import { getDate } from "@cocrepo/toolkit";
import { observer } from "mobx-react-lite";
import { Card, CardBody } from "../../../design-system/primitives";
import { useT } from "../../../i18n";

export interface DateProps {
	value: string;
	selected?: boolean;
	isPressable?: boolean;
	className?: string;
	onDateClick?: (value: string) => void;
}

export const Date = observer(function Date(props: DateProps) {
	const t = useT();
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
			className={`${className} relative h-20`}
		>
			{selected && (
				<div className="absolute top-1 left-1 rounded-full bg-green-500 p-0.5">
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
				<span className={!isPressable ? "text-gray-400" : ""}>
					{t("{{date}}일", undefined, { date })}
				</span>
			</CardBody>
		</Card>
	);
});
