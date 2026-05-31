import { isAscii } from "./is-ascii";

export function normalizeUploadedFileName(fileName: string): string {
	if (isAscii(fileName)) {
		return fileName;
	}

	const decodedName = Buffer.from(fileName, "latin1").toString("utf8");
	const hasReplacementCharacter = decodedName.includes("\uFFFD");
	const roundTrippedName = Buffer.from(decodedName, "utf8").toString("latin1");

	return !hasReplacementCharacter && roundTrippedName === fileName
		? decodedName
		: fileName;
}
