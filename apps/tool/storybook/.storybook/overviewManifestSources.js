import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const storybookConfigDir = fileURLToPath(new URL(".", import.meta.url));
const defaultRepositoryRoot = resolve(storybookConfigDir, "../../../..");

function normalizeSlashes(value) {
  return value.split(sep).join("/");
}

function readSourceFiles(directory, predicate) {
  if (!existsSync(directory)) {
    return [];
  }

  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const entryPath = join(directory, entry.name);
      if (entry.isDirectory()) {
        return readSourceFiles(entryPath, predicate);
      }
      return predicate(entryPath) ? [entryPath] : [];
    })
    .sort((left, right) => left.localeCompare(right));
}

function toSourceMap(files, manifestDirectory) {
  return Object.fromEntries(
    files.map((filePath) => [
      normalizeSlashes(relative(manifestDirectory, filePath)),
      readFileSync(filePath, "utf8"),
    ]),
  );
}

function isPurePageStory(relativePath) {
  return /^[^/]+\/[^/]+\.stories\.tsx$/.test(relativePath);
}

function isPurePageSpec(relativePath) {
  return /^[^/]+\/[^/]+\.spec\.md$/.test(relativePath);
}

function isRoutePage(relativePath) {
  return /(?:^|\/)page\.tsx$/.test(relativePath);
}

function isRouteSpec(relativePath) {
  return /(?:^|\/)page\.spec\.md$/.test(relativePath);
}

export function createOverviewManifestSourceMaps(
  repositoryRoot = defaultRepositoryRoot,
) {
  const repoRoot = resolve(repositoryRoot);
  const manifestDirectory = join(
    repoRoot,
    "apps/tool/storybook/src/overview",
  );
  const purePageDirectory = join(repoRoot, "packages/fe-ui/src/page");
  const adminRouteDirectory = join(repoRoot, "apps/admin/web/src/app");
  const idpRouteDirectory = join(repoRoot, "apps/idp/web/src/app");

  const purePageFiles = readSourceFiles(purePageDirectory, (filePath) => {
    const relativePath = normalizeSlashes(relative(purePageDirectory, filePath));
    return isPurePageStory(relativePath) || isPurePageSpec(relativePath);
  });
  const adminRouteFiles = readSourceFiles(adminRouteDirectory, (filePath) =>
    isRoutePage(normalizeSlashes(relative(adminRouteDirectory, filePath))) ||
    isRouteSpec(normalizeSlashes(relative(adminRouteDirectory, filePath))),
  );
  const idpRouteFiles = readSourceFiles(idpRouteDirectory, (filePath) =>
    isRoutePage(normalizeSlashes(relative(idpRouteDirectory, filePath))) ||
    isRouteSpec(normalizeSlashes(relative(idpRouteDirectory, filePath))),
  );

  return {
    storySources: toSourceMap(
      purePageFiles.filter((filePath) =>
        isPurePageStory(normalizeSlashes(relative(purePageDirectory, filePath))),
      ),
      manifestDirectory,
    ),
    purePageSpecSources: toSourceMap(
      purePageFiles.filter((filePath) =>
        isPurePageSpec(normalizeSlashes(relative(purePageDirectory, filePath))),
      ),
      manifestDirectory,
    ),
    adminRouteSources: toSourceMap(
      adminRouteFiles.filter((filePath) =>
        isRoutePage(normalizeSlashes(relative(adminRouteDirectory, filePath))),
      ),
      manifestDirectory,
    ),
    adminRouteSpecSources: toSourceMap(
      adminRouteFiles.filter((filePath) =>
        isRouteSpec(normalizeSlashes(relative(adminRouteDirectory, filePath))),
      ),
      manifestDirectory,
    ),
    idpRouteSources: toSourceMap(
      idpRouteFiles.filter((filePath) =>
        isRoutePage(normalizeSlashes(relative(idpRouteDirectory, filePath))),
      ),
      manifestDirectory,
    ),
    idpRouteSpecSources: toSourceMap(
      idpRouteFiles.filter((filePath) =>
        isRouteSpec(normalizeSlashes(relative(idpRouteDirectory, filePath))),
      ),
      manifestDirectory,
    ),
  };
}

export function serializeOverviewManifestSourceMaps(
  repositoryRoot = defaultRepositoryRoot,
) {
  return JSON.stringify(createOverviewManifestSourceMaps(repositoryRoot));
}
