import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CoverLetterEditor } from "./features";
import { CoverLetterScreen } from "./screens";

const applicationRoot = document.getElementById("root");

if (!applicationRoot) {
	throw new Error("Cover Letter application root is missing.");
}

createRoot(applicationRoot).render(
	<StrictMode>
		<CoverLetterScreen editor={<CoverLetterEditor />} />
	</StrictMode>,
);
