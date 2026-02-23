"use client";

import { FileText, User, BookOpen, Tag, Type } from "lucide-react";
import { observer } from "mobx-react-lite";
import { HStack } from "../../ui/surfaces/HStack/HStack";
import { VStack } from "../../ui/surfaces/VStack/VStack";

/** 문서 메타데이터 */
export interface DocumentMetadata {
	/** 페이지 수 */
	pageCount?: number;
	/** 단어 수 */
	wordCount?: number;
	/** 작성자 */
	author?: string;
	/** 제목 */
	title?: string;
	/** 주제 */
	subject?: string;
	/** 키워드 */
	keywords?: string;
}

export interface DocumentDetailInfoProps {
	/** 문서 메타데이터 */
	document: DocumentMetadata;
	/** 접기/펼치기 가능 여부 */
	collapsible?: boolean;
	/** 기본 펼침 상태 */
	defaultExpanded?: boolean;
}

/**
 * DocumentDetailInfo 컴포넌트
 * 문서 타입 에셋의 상세 정보를 표시합니다.
 *
 * @example
 * ```tsx
 * <DocumentDetailInfo
 *   document={{
 *     pageCount: 24,
 *     wordCount: 5000,
 *     author: "홍길동",
 *     title: "2024년 마케팅 보고서",
 *     subject: "마케팅",
 *     keywords: "마케팅, 보고서, 2024",
 *   }}
 * />
 * ```
 */
export const DocumentDetailInfo = observer(
	({ document, collapsible = false, defaultExpanded = true }: DocumentDetailInfoProps) => {
		return (
			<VStack gap={4} className="w-full">
				<VStack gap={3} className="rounded-lg bg-content2 p-4">
					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<FileText className="size-4" />
							<span className="text-sm">페이지 수</span>
						</HStack>
						<span className="font-medium">
							{document.pageCount ? `${document.pageCount.toLocaleString()}쪽` : "-"}
						</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Type className="size-4" />
							<span className="text-sm">단어 수</span>
						</HStack>
						<span className="font-medium">
							{document.wordCount ? `${document.wordCount.toLocaleString()}자` : "-"}
						</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<User className="size-4" />
							<span className="text-sm">작성자</span>
						</HStack>
						<span className="font-medium">{document.author || "-"}</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<BookOpen className="size-4" />
							<span className="text-sm">제목</span>
						</HStack>
						<span className="font-medium">{document.title || "-"}</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<BookOpen className="size-4" />
							<span className="text-sm">주제</span>
						</HStack>
						<span className="font-medium">{document.subject || "-"}</span>
					</HStack>

					<HStack justifyContent="between" className="w-full">
						<HStack gap={2} className="text-default-500">
							<Tag className="size-4" />
							<span className="text-sm">키워드</span>
						</HStack>
						<span className="font-medium">{document.keywords || "-"}</span>
					</HStack>
				</VStack>
			</VStack>
		);
	},
);

DocumentDetailInfo.displayName = "DocumentDetailInfo";
