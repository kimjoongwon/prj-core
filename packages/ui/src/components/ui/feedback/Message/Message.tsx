import { Text } from "../../data-display/Text/Text";

export interface MessageProps {
	/** 메시지 제목 */
	title: string;
	/** 메시지 본문 */
	message: string;
}

/**
 * Message 컴포넌트
 * 정보성 알림 메시지를 표시합니다.
 *
 * @example
 * ```tsx
 * <Message
 *   title="안내"
 *   message="회원가입이 완료되었습니다."
 * />
 * ```
 *
 * @see InfoMessage 더 다양한 스타일(info, warning, error, success)이 필요하면 InfoMessage를 사용하세요.
 */
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
