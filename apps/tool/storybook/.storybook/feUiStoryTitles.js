import { readFile } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import traverseModule from "@babel/traverse";
import * as t from "@babel/types";

const STORY_FILE_SUFFIX_RE = /\.stories\.(js|jsx|mjs|ts|tsx)$/;

const traverse = traverseModule.default ?? traverseModule;

function normalizeSlashes(value) {
  return value.split(sep).join("/");
}

function stripStorySuffix(filePath) {
  return filePath.replace(STORY_FILE_SUFFIX_RE, "");
}

function unwrapObjectExpression(node) {
  if (!node) {
    return null;
  }

  if (t.isObjectExpression(node)) {
    return node;
  }

  if (
    t.isTSSatisfiesExpression(node) ||
    t.isTSAsExpression(node) ||
    t.isTypeCastExpression(node)
  ) {
    return unwrapObjectExpression(node.expression);
  }

  return null;
}

function findMetaObjectExpression(ast) {
  let metaIdentifier = null;
  let metaObjectExpression = null;

  traverse(ast, {
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;
      const objectExpression = unwrapObjectExpression(declaration);

      if (objectExpression) {
        metaObjectExpression = objectExpression;
        path.stop();
        return;
      }

      if (t.isIdentifier(declaration)) {
        metaIdentifier = declaration.name;
      }
    },
  });

  if (metaObjectExpression || !metaIdentifier) {
    return metaObjectExpression;
  }

  traverse(ast, {
    VariableDeclarator(path) {
      if (!t.isIdentifier(path.node.id) || path.node.id.name !== metaIdentifier) {
        return;
      }

      const objectExpression = unwrapObjectExpression(path.node.init);
      if (objectExpression) {
        metaObjectExpression = objectExpression;
        path.stop();
      }
    },
  });

  return metaObjectExpression;
}

export function isFeUiStoryFile(filePath, feUiStoryRoot) {
  if (!STORY_FILE_SUFFIX_RE.test(filePath)) {
    return false;
  }

  const absoluteRoot = resolve(feUiStoryRoot);
  const absolutePath = resolve(filePath);

  return (
    absolutePath === absoluteRoot ||
    absolutePath.startsWith(`${absoluteRoot}${sep}`)
  );
}

export function getFeUiStoryTitle(filePath, feUiStoryRoot) {
  const relativePath = normalizeSlashes(relative(feUiStoryRoot, filePath));
  const storyPath = stripStorySuffix(relativePath);
  const segments = storyPath.split("/").filter(Boolean);

  if (segments.length === 0) {
    return "";
  }

  const fileName = segments.at(-1);
  const parentName = segments.at(-2);

  if (
    fileName &&
    parentName &&
    fileName.toLowerCase() === parentName.toLowerCase()
  ) {
    segments.pop();
  }

  return segments.join("/");
}

export async function applyFeUiStoryTitleTransform(code, id, feUiStoryRoot) {
  const filePath = id.split("?")[0];
  if (!isFeUiStoryFile(filePath, feUiStoryRoot)) {
    return null;
  }

  const expectedTitle = getFeUiStoryTitle(filePath, feUiStoryRoot);
  if (!expectedTitle) {
    return null;
  }

  const ast = parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  const metaObject = findMetaObjectExpression(ast);

  if (!metaObject) {
    return null;
  }

  const existingTitleProperty = metaObject.properties.find(
    (property) =>
      t.isObjectProperty(property) &&
      !property.computed &&
      ((t.isIdentifier(property.key) && property.key.name === "title") ||
        (t.isStringLiteral(property.key) && property.key.value === "title")),
  );

  if (existingTitleProperty && t.isObjectProperty(existingTitleProperty)) {
    existingTitleProperty.value = t.stringLiteral(expectedTitle);
  } else {
    metaObject.properties.unshift(
      t.objectProperty(t.identifier("title"), t.stringLiteral(expectedTitle)),
    );
  }

  return generate(
    ast,
    {
      retainLines: true,
    },
    code,
  );
}

export function createFeUiStoryIndexer(feUiStoryRoot, existingIndexer) {
  return {
    ...existingIndexer,
    async createIndex(fileName, options) {
      const entries = await existingIndexer.createIndex(fileName, options);
      if (!isFeUiStoryFile(fileName, feUiStoryRoot)) {
        return entries;
      }

      const title = options.makeTitle(getFeUiStoryTitle(fileName, feUiStoryRoot));

      return entries.map((entry) => ({
        ...entry,
        title,
        metaId: undefined,
        __id: undefined,
      }));
    },
  };
}

export async function readStoryExportNames(fileName) {
  const source = await readFile(fileName, "utf8");
  const ast = parse(source, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });
  const exportNames = [];

  traverse(ast, {
    ExportNamedDeclaration(path) {
      const declaration = path.node.declaration;
      if (t.isVariableDeclaration(declaration)) {
        declaration.declarations.forEach((declarator) => {
          if (t.isIdentifier(declarator.id)) {
            exportNames.push(declarator.id.name);
          }
        });
        return;
      }

      if (t.isFunctionDeclaration(declaration) && declaration.id) {
        exportNames.push(declaration.id.name);
        return;
      }

      path.node.specifiers.forEach((specifier) => {
        if (t.isExportSpecifier(specifier) && t.isIdentifier(specifier.exported)) {
          exportNames.push(specifier.exported.name);
        }
      });
    },
  });

  return exportNames.filter((name) => name !== "default");
}

export function toStorybookImportPath(filePath, configDir) {
  return normalizeSlashes(relative(configDir, filePath));
}

export function getStoryComponentPath(filePath, feUiStoryRoot) {
  const relativeDir = normalizeSlashes(relative(feUiStoryRoot, dirname(filePath)));
  const storyBaseName = stripStorySuffix(relative(filePath, filePath));
  const fileName = stripStorySuffix(relative(filePath, filePath));

  return { relativeDir, fileName, ext: extname(filePath), storyBaseName };
}
