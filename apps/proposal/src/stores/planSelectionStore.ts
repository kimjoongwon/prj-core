import { makeAutoObservable, runInAction } from "mobx";
import type {
  AppInfo,
  CoreCategory,
  FeatureInfo,
  PlansTree,
  ProjectInfo,
} from "../types/plans";

/**
 * 선택 가능한 엔트리 타입 (프로젝트 또는 _core)
 */
export type SelectableEntry =
  | { type: "project"; data: ProjectInfo }
  | { type: "core" };

/**
 * 선택 가능한 2단계 엔트리 (앱 또는 카테고리)
 */
export type SelectableSecondLevel =
  | { type: "app"; data: AppInfo }
  | { type: "category"; data: CoreCategory };

/**
 * 기획서 선택 상태 관리 Store
 */
export class PlanSelectionStore {
  // 전체 기획서 트리
  private _tree: PlansTree | null = null;

  // 선택 상태
  selectedProjectId: string | null = null;
  selectedSecondLevelId: string | null = null;
  selectedFeatureId: string | null = null;

  // 로딩 상태
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  /**
   * API에서 기획서 트리 로드
   */
  async loadTree() {
    this.isLoading = true;
    this.error = null;

    try {
      const response = await fetch("/api/plan-tree");
      if (!response.ok) {
        throw new Error("기획서 목록을 불러올 수 없습니다");
      }

      const tree: PlansTree = await response.json();

      runInAction(() => {
        this._tree = tree;
        this.isLoading = false;

        // 첫 번째 프로젝트/앱/기능 자동 선택
        this.selectFirstAvailable();
      });
    } catch (e) {
      runInAction(() => {
        this.error = e instanceof Error ? e.message : "알 수 없는 오류";
        this.isLoading = false;
      });
    }
  }

  /**
   * 첫 번째 사용 가능한 항목 자동 선택
   */
  private selectFirstAvailable() {
    if (!this._tree) return;

    // 프로젝트 우선, 없으면 _core
    if (this._tree.projects.length > 0) {
      const firstProject = this._tree.projects[0];
      this.selectedProjectId = firstProject.id;

      if (firstProject.apps.length > 0) {
        const firstApp = firstProject.apps[0];
        this.selectedSecondLevelId = firstApp.id;

        if (firstApp.features.length > 0) {
          this.selectedFeatureId = firstApp.features[0].id;
        }
      }
    } else if (this._tree.core.length > 0) {
      this.selectedProjectId = "_core";
      const firstCategory = this._tree.core[0];
      this.selectedSecondLevelId = firstCategory.id;

      if (firstCategory.features.length > 0) {
        this.selectedFeatureId = firstCategory.features[0].id;
      }
    }
  }

  /**
   * 1단계 항목 목록 (프로젝트 + _core)
   */
  get firstLevelItems(): SelectableEntry[] {
    if (!this._tree) return [];

    const items: SelectableEntry[] = [];

    // _core가 있으면 먼저 추가
    if (this._tree.core.length > 0) {
      items.push({ type: "core" });
    }

    // 프로젝트 추가
    for (const project of this._tree.projects) {
      items.push({ type: "project", data: project });
    }

    return items;
  }

  /**
   * 현재 선택된 1단계 항목인지 확인
   */
  isCore(): boolean {
    return this.selectedProjectId === "_core";
  }

  /**
   * 2단계 항목 목록 (앱 또는 카테고리)
   */
  get secondLevelItems(): SelectableSecondLevel[] {
    if (!this._tree || !this.selectedProjectId) return [];

    if (this.isCore()) {
      return this._tree.core.map((cat) => ({
        type: "category",
        data: cat,
      }));
    }

    const project = this._tree.projects.find(
      (p) => p.id === this.selectedProjectId
    );
    if (!project) return [];

    return project.apps.map((app) => ({
      type: "app",
      data: app,
    }));
  }

  /**
   * 3단계 항목 목록 (기능)
   */
  get featureItems(): FeatureInfo[] {
    if (!this._tree || !this.selectedProjectId || !this.selectedSecondLevelId)
      return [];

    if (this.isCore()) {
      const category = this._tree.core.find(
        (c) => c.id === this.selectedSecondLevelId
      );
      return category?.features ?? [];
    }

    const project = this._tree.projects.find(
      (p) => p.id === this.selectedProjectId
    );
    const app = project?.apps.find((a) => a.id === this.selectedSecondLevelId);
    return app?.features ?? [];
  }

  /**
   * 현재 선택된 기능 정보
   */
  get selectedFeature(): FeatureInfo | null {
    return this.featureItems.find((f) => f.id === this.selectedFeatureId) ?? null;
  }

  /**
   * 현재 선택된 기획서 경로
   */
  get currentPlanPath(): string | null {
    return this.selectedFeature?.path ?? null;
  }

  /**
   * 1단계 선택 (프로젝트 또는 _core)
   */
  selectFirstLevel(id: string) {
    this.selectedProjectId = id;
    this.selectedSecondLevelId = null;
    this.selectedFeatureId = null;

    // 자동으로 첫 번째 2단계 선택
    const secondItems = this.secondLevelItems;
    if (secondItems.length > 0) {
      const first = secondItems[0];
      this.selectSecondLevel(first.data.id);
    }
  }

  /**
   * 2단계 선택 (앱 또는 카테고리)
   */
  selectSecondLevel(id: string) {
    this.selectedSecondLevelId = id;
    this.selectedFeatureId = null;

    // 자동으로 첫 번째 3단계 선택
    const features = this.featureItems;
    if (features.length > 0) {
      this.selectedFeatureId = features[0].id;
    }
  }

  /**
   * 3단계 선택 (기능)
   */
  selectFeature(id: string) {
    this.selectedFeatureId = id;
  }

  /**
   * 1단계 표시 이름 가져오기
   */
  getFirstLevelDisplayName(id: string): string {
    if (id === "_core") {
      return "_core (공통시스템)";
    }
    return id;
  }

  /**
   * 2단계 표시 이름 가져오기
   */
  getSecondLevelDisplayName(): string | null {
    const item = this.secondLevelItems.find(
      (i) => i.data.id === this.selectedSecondLevelId
    );
    if (!item) return null;

    if (item.type === "category") {
      return `${item.data.id} (${item.data.name})`;
    }
    return item.data.name;
  }
}

/**
 * 전역 store 인스턴스
 */
let planSelectionStore: PlanSelectionStore | null = null;

export function getPlanSelectionStore(): PlanSelectionStore {
  if (!planSelectionStore) {
    planSelectionStore = new PlanSelectionStore();
  }
  return planSelectionStore;
}
