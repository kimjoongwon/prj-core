import fs from "fs";
import path from "path";
import type {
  AppInfo,
  CoreCategory,
  FeatureInfo,
  PlansTree,
  ProjectInfo,
} from "../../types/plans";
import { CORE_CATEGORY_NAMES } from "../../types/plans";

/**
 * plans 폴더의 기본 경로
 */
const PLANS_ROOT = path.join(process.cwd(), "plans");

/**
 * 디렉토리 존재 여부 확인
 */
function isDirectory(dirPath: string): boolean {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

/**
 * 디렉토리 내 하위 디렉토리 목록 가져오기
 */
function getSubdirectories(dirPath: string): string[] {
  try {
    return fs
      .readdirSync(dirPath)
      .filter((name) => !name.startsWith("."))
      .filter((name) => isDirectory(path.join(dirPath, name)));
  } catch {
    return [];
  }
}

/**
 * 폴더명에서 날짜 기반 기능 정보 추출
 * 형식: YYYY-MM-DD-FeatureName 또는 YYYY-MM-DD-Feature-Name
 */
function parseFeatureFolder(folderName: string, basePath: string): FeatureInfo | null {
  // YYYY-MM-DD- 패턴 매칭
  const dateMatch = folderName.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);

  if (dateMatch) {
    const [, date, namePart] = dateMatch;
    // kebab-case를 사람이 읽기 좋은 형태로 변환
    const name = namePart.replace(/-/g, " ");

    return {
      id: folderName,
      name,
      date,
      path: basePath,
    };
  }

  // 날짜 없는 폴더는 기능으로 간주하지 않음
  return null;
}

/**
 * _core 폴더에서 카테고리 목록 파싱
 */
function parseCoreCategories(): CoreCategory[] {
  const corePath = path.join(PLANS_ROOT, "_core");
  if (!isDirectory(corePath)) {
    return [];
  }

  const categoryDirs = getSubdirectories(corePath);
  return categoryDirs.map((categoryId) => {
    const categoryPath = path.join(corePath, categoryId);
    const featureDirs = getSubdirectories(categoryPath);

    const features = featureDirs
      .map((featureDir) =>
        parseFeatureFolder(featureDir, `_core/${categoryId}/${featureDir}`)
      )
      .filter((f): f is FeatureInfo => f !== null);

    return {
      id: categoryId,
      name: CORE_CATEGORY_NAMES[categoryId] ?? categoryId,
      features,
    };
  });
}

/**
 * 프로젝트 폴더에서 앱 목록 파싱
 */
function parseApps(projectPath: string, projectId: string): AppInfo[] {
  const appDirs = getSubdirectories(projectPath);

  return appDirs.map((appId) => {
    const appPath = path.join(projectPath, appId);
    const featureDirs = getSubdirectories(appPath);

    const features = featureDirs
      .map((featureDir) =>
        parseFeatureFolder(featureDir, `${projectId}/${appId}/${featureDir}`)
      )
      .filter((f): f is FeatureInfo => f !== null);

    // 앱 이름 형식화 (kebab-case를 사람 읽기 좋게)
    const name = appId.replace(/-/g, " ");

    return {
      id: appId,
      name,
      features,
    };
  });
}

/**
 * 프로젝트 목록 파싱
 */
function parseProjects(): ProjectInfo[] {
  const dirs = getSubdirectories(PLANS_ROOT);
  const projectDirs = dirs.filter((d) => d !== "_core");

  return projectDirs.map((projectId) => {
    const projectPath = path.join(PLANS_ROOT, projectId);
    const apps = parseApps(projectPath, projectId);

    return {
      id: projectId,
      name: projectId,
      apps,
    };
  });
}

/**
 * 전체 기획서 트리 구조 파싱
 * 서버 사이드에서만 실행 가능
 */
export function parsePlansTree(): PlansTree {
  return {
    core: parseCoreCategories(),
    projects: parseProjects(),
  };
}

/**
 * 특정 기획서 경로의 README.md 또는 01-overview.md 내용 읽기
 */
export function readPlanContent(planPath: string): string | null {
  const fullPath = path.join(PLANS_ROOT, planPath);

  // README.md 또는 01-overview.md 시도
  const candidates = ["README.md", "01-overview.md"];

  for (const fileName of candidates) {
    const filePath = path.join(fullPath, fileName);
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, "utf-8");
      }
    } catch {
      continue;
    }
  }

  return null;
}
