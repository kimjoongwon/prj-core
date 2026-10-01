import { readFileSync } from "node:fs";

export const AGENT_DEFINITION_COUNT = 38;
const CODEX_FIELDS = [
	"name",
	"description",
	"model",
	"model_reasoning_effort",
	"developer_instructions",
];
// biome-ignore lint/suspicious/noControlCharactersInRegex: TOML 문자열에 금지된 raw 제어 문자를 검출합니다.
const INVALID_SINGLE_LINE_CONTROLS = /[\u0000-\u0008\u000a-\u001f\u007f]/;
const INVALID_MULTILINE_CONTROLS =
	// biome-ignore lint/suspicious/noControlCharactersInRegex: multiline literal에서 허용하는 TAB·LF·CR 외 제어 문자를 검출합니다.
	/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

export function readAgentDefinitionSource(definitionPath) {
	try {
		// BOM을 문자열에 남겨 생성본의 바이트 차이를 자동 정규화하지 않습니다.
		return new TextDecoder("utf-8", { fatal: true, ignoreBOM: true }).decode(
			readFileSync(definitionPath),
		);
	} catch (error) {
		throw new Error(
			`${definitionPath}: UTF-8 정의 파일을 읽을 수 없습니다: ${error.message}`,
		);
	}
}

function decodeTomlMetadataString(encodedString, fieldName) {
	const quote = encodedString[0];
	if (
		!['"', "'"].includes(quote) ||
		encodedString.startsWith(quote.repeat(3))
	) {
		throw new Error(`${fieldName}: 단일 줄 TOML 문자열만 지원합니다.`);
	}
	let decodedString = "";
	for (
		let characterIndex = 1;
		characterIndex < encodedString.length;
		characterIndex += 1
	) {
		const character = encodedString[characterIndex];
		if (character === quote) {
			if (!/^[ \t]*(?:#.*)?$/.test(encodedString.slice(characterIndex + 1))) {
				throw new Error(
					`${fieldName}: 문자열 뒤에 잘못된 TOML 내용이 있습니다.`,
				);
			}
			return decodedString;
		}
		if (INVALID_SINGLE_LINE_CONTROLS.test(character))
			throw new Error(`${fieldName}: 문자열에 제어 문자가 있습니다.`);
		if (quote === "'" || character !== "\\") {
			decodedString += character;
			continue;
		}
		const escapeCode = encodedString[++characterIndex];
		const escapedCharacters = {
			b: "\b",
			t: "\t",
			n: "\n",
			f: "\f",
			r: "\r",
			'"': '"',
			"\\": "\\",
		};
		if (Object.hasOwn(escapedCharacters, escapeCode)) {
			decodedString += escapedCharacters[escapeCode];
		} else if (escapeCode === "u" || escapeCode === "U") {
			const digitCount = escapeCode === "u" ? 4 : 8;
			const unicodeDigits = encodedString.slice(
				characterIndex + 1,
				characterIndex + 1 + digitCount,
			);
			if (!new RegExp(`^[0-9a-fA-F]{${digitCount}}$`).test(unicodeDigits))
				throw new Error(`${fieldName}: Unicode escape가 올바르지 않습니다.`);
			const codePoint = Number.parseInt(unicodeDigits, 16);
			if (codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff))
				throw new Error(`${fieldName}: Unicode scalar가 올바르지 않습니다.`);
			decodedString += String.fromCodePoint(codePoint);
			characterIndex += digitCount;
		} else {
			throw new Error(`${fieldName}: 지원하지 않는 TOML escape입니다.`);
		}
	}
	throw new Error(`${fieldName}: 문자열의 닫는 따옴표가 없습니다.`);
}

