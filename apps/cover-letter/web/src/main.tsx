import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { selfIntroduction } from "./content/self-introduction";
import { PureSelfIntroductionScreen } from "./screens";
import "./styles/cover-letter.css";

const applicationRoot = document.getElementById("root");

if (!applicationRoot) {
	throw new Error("Cover Letter application root is missing.");
}

createRoot(applicationRoot).render(
	<StrictMode>
		<PureSelfIntroductionScreen
			selfIntroduction={selfIntroduction}
			downloadHref={`${import.meta.env.BASE_URL}documents/${encodeURIComponent(selfIntroduction.downloadFileName)}?v=${encodeURIComponent(selfIntroduction.documentVersion)}`}
			downloadFileName={selfIntroduction.downloadFileName}
		/>
	</StrictMode>,
);
