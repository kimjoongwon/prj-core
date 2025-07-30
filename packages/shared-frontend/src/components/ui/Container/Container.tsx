import { ContainerProps } from "@shared/types";
import { cva } from "class-variance-authority";

const container = cva("flex flex-col");

export const Container = (props: ContainerProps) => {
	const { className = "", children } = props;
	return <div className={container({ className })}>{children}</div>;
};
