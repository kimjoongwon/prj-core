import { resolve } from "node:path";
import { config } from "dotenv";

for (const envPath of [resolve(__dirname, "../.env")]) {
	config({ path: envPath });
}
