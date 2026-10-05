import * as fs from "node:fs";
import * as path from "node:path";
import { getDMMF } from "@prisma/internals";

export interface ModelInfo {
	name: string;
	displayName: string | null;
}

export interface FieldInfo {
	name: string;
	displayName: string | null;
	modelName: string;
}

/**
 * DMMF model field의 schema-first 계약 manifest입니다.
 *
 * `isRequired`는 property optional 여부가 아니라 Prisma nullable 여부의
 * 반대값입니다. 따라서 `String?`는 `isRequired: false`로 표현됩니다.
 */
export interface FieldContractManifest {
	modelName: string;
	fieldName: string;
	type: string;
	isRequired: boolean;
	isList: boolean;
	isRelation: boolean;
	isEnum: boolean;
	dbName: string | null;
}

interface DmmfModel {
	name: string;
	documentation?: string;
	fields: DmmfField[];
}

interface DmmfField {
	name: string;
	documentation?: string;
	kind: string;
	type: string;
	isRequired: boolean;
	isList: boolean;
	relationName?: string;
	dbName?: string | null;
}

/**
 * Prisma DMMF를 파싱하여 모델/필드 정보를 추출하는 유틸리티
 *
 * Prisma 스키마의 `/// @displayName 한글명` 주석을 파싱하여
 * Subject 테이블 동기화에 필요한 정보를 제공합니다.
 */
export class DmmfParser {
	private models: DmmfModel[] = [];
	private initialized = false;

	/**
	 * 스키마 파일에서 DMMF를 파싱하여 초기화합니다.
	 */
	async initialize(): Promise<void> {
		if (this.initialized) {
			return;
		}

		// 스키마 디렉토리 경로 찾기
		const schemaDir = this.findSchemaDirectory();
		const schemaContent = this.readSchemaFiles(schemaDir);

		const dmmf = await getDMMF({
			datamodel: schemaContent,
		});

		this.models = dmmf.datamodel.models as unknown as DmmfModel[];
		this.initialized = true;
	}

	/**
	 * 스키마 디렉토리를 찾습니다.
	 */
	private findSchemaDirectory(): string {
		// 현재 파일 위치 기준으로 상위 디렉토리에서 schema 폴더 찾기
		const possiblePaths = [
			path.resolve(__dirname, "../../schema"), // dist/src에서 실행 시
			path.resolve(__dirname, "../schema"), // src에서 실행 시
			path.resolve(__dirname, "../../../schema"), // dist/src/utils에서 실행 시
			path.resolve(process.cwd(), "packages/be-prisma/schema"),
			path.resolve(process.cwd(), "../../packages/be-prisma/schema"), // apps/server에서 실행 시
			path.resolve(process.cwd(), "schema"),
		];

		for (const schemaPath of possiblePaths) {
			if (fs.existsSync(schemaPath)) {
				return schemaPath;
			}
		}

		throw new Error(
			`스키마 디렉토리를 찾을 수 없습니다. 확인한 경로: ${possiblePaths.join(", ")}`,
		);
	}

	/**
	 * 스키마 디렉토리의 모든 .prisma 파일을 읽어 하나의 문자열로 합칩니다.
	 */
	private readSchemaFiles(schemaDir: string): string {
		const files = this.listSchemaFiles(schemaDir);
		const contents: string[] = [];

		for (const file of files) {
			const filePath = path.join(schemaDir, file);
			contents.push(fs.readFileSync(filePath, "utf-8"));
		}

		return contents.join("\n\n");
	}

	private listSchemaFiles(
		schemaDir: string,
		rootDir: string = schemaDir,
	): string[] {
		const files: string[] = [];
		const entries = fs.readdirSync(schemaDir, { withFileTypes: true });

		for (const entry of entries) {
			const fullPath = path.join(schemaDir, entry.name);
			if (entry.isDirectory()) {
				files.push(...this.listSchemaFiles(fullPath, rootDir));
				continue;
			}
			if (entry.isFile() && entry.name.endsWith(".prisma")) {
				files.push(path.relative(rootDir, fullPath));
			}
		}

		return files.sort((left, right) => {
			if (left === "_base.prisma") {
				return -1;
			}
			if (right === "_base.prisma") {
				return 1;
			}
			return left.localeCompare(right);
		});
	}

