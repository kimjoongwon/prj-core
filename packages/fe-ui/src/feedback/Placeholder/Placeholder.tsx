import { Typography } from "../../data-display/Typography";
import { VStack } from "../../rhythm/VStack/VStack";

/**
 * Placeholder 컴포넌트
 * 데이터가 없을 때 표시하는 간단한 메시지입니다.
 *
 * @example
 * ```tsx
 * <Placeholder />
 * // 출력: "데이터가 존재하지 않습니다."
 * ```
 *
 * @see EmptyState 더 풍부한 빈 상태 UI가 필요하면 EmptyState를 사용하세요.
 */
export const Placeholder = () => {
	return (
		<VStack className="w-full items-center justify-center">
			<Typography.Paragraph className="text-gray-500">
				데이터가 존재하지 않습니다.
			</Typography.Paragraph>
		</VStack>
	);
};
