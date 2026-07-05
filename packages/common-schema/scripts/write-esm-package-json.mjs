import { mkdir, writeFile } from "node:fs/promises";

const esmDir = new URL("../dist/esm/", import.meta.url);

await mkdir(esmDir, { recursive: true });
await writeFile(new URL("package.json", esmDir), '{"type":"module"}\n');
