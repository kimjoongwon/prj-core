import { Button, Card } from "@heroui/react";
import { FileDto } from "@shared/api-client";
import { get } from "lodash-es";
import { X } from "lucide-react";
import { action, makeAutoObservable } from "mobx";
import { observer } from "mobx-react-lite";
import { v4 } from "uuid";
import { useFormField } from "@shared/hooks";
import type { MobxProps } from "../../../types";

export interface FileUploaderProps<T = any> extends MobxProps<T> {
	label?: string;
	type: "image" | "video" | "all";
	onFilesChange?: (
		type: "image" | "video" | "all",
		fileDtos: Partial<any>[],
	) => void;
	onFileRemove?: (fileDto: Partial<any>) => void;
	fullWidth?: boolean;
}

export class FileUploaderStore {
	file: Partial<FileDto> | null = null;

	constructor(initialFile: Partial<FileDto> | null = null) {
		this.file = initialFile;
		makeAutoObservable(this);
	}

	setFile(file: Partial<FileDto> | null) {
		this.file = file;
	}

	clearFile() {
		this.file = null;
	}

	get hasFile() {
		return this.file !== null;
	}
}

export const FileUploader = observer(
	<T extends object>({
		type = "image",
		onFilesChange,
		onFileRemove,
		label,
		state,
		path,
		fullWidth,
	}: FileUploaderProps<T>) => {
		const initialValue = get(state, path);
		const { localState } = useFormField({ initialValue, state, path });

		const handleFileUpload = action(
			(e: React.ChangeEvent<HTMLInputElement>) => {
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

					localState.value = fileDto;
					onFilesChange?.(type, [fileDto]);
				}
				e.target.value = "";
			},
		);

		const removeFile = action(() => {
			const fileToRemove = localState.value;
			if (fileToRemove) {
				localState.value = null;
				if (onFileRemove) {
					onFileRemove(fileToRemove);
				}
			}
		});

		const renderFilePreview = () => {
			const file = localState.value;
			if (!file) return null;

			const isImage = file.mimeType?.startsWith("image/");
			const isVideo = file.mimeType?.startsWith("video/");

			return (
				<div className="relative group w-full max-w-sm mx-auto">
					<div className="w-full aspect-square max-w-48 mx-auto border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 dark:border-gray-600 relative">
						{isImage && (
							<div className="w-full h-full relative bg-white dark:bg-gray-700">
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
									className="w-full h-full object-contain relative z-10"
								/>
							</div>
						)}
						{isVideo && (
							<video
								src={file.url}
								className="w-full h-full object-contain bg-black"
								controls={false}
							>
								<track kind="captions" />
							</video>
						)}
						{!isImage && !isVideo && (
							<div className="w-full h-full flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
								<div className="text-4xl mb-3">📄</div>
								<div className="text-sm text-center px-3 font-medium">
									{file.name?.length > 20
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
						className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-20"
						onPress={removeFile}
					>
						<X size={16} />
					</Button>
					<div className="mt-3 text-sm text-gray-700 dark:text-gray-300 text-center font-medium">
						<div className="truncate px-2" title={file.name}>
							{file.name}
						</div>
						{file.size && (
							<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
			<Card
				className={`p-4 sm:p-6 w-full ${!fullWidth && "max-w-2xl mx-auto"}`}
			>
				<div className="space-y-6">
					{label && (
						<h3 className="text-lg sm:text-xl font-semibold text-center text-gray-900 dark:text-gray-100">
							{label}
						</h3>
					)}

					<div className="flex flex-col items-center space-y-4">
						{localState.value ? (
							renderFilePreview()
						) : (
							<div className="w-full max-w-sm mx-auto">
								<label className="w-full aspect-square max-w-48 mx-auto border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:border-gray-500 transition-all duration-200">
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
									<div className="text-4xl text-gray-400 dark:text-gray-500 mb-3">
										+
									</div>
									<span className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center font-medium">
										파일 선택
									</span>
									<span className="text-xs text-gray-500 dark:text-gray-500 text-center mt-2">
										클릭하여 파일을 선택하세요
									</span>
								</label>
							</div>
						)}

						{!localState.value && (
							<div className="text-center">
								<p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">
									{type === "image" && "이미지 파일을 업로드하세요"}
									{type === "video" && "비디오 파일을 업로드하세요"}
									{type === "all" && "파일을 업로드하세요"}
								</p>
								<p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
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
	},
);
