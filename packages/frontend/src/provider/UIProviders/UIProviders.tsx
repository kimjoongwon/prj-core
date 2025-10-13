import { ToastProvider } from "@heroui/react";
import { NuqsAdapter } from "nuqs/adapters/react";

interface UIProvidersProps {
	children: React.ReactNode;
}

export const UIProviders = (props: UIProvidersProps) => {
	const { children } = props;

	return (
		<NuqsAdapter>
			<ToastProvider placement="bottom-center" />
			{children}
		</NuqsAdapter>
	);
};
