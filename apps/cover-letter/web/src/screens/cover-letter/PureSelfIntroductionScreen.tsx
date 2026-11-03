import type { SelfIntroduction } from "../../content/self-introduction";

export interface PureSelfIntroductionScreenProps {
	selfIntroduction: SelfIntroduction;
	downloadHref: string;
	downloadFileName: string;
}

/** 공개 검증을 마친 자기소개서와 정적 DOCX를 보여주는 읽기 전용 화면입니다. */
export function PureSelfIntroductionScreen({
	selfIntroduction,
	downloadHref,
	downloadFileName,
}: PureSelfIntroductionScreenProps) {
	return (
		<main className="self-introduction-screen">
			<article className="self-introduction-screen__document" lang="ko">
				<header className="self-introduction-screen__header">
					<p className="self-introduction-screen__eyebrow">{selfIntroduction.role}</p>
					<h1>{selfIntroduction.title}</h1>
					<p className="self-introduction-screen__name">{selfIntroduction.name}</p>
				</header>

				<div className="self-introduction-screen__sections">
					{selfIntroduction.sections.map((section) => (
						<section
							className="self-introduction-screen__section"
							key={section.title}
						>
							<h2>{section.title}</h2>
							{section.paragraphs.map((paragraph) => (
								<p key={paragraph}>{paragraph}</p>
							))}
						</section>
					))}
				</div>

				<footer className="self-introduction-screen__footer">
					<a
						className="self-introduction-screen__download"
						download={downloadFileName}
						href={downloadHref}
					>
						자기소개서 DOCX 다운로드
					</a>
				</footer>
			</article>
		</main>
	);
}
