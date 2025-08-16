// FileUploader related types
export interface UploadedMedia {
	id: string;
	url: string;
	type: "image" | "video";
}

export interface MediaUploadProps {
	mode: "single" | "multiple";
	maxFiles?: number;
}