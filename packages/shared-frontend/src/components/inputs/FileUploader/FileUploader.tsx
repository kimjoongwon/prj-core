import { Button, Card } from "@heroui/react";
import { FileDto } from "@shared/api-client";
import { X } from "lucide-react";
import { v4 } from "uuid";

export interface FileUploaderProps {
	label?: string;
	type: "image" | "video" | "all";
	value?: Partial<FileDto> | null;
	onChange?: (fileDto: Partial<FileDto> | null) => void;
	onFilesChange?: (
		type: "image" | "video" | "all",
		fileDtos: Partial<FileDto>[],
	) => void;
	onFileRemove?: (fileDto: Partial<FileDto>) => void;
	fullWidth?: boolean;
}

export const FileUploader = (props: FileUploaderProps) => {
	const {
		type = "image",
		value = null,
		onChange,
		onFilesChange,
		onFileRemove,
		label,
		fullWidth,
	} = props;

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			const file = files[0];
			const fileDto: Partial<FileDto> = {
				id: v4(),
				name: file.name,
				url: URL.createObjectURL(file),
				mimeType: file.type,
				size: file.size,
			};

			onChange?.(fileDto);
			onFilesChange?.(type, [fileDto]);
		}
		e.target.value = "";
	};

	const removeFile = () => {
		const fileToRemove = value;
		if (fileToRemove) {
			onChange?.(null);
			onFileRemove?.(fileToRemove);
		}
	};

	const renderFilePreview = () => {
		const file = value;
		if (!file) return null;

		const isImage = file.mimeType?.startsWith("image/");
		const isVideo = file.mimeType?.startsWith("video/");

		return (
			<div className="group relative mx-auto w-full max-w-sm">
				<div className="relative mx-auto aspect-square w-full max-w-48 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
					{isImage && (
						<div className="relative h-full w-full bg-white dark:bg-gray-700">
							{/* 체크무늬 배경 패턴 (투명한 이미지를 위해) */}
							<div
								className="absolute inset-0 opacity-20"
								style={{
									backgroundImage: `
                    linear-gradient(45deg, #ccc 25%, transparent 25%),
                    linear-gradient(-45deg, #ccc 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #ccc 75%),
                    linear-gradient(-45deg, transparent 75%, #ccc 75%)
                  `,
									backgroundSize: "20px 20px",
									backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
								}}
							/>
							<img
								src={file.url}
								alt={file.name}
								className="relative z-10 h-full w-full object-contain"
							/>
						</div>
					)}
					{isVideo && (
						<video
							src={file.url}
							className="h-full w-full bg-black object-contain"
							controls={false}
						>
							<track kind="captions" />
						</video>
					)}
					{!isImage && !isVideo && (
						<div className="flex h-full w-full flex-col items-center justify-center text-gray-500 dark:text-gray-400">
							<div className="mb-3 text-4xl">📄</div>
							<div className="px-3 text-center font-medium text-sm">
								{file.name && file.name.length > 20
									? `${file.name.substring(0, 20)}...`
									: file.name}
							</div>
						</div>
					)}
				</div>
				{/* 삭제 버튼을 항상 고정된 위치에 배치 */}
				<Button
					isIconOnly
					size="sm"
					variant="solid"
					color="danger"
					className="-top-2 -right-2 absolute z-20 opacity-0 shadow-lg transition-opacity group-hover:opacity-100"
					onPress={removeFile}
				>
					<X size={16} />
				</Button>
				<div className="mt-3 text-center font-medium text-gray-700 text-sm dark:text-gray-300">
					<div className="truncate px-2" title={file.name}>
						{file.name}
					</div>
					{file.size && (
						<div className="mt-1 text-gray-500 text-xs dark:text-gray-400">
							{file.size < 1024
								? `${file.size} bytes`
								: file.size < 1024 * 1024
									? `${(file.size / 1024).toFixed(1)} KB`
									: `${(file.size / 1024 / 1024).toFixed(1)} MB`}
						</div>
					)}
				</div>
			</div>
		);
	};

	return (
		<Card className={`w-full p-4 sm:p-6 ${!fullWidth && "mx-auto max-w-2xl"}`}>
			<div className="space-y-6">
				{label && (
					<h3 className="text-center font-semibold text-gray-900 text-lg sm:text-xl dark:text-gray-100">
						{label}
					</h3>
				)}

				<div className="flex flex-col items-center space-y-4">
					{value ? (
						renderFilePreview()
					) : (
						<div className="mx-auto w-full max-w-sm">
							<label className="mx-auto flex aspect-square w-full max-w-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-300 border-dashed transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-800">
								<input
									type="file"
									accept={
										type === "image"
											? "image/*"
											: type === "video"
												? "video/*"
												: "image/*, video/*"
									}
									className="hidden"
									onChange={handleFileUpload}
								/>
								<div className="mb-3 text-4xl text-gray-400 dark:text-gray-500">
									+
								</div>
								<span className="text-center font-medium text-gray-600 text-sm sm:text-base dark:text-gray-400">
									파일 선택
								</span>
								<span className="mt-2 text-center text-gray-500 text-xs dark:text-gray-500">
									클릭하여 파일을 선택하세요
								</span>
							</label>
						</div>
					)}

					{!value && (
						<div className="text-center">
							<p className="font-medium text-gray-600 text-sm sm:text-base dark:text-gray-400">
								{type === "image" && "이미지 파일을 업로드하세요"}
								{type === "video" && "비디오 파일을 업로드하세요"}
								{type === "all" && "파일을 업로드하세요"}
							</p>
							<p className="mt-1 text-gray-500 text-xs dark:text-gray-500">
								{type === "image" && "JPG, PNG, GIF 등의 이미지 파일"}
								{type === "video" && "MP4, AVI, MOV 등의 비디오 파일"}
								{type === "all" && "모든 형태의 파일"}
							</p>
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};
