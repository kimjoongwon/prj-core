import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(__dirname, "..");

const reactQueryImports = {
  core: [
    `import {
  useMutation,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery
} from '@tanstack/react-query';`,
    `import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  InfiniteData,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseInfiniteQueryResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult
} from '@tanstack/react-query';`,
  ],
  idp: [
    `import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  InfiniteData,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult,
  UseSuspenseInfiniteQueryOptions,
  UseSuspenseInfiniteQueryResult,
  UseSuspenseQueryOptions,
  UseSuspenseQueryResult,
} from "@tanstack/react-query";`,
    `import {
  useMutation,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";`,
  ],
};

const splitConfigs = [
  {
    key: "core",
    sourceFile: "src/apis.ts",
    modelIndex: "src/model/index.ts",
    outputRoot: "src/core",
    modelImportPrefix: "../../model",
    mutatorValueImport:
      `import { customInstance } from "../../libs/customAxios";`,
    mutatorTypeImport:
      `import type { BodyType, ErrorType } from "../../libs/customAxios";`,
    secondParameterAlias:
      `type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];`,
    routeMatchers: [
      [/\/api\/v1\/abilities\b/, "abilities"],
      [/\/api\/v1\/actions\b/, "actions"],
      [/\/api\/v1\/categories\b/, "categories"],
      [/\/api\/v1\/grants\b/, "grants"],
      [/\/api\/v1\/groups\b/, "groups"],
      [/\/api\/v1\/inquiries\b/, "inquiries"],
      [/\/api\/v1\/roles\b/, "roles"],
      [/\/api\/v1\/routines\b/, "routines"],
      [/\/api\/v1\/spaces\b/, "spaces"],
      [/\/api\/v1\/subjects\b/, "subjects"],
      [/\/api\/v1\/tasks\b/, "tasks"],
      [/\/api\/v1\/templates\b/, "templates"],
      [/\/api\/v1\/timelines\b/, "timelines"],
      [/\/api\/v1\/translations\b/, "translations"],
      [/\/api\/v1\/users\b/, "users"],
    ],
    supplementalModelExports: {
      abilities: ["AbilityResponseDto"],
      actions: ["ActionConfigDto", "ActionDto", "ActionResponseDto"],
      categories: ["CategoryDto"],
      groups: ["GroupDto"],
      inquiries: [
        "InquiryCategory",
        "InquiryChannel",
        "InquiryDto",
        "InquiryMessageDto",
        "InquiryParticipantDto",
        "InquiryPriority",
        "InquiryStatus",
      ],
      roles: ["RoleDto"],
      routines: [
        "ActivityDto",
        "CreateRoutineActivityItemDto",
        "RoutineDto",
        "TaskDto",
      ],
      spaces: ["GroundDto", "SpaceDto"],
      subjects: ["SubjectDto", "SubjectFieldDto"],
      tasks: ["ExerciseDto", "TaskDto"],
      templates: ["CreateTemplateVariableItemDto", "TemplateDto"],
      timelines: [
        "CreateSessionDtoRecurringDayOfWeek",
        "ProgramDto",
        "SessionDto",
        "TimelineDto",
        "UpdateSessionDtoRecurringDayOfWeek",
      ],
      users: ["UserDto"],
    },
  },
  {
    key: "idp",
    sourceFile: "src/idp-apis.ts",
    modelIndex: "src/idp-model/index.ts",
    outputRoot: "src/idp",
    modelImportPrefix: "../../idp-model",
    mutatorValueImport:
      `import { customIdpInstance } from "../../libs/customIdpAxios";`,
    mutatorTypeImport:
      `import type { BodyType, ErrorType } from "../../libs/customIdpAxios";`,
    secondParameterAlias:
      `type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];`,
    routeMatchers: [
      [/\/api\/interaction\b/, "interaction"],
      [/\/api\/password-policy\b/, "password-reset"],
      [/\/api\/forgot-password\b/, "password-reset"],
      [/\/api\/reset-password\b/, "password-reset"],
      [/\/api\/v1\/auth\b/, "auth"],
      [/\/api\/v1\/idp\/accounts\b/, "idp-accounts"],
      [/\/api\/v1\/idp\/dashboard\b/, "idp-dashboard"],
      [/\/api\/v1\/oidc-clients\b/, "oidc-clients"],
      [/\/api\/v1\/oidc-sessions\b/, "oidc-sessions"],
      [/\/api\/v1\/idp\/security-policy\b/, "security-policy"],
    ],
    supplementalModelExports: {
      auth: ["AuthAuditLogDto", "AuthAuditResult"],
      "idp-accounts": ["IdpAccountDto"],
      "idp-dashboard": ["DashboardStatsDto", "LoginTrendItemDto"],
      "oidc-clients": ["OidcClientDto"],
      "oidc-sessions": ["OidcSessionDto"],
    },
  },
];

const rootHeader = [
  "/**",
  " * Generated from the current Orval monolith output.",
  " * Do not edit manually. Update the upstream Orval output or rerun split-orval-output.mjs.",
  " */",
  "",
].join("\n");

