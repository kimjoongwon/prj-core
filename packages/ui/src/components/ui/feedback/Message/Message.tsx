export interface MessageProps {
	title: string;
	message: string;
}

import { Text } from "../../data-display/Text/Text";

export const Message = (props: MessageProps) => {
	const { message, title } = props;
	return (
		<div
			className="border-blue-500 border-l-4 bg-blue-100 p-4 text-blue-700"
			role="alert"
		>
			<Text className="font-bold">{title}</Text>
			<Text>{message}</Text>
		</div>
	);
};
