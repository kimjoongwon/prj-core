import type { MainLayoutProps } from "../../../types";
import { VStack } from "../../ui/VStack/VStack";

export const AdminMainLayout = (props: MainLayoutProps) => {
	const { children } = props;
	return <VStack className="m-4 w-full border-1 rounded-lg">{children}</VStack>;
};