// 저장소가 사용하는 5개 필드 형식만 처리하며 다른 TOML 형식은 명시적으로 거부합니다.
export function parseCodexAgentDefinition(
	source,
	definitionPath = "agent.toml",
) {
	try {
		if (!source.isWellFormed()) throw new Error("잘못된 Unicode 문자열입니다.");
		if (INVALID_MULTILINE_CONTROLS.test(source) || /\r(?!\n)/.test(source))
			throw new Error("제어 문자 또는 잘못된 줄바꿈이 포함된 TOML입니다.");
		const fieldValues = new Map();
		let cursor = 0;
		while (cursor < source.length) {
			const newlineIndex = source.indexOf("\n", cursor);
			const lineEnd = newlineIndex < 0 ? source.length : newlineIndex + 1;
			const sourceLine = source
				.slice(cursor, newlineIndex < 0 ? source.length : newlineIndex)
				.replace(/\r$/, "");
			if (!sourceLine.trim() || /^[ \t]*#/.test(sourceLine)) {
				cursor = lineEnd;
				continue;
			}
			const assignment = sourceLine.match(
				/^[ \t]*([A-Za-z_][A-Za-z_0-9]*)[ \t]*=[ \t]*(.*)$/,
			);
			if (!assignment)
				throw new Error("지원하지 않거나 잘못된 TOML 구문입니다.");
			const [, fieldName, encodedValue] = assignment;
			if (!CODEX_FIELDS.includes(fieldName))
				throw new Error(`지원하지 않는 TOML 필드 "${fieldName}"입니다.`);
			if (fieldValues.has(fieldName))
				throw new Error(`중복 TOML 필드 "${fieldName}"입니다.`);
			if (fieldName === "developer_instructions") {
				if (!encodedValue.startsWith("'''"))
					throw new Error(
						"developer_instructions: multiline literal 문자열만 지원합니다.",
					);
				const delimiterOffset = sourceLine.indexOf(
					"'''",
					sourceLine.indexOf("="),
				);
				let contentStart = cursor + delimiterOffset + 3;
				if (source.startsWith("\r\n", contentStart)) contentStart += 2;
				else if (source[contentStart] === "\n") contentStart += 1;
				const closingDelimiter = source.indexOf("'''", contentStart);
				if (closingDelimiter < 0)
					throw new Error("developer_instructions: 닫는 delimiter가 없습니다.");
				const closingNewline = source.indexOf("\n", closingDelimiter + 3);
				const closingTail = source
					.slice(
						closingDelimiter + 3,
						closingNewline < 0 ? source.length : closingNewline,
					)
					.replace(/\r$/, "");
				if (!/^[ \t]*(?:#.*)?$/.test(closingTail))
					throw new Error(
						"developer_instructions: 닫는 delimiter 뒤 형식을 지원하지 않습니다.",
					);
				const instructions = source.slice(contentStart, closingDelimiter);
				if (
					INVALID_MULTILINE_CONTROLS.test(instructions) ||
					/\r(?!\n)/.test(instructions)
				)
					throw new Error(
						"developer_instructions: 제어 문자 또는 잘못된 줄바꿈입니다.",
					);
				fieldValues.set(fieldName, instructions);
				cursor = closingNewline < 0 ? source.length : closingNewline + 1;
			} else {
				fieldValues.set(
					fieldName,
					decodeTomlMetadataString(encodedValue, fieldName),
				);
				cursor = lineEnd;
			}
		}
		for (const fieldName of CODEX_FIELDS) {
			if (!fieldValues.get(fieldName)?.trim())
				throw new Error(`${fieldName} 필드가 없습니다 또는 비어 있습니다.`);
		}
		const name = fieldValues.get("name");
		if (!/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(name))
			throw new Error("name은 안전한 소문자 역할명이어야 합니다.");
		if (fieldValues.get("description").length > 160)
			throw new Error("description은 160자 이하여야 합니다.");
		return {
			name,
			description: fieldValues.get("description"),
			model: fieldValues.get("model"),
			modelReasoningEffort: fieldValues.get("model_reasoning_effort"),
			instructions: fieldValues.get("developer_instructions"),
		};
	} catch (error) {
		throw new Error(`${definitionPath}: ${error.message}`);
	}
}

export function parseZcodeAgentDefinition(source, definitionPath = "agent.md") {
	try {
		const frontmatter = source.match(
			/^---\r?\n([\s\S]*?)\r?\n---\r?\n\r?\n([\s\S]*)$/,
		);
		if (!frontmatter)
			throw new Error(
				"frontmatter(name, description)와 본문이 모두 있어야 합니다.",
			);
		const metadata = new Map();
		for (const sourceLine of frontmatter[1].split(/\r?\n/)) {
			if (!sourceLine.trim() || /^\s*#/.test(sourceLine)) continue;
			const field = sourceLine.match(/^([A-Za-z_][A-Za-z_0-9]*):[ \t]*(.+)$/);
			if (!field)
				throw new Error("지원하지 않거나 잘못된 YAML frontmatter입니다.");
			const [, fieldName, encodedValue] = field;
			if (!["name", "description"].includes(fieldName))
				throw new Error(`허용되지 않은 frontmatter 필드 "${fieldName}"입니다.`);
			if (metadata.has(fieldName))
				throw new Error(`중복 frontmatter 필드 "${fieldName}"입니다.`);
			let decodedValue;
			if (
				fieldName === "name" &&
				/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(encodedValue)
			)
				decodedValue = encodedValue;
			else {
				if (!encodedValue.startsWith('"'))
					throw new Error(
						`${fieldName}: JSON 호환 YAML double-quoted 문자열만 지원합니다.`,
					);
				decodedValue = JSON.parse(encodedValue);
			}
			if (
				typeof decodedValue !== "string" ||
				!decodedValue.trim() ||
				!decodedValue.isWellFormed()
			)
				throw new Error(`${fieldName}: 유효한 문자열이 필요합니다.`);
			metadata.set(fieldName, decodedValue);
		}
		if (!metadata.has("name") || !metadata.has("description"))
			throw new Error(
				"frontmatter(name, description)와 본문이 모두 있어야 합니다.",
			);
		return {
			name: metadata.get("name"),
			description: metadata.get("description"),
			instructions: frontmatter[2],
		};
	} catch (error) {
		throw new Error(`${definitionPath}: ${error.message}`);
	}
}

export function renderZcodeAgentDefinition(definition) {
	return `---\n# 자동 생성: .codex/agents/${definition.name}.toml\n# 직접 편집하지 마세요. 원본을 수정한 뒤 pnpm agents:sync를 실행하세요.\nname: ${definition.name}\ndescription: ${JSON.stringify(definition.description)}\n---\n\n${definition.instructions}`;
}
