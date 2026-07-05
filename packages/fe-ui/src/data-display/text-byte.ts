export function calculateTextByteLength(text: string): number {
	let byteLength = 0;

	for (let index = 0; index < text.length; index += 1) {
		const charCode = text.charCodeAt(index);
		byteLength += charCode > 127 ? 2 : 1;
	}

	return byteLength;
}

export function getTextMessageCount(text: string, bytesPerMessage = 90) {
	const byteLength = calculateTextByteLength(text);

	return Math.max(1, Math.ceil(byteLength / bytesPerMessage));
}

export function formatTextByteCount(text: string, bytesPerMessage = 90) {
	const byteLength = calculateTextByteLength(text);
	const messageCount = getTextMessageCount(text, bytesPerMessage);

	return `바이트: ${byteLength} / ${bytesPerMessage} (${messageCount}장)`;
}