function createSourceFile(filePath, content) {
  return ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function getNodeText(sourceText, node) {
  return sourceText.slice(node.pos, node.end).trim();
}

function hasJsDoc(node) {
  return ts.getJSDocCommentsAndTags(node).length > 0;
}

function isOperationStart(node, sourceFile) {
  if (ts.isVariableStatement(node)) {
    const hasExport = node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword);
    if (!hasExport || !hasJsDoc(node)) {
      return false;
    }

    const name = node.declarationList.declarations[0]?.name.getText(sourceFile);
    return typeof name === "string" && !name.startsWith("use") && !name.startsWith("prefetch") && !name.startsWith("getGet");
  }

  return false;
}

async function collectNamedExports(filePath) {
  const content = await fs.readFile(filePath, "utf8");
  const sourceFile = createSourceFile(filePath, content);
  const exportNames = [];

  for (const statement of sourceFile.statements) {
    if (ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement) || ts.isEnumDeclaration(statement) || ts.isClassDeclaration(statement) || ts.isFunctionDeclaration(statement)) {
      if (statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword) && statement.name) {
        exportNames.push(statement.name.getText(sourceFile));
      }
      continue;
    }

    if (ts.isVariableStatement(statement) && statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)) {
      for (const declaration of statement.declarationList.declarations) {
        exportNames.push(declaration.name.getText(sourceFile));
      }
    }
  }

  return exportNames;
}

async function createModelExportMap(indexPath) {
  const indexContent = await fs.readFile(indexPath, "utf8");
  const sourceFile = createSourceFile(indexPath, indexContent);
  const exportMap = new Map();

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier) {
      continue;
    }

    const modulePath = statement.moduleSpecifier.text;
    const filePath = path.resolve(path.dirname(indexPath), `${modulePath}.ts`);
    const exportNames = await collectNamedExports(filePath);

    for (const exportName of exportNames) {
      exportMap.set(exportName, modulePath.replace(/^\.\//, ""));
    }
  }

  return exportMap;
}

function buildOperationGroups(sourceFile, sourceText) {
  const operationGroups = [];
  let currentGroup = null;

  for (const statement of sourceFile.statements) {
    if (isOperationStart(statement, sourceFile)) {
      if (currentGroup) {
        operationGroups.push(currentGroup);
      }

      currentGroup = {
        textParts: [getNodeText(sourceText, statement)],
      };
      continue;
    }

    if (currentGroup) {
      currentGroup.textParts.push(getNodeText(sourceText, statement));
    }
  }

  if (currentGroup) {
    operationGroups.push(currentGroup);
  }

  return operationGroups;
}

function resolveTag(groupText, routeMatchers) {
  for (const [pattern, tag] of routeMatchers) {
    if (pattern.test(groupText)) {
      return tag;
    }
  }

  throw new Error(`Unable to resolve split tag for operation block:\n${groupText.slice(0, 240)}`);
}

function collectUsedModelImports(groupText, modelExportMap) {
  const modelImports = [];

  for (const [exportName, modulePath] of modelExportMap.entries()) {
    const pattern = new RegExp(`\\b${exportName}\\b`);
    if (pattern.test(groupText)) {
      modelImports.push({ exportName, modulePath });
    }
  }

  return modelImports.sort((left, right) => left.exportName.localeCompare(right.exportName));
}

async function writeTagModules(splitConfig) {
  const sourcePath = path.join(packageRoot, splitConfig.sourceFile);
  const sourceText = await fs.readFile(sourcePath, "utf8");
  const sourceFile = createSourceFile(sourcePath, sourceText);
  const modelExportMap = await createModelExportMap(path.join(packageRoot, splitConfig.modelIndex));
  const tagGroups = new Map();

  for (const group of buildOperationGroups(sourceFile, sourceText)) {
    const groupText = group.textParts.join("\n\n");
    const tag = resolveTag(groupText, splitConfig.routeMatchers);

    if (!tagGroups.has(tag)) {
      tagGroups.set(tag, []);
    }

    tagGroups.get(tag).push(groupText);
  }

  for (const [tag, groups] of tagGroups.entries()) {
    const usedImports = new Map();

    for (const groupText of groups) {
      for (const modelImport of collectUsedModelImports(groupText, modelExportMap)) {
        usedImports.set(modelImport.exportName, modelImport.modulePath);
      }
    }

    for (const exportName of splitConfig.supplementalModelExports[tag] ?? []) {
      const modulePath = modelExportMap.get(exportName);
      if (modulePath) {
        usedImports.set(exportName, modulePath);
      }
    }

    const modelImportLines = [...usedImports.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([exportName, modulePath]) => `import type { ${exportName} } from "${splitConfig.modelImportPrefix}/${modulePath}";`);
    const modelExportLines = [...usedImports.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([exportName]) => `export type { ${exportName} };`);

    const outputLines = [
      rootHeader.trimEnd(),
      ...reactQueryImports[splitConfig.key],
      "",
      ...modelImportLines,
      ...modelExportLines,
      splitConfig.mutatorTypeImport,
      splitConfig.mutatorValueImport,
      "",
      splitConfig.secondParameterAlias,
      "",
      groups.join("\n\n"),
      "",
    ];

    const outputPath = path.join(packageRoot, splitConfig.outputRoot, tag, "index.ts");
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, outputLines.join("\n"), "utf8");
  }
}

await Promise.all(splitConfigs.map(writeTagModules));
