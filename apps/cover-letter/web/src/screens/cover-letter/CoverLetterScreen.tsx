import type { ReactNode } from "react";
import "../../styles/cover-letter.css";

export interface CoverLetterScreenProps {
	editor: ReactNode;
}

/**
 * 브라우저 안에서 자기소개서를 작성하고 Word 문서로 내보내는 화면입니다.
 * 편집 상태와 파일 생성은 editor 슬롯이 소유합니다.
 */
export function CoverLetterScreen({ editor }: CoverLetterScreenProps) {
	return (
		<main className="cover-letter-screen">
			<div className="cover-letter-screen__content">
				<header className="cover-letter-screen__header">
					<p className="cover-letter-screen__eyebrow">자기소개서 도우미</p>
					<h1>자기소개서 작성</h1>
					<p>작성할 내용을 입력하고 미리보기로 확인한 뒤, 편집 가능한 Word 문서를 내려받으세요.</p>
				</header>

				<aside className="cover-letter-screen__notice" aria-label="개인정보 안내">
					<h2>개인정보 안내</h2>
					<p>입력한 내용은 서버로 전송되지 않으며, 새로고침하면 지워집니다.</p>
				</aside>
			</div>

			<div className="cover-letter-screen__editor">{editor}</div>
		</main>
	);
}
