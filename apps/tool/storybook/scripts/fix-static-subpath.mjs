import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputDir = process.argv[2] ?? "storybook-static";
const iframePath = join(process.cwd(), outputDir, "iframe.html");

const iframeHtml = readFileSync(iframePath, "utf8");
const nextIframeHtml = iframeHtml.replace(
  /src="\/vite-inject-mocker-entry\.js"/g,
  'src="./vite-inject-mocker-entry.js"',
);

if (iframeHtml !== nextIframeHtml) {
  writeFileSync(iframePath, nextIframeHtml);
}
