import { Text } from "../Text/Text";
import { VStack } from "../VStack/VStack";

export const Placeholder = () => {
	return (
		<VStack className="w-full items-center justify-center">
			<Text className="text-gray-500">데이터가 존재하지 않습니다.</Text>
		</VStack>
	);
};