	/**
	 * 모든 모델 정보를 추출합니다.
	 */
	parseModels(): ModelInfo[] {
		this.ensureInitialized();
		return this.models.map((model) => ({
			name: model.name,
			displayName: this.extractDisplayName(model.documentation),
		}));
	}

	/**
	 * 모든 필드 정보를 추출합니다.
	 * 관계 필드는 제외됩니다.
	 */
	parseFields(): FieldInfo[] {
		this.ensureInitialized();
		const fields: FieldInfo[] = [];

		for (const model of this.models) {
			for (const field of model.fields) {
				// 관계 필드 제외
				if (field.kind === "object" || field.relationName) {
					continue;
				}

				fields.push({
					name: field.name,
					displayName: this.extractDisplayName(field.documentation),
					modelName: model.name,
				});
			}
		}

		return fields;
	}

	/**
	 * 특정 모델의 필드 정보를 추출합니다.
	 */
	parseFieldsByModel(modelName: string): FieldInfo[] {
		this.ensureInitialized();
		const model = this.models.find((m) => m.name === modelName);
		if (!model) {
			return [];
		}

		return model.fields
			.filter((field) => field.kind !== "object" && !field.relationName)
			.map((field) => ({
				name: field.name,
				displayName: this.extractDisplayName(field.documentation),
				modelName: model.name,
			}));
	}

	/**
	 * 모든 model field를 DMMF 계약 manifest로 반환합니다.
	 *
	 * 관계 필드도 포함하며, relation/API projection/masking 정책은 추론하지
	 * 않고 DMMF가 제공한 type, kind, required/list, dbName만 보존합니다.
	 */
	parseFieldContractManifest(): FieldContractManifest[] {
		this.ensureInitialized();

		return this.models.flatMap((model) =>
			model.fields.map((field) =>
				this.toFieldContractManifest(model.name, field),
			),
		);
	}

	/**
	 * 특정 model의 모든 field를 DMMF 계약 manifest로 반환합니다.
	 */
	parseFieldContractManifestByModel(
		modelName: string,
	): FieldContractManifest[] {
		this.ensureInitialized();
		const model = this.models.find((candidate) => candidate.name === modelName);

		return (
			model?.fields.map((field) =>
				this.toFieldContractManifest(model.name, field),
			) ?? []
		);
	}

	private toFieldContractManifest(
		modelName: string,
		field: DmmfField,
	): FieldContractManifest {
		return {
			modelName,
			fieldName: field.name,
			type: field.type,
			isRequired: field.isRequired,
			isList: field.isList,
			isRelation: field.kind === "object" || field.relationName !== undefined,
			isEnum: field.kind === "enum",
			dbName: field.dbName ?? null,
		};
	}

	/**
	 * documentation에서 @displayName 주석을 추출합니다.
	 *
	 * @example
	 * // 입력: "@displayName 사용자\n@description 사용자 모델"
	 * // 출력: "사용자"
	 */
	private extractDisplayName(documentation: string | undefined): string | null {
		if (!documentation) {
			return null;
		}

		const match = documentation.match(/@displayName\s+(.+?)(?:\n|$)/);
		return match ? match[1].trim() : null;
	}

	/**
	 * 초기화 여부를 확인합니다.
	 */
	private ensureInitialized(): void {
		if (!this.initialized) {
			throw new Error(
				"DmmfParser가 초기화되지 않았습니다. initialize()를 먼저 호출하세요.",
			);
		}
	}
}

/**
 * DmmfParser 싱글톤 인스턴스
 */
let parserInstance: DmmfParser | null = null;

/**
 * DmmfParser 싱글톤 인스턴스를 가져옵니다.
 * 처음 호출 시 자동으로 초기화됩니다.
 */
export async function getDmmfParser(): Promise<DmmfParser> {
	if (!parserInstance) {
		parserInstance = new DmmfParser();
		await parserInstance.initialize();
	}
	return parserInstance;
}
