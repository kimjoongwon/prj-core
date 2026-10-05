import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
	InquiryWebSocketProvider,
	useInquiryWebSocket,
} from "./InquiryWebSocketProvider";

function InquiryWebSocketConsumer() {
	const { reconnect, sendMessage, sendTypingStatus, status } =
		useInquiryWebSocket();

	return (
		<>
			<span>연결 상태: {status}</span>
			<button onClick={reconnect} type="button">
				재연결
			</button>
			<button onClick={() => sendMessage?.("문의 메시지")} type="button">
				메시지 전송
			</button>
			<button onClick={() => sendTypingStatus?.(true)} type="button">
				입력 시작
			</button>
		</>
	);
}

describe("InquiryWebSocketProvider", () => {
	it("Provider 상태를 Consumer에 전달한다", () => {
		render(
			<InquiryWebSocketProvider inquiryId="inquiry-a" status="connected">
				<InquiryWebSocketConsumer />
			</InquiryWebSocketProvider>,
		);

		expect(screen.getByText("연결 상태: connected")).toBeInTheDocument();
	});

	it("Consumer 액션을 외부 WebSocket handler에 위임한다", () => {
		const onReconnect = vi.fn();
		const sendMessage = vi.fn();
		const sendTypingStatus = vi.fn();

		render(
			<InquiryWebSocketProvider
				inquiryId="inquiry-a"
				onReconnect={onReconnect}
				sendMessage={sendMessage}
				sendTypingStatus={sendTypingStatus}
			>
				<InquiryWebSocketConsumer />
			</InquiryWebSocketProvider>,
		);

		fireEvent.click(screen.getByRole("button", { name: "재연결" }));
		fireEvent.click(screen.getByRole("button", { name: "메시지 전송" }));
		fireEvent.click(screen.getByRole("button", { name: "입력 시작" }));

		expect(onReconnect).toHaveBeenCalledOnce();
		expect(sendMessage).toHaveBeenCalledWith("문의 메시지", undefined);
		expect(sendTypingStatus).toHaveBeenCalledWith(true);
	});
});
