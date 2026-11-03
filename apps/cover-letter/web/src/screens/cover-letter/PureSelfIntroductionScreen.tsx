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
					<nav aria-label="외부 프로필" className="self-introduction-screen__profiles">
						{selfIntroduction.profileLinks.map((profileLink) => (
							<a
								href={profileLink.href}
								key={profileLink.href}
								rel="noreferrer"
								target="_blank"
							>
								{profileLink.label}
							</a>
						))}
					</nav>
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

				<section
					aria-labelledby="mobile-career-heading"
					className="self-introduction-screen__mobile-career"
				>
					<h2 id="mobile-career-heading">
						{selfIntroduction.mobileCareer.title}
					</h2>
					<p>{selfIntroduction.mobileCareer.description}</p>
					<div className="self-introduction-screen__career-table-scroll">
						<table>
							<thead>
								<tr>
									{selfIntroduction.mobileCareer.columns.map((column) => (
										<th key={column.key} scope="col">
											{column.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{selfIntroduction.mobileCareer.entries.map((entry) => (
									<tr
										key={`${entry.period}-${entry.companyAndProject}-${entry.technologies}`}
									>
										{selfIntroduction.mobileCareer.columns.map((column) => (
											<td key={column.key}>{entry[column.key]}</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>

					<h3>{selfIntroduction.mobileCareer.commonCapabilities.title}</h3>
					<div className="self-introduction-screen__career-table-scroll">
						<table>
							<thead>
								<tr>
									{selfIntroduction.mobileCareer.commonCapabilities.columns.map(
										(column) => (
											<th key={column.key} scope="col">
												{column.label}
											</th>
										),
									)}
								</tr>
							</thead>
							<tbody>
								{selfIntroduction.mobileCareer.commonCapabilities.entries.map(
									(entry) => (
										<tr key={entry.area}>
											{selfIntroduction.mobileCareer.commonCapabilities.columns.map(
												(column) => (
													<td key={column.key}>{entry[column.key]}</td>
												),
											)}
										</tr>
									),
								)}
							</tbody>
						</table>
					</div>
				</section>

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
