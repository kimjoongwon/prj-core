export type CoverLetterField =
	| "fullName"
	| "email"
	| "phone"
	| "location"
	| "letterDate"
	| "companyName"
	| "positionTitle"
	| "recipientName"
	| "body";

/** 브라우저에서만 보관하는 한글 자기소개서 입력값입니다. */
export interface CoverLetterInput {
	fullName: string;
	email: string;
	phone: string;
	location: string;
	letterDate: string;
	companyName: string;
	positionTitle: string;
	recipientName: string;
	body: string;
}

export type CoverLetterDownloadState =
	| "idle"
	| "downloading"
	| "success"
	| "error";

export const EMPTY_COVER_LETTER_INPUT: CoverLetterInput = {
	fullName: "",
	email: "",
	phone: "",
	location: "",
	letterDate: "",
	companyName: "",
	positionTitle: "",
	recipientName: "",
	body: "",
};
