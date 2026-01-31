"use client";

import { Spinner } from "@heroui/react";
import { ChevronRight, FolderOpen } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { usePlanSelectionStore } from "../../stores";
import { PlanSelector } from "./PlanSelector";

/**
 * 기획서 선택 Breadcrumb
 * 프로젝트 > 앱 > 기능 형태로 표시
 */
export const PlansBreadcrumb = observer(function PlansBreadcrumb() {
  const store = usePlanSelectionStore();

  // 컴포넌트 마운트 시 트리 로드
  useEffect(() => {
    store.loadTree();
  }, [store]);

  if (store.isLoading) {
    return (
      <div className="flex items-center gap-2 py-3">
        <Spinner size="sm" />
        <span className="text-sm text-default-500">기획서 목록 로딩 중...</span>
      </div>
    );
  }

  if (store.error) {
    return (
      <div className="flex items-center gap-2 py-3">
        <span className="text-sm text-danger">{store.error}</span>
      </div>
    );
  }

  // 1단계 항목 목록 생성
  const firstLevelItems = store.firstLevelItems.map((entry) => {
    if (entry.type === "core") {
      return {
        id: "_core",
        label: "_core",
        description: "공통 시스템",
      };
    }
    return {
      id: entry.data.id,
      label: entry.data.id,
      description: `${entry.data.apps.length}개 앱`,
    };
  });

  // 2단계 항목 목록 생성
  const secondLevelItems = store.secondLevelItems.map((entry) => {
    if (entry.type === "category") {
      return {
        id: entry.data.id,
        label: entry.data.id,
        description: entry.data.name,
      };
    }
    return {
      id: entry.data.id,
      label: entry.data.name,
      description: `${entry.data.features.length}개 기능`,
    };
  });

  // 3단계 항목 목록 생성
  const featureItems = store.featureItems.map((feature) => ({
    id: feature.id,
    label: feature.id,
    description: feature.name,
  }));

  // 현재 선택값 표시
  const firstLevelDisplay = store.selectedProjectId
    ? store.getFirstLevelDisplayName(store.selectedProjectId)
    : "프로젝트 선택";

  const secondLevelDisplay =
    store.getSecondLevelDisplayName() ?? (store.isCore() ? "카테고리 선택" : "앱 선택");

  const featureDisplay =
    store.selectedFeature?.id ?? "기능 선택";

  const handleFirstLevelSelect = (id: string) => {
    store.selectFirstLevel(id);
  };

  const handleSecondLevelSelect = (id: string) => {
    store.selectSecondLevel(id);
  };

  const handleFeatureSelect = (id: string) => {
    store.selectFeature(id);
  };

  return (
    <div className="flex items-center gap-1 py-3">
      <FolderOpen className="w-4 h-4 text-default-500 mr-1" />

      {/* 1단계: 프로젝트 또는 _core */}
      <PlanSelector
        displayValue={firstLevelDisplay}
        items={firstLevelItems}
        onSelect={handleFirstLevelSelect}
        placeholder="프로젝트"
      />

      <ChevronRight className="w-4 h-4 text-default-400" />

      {/* 2단계: 앱 또는 카테고리 */}
      <PlanSelector
        displayValue={secondLevelDisplay}
        items={secondLevelItems}
        onSelect={handleSecondLevelSelect}
        isDisabled={!store.selectedProjectId}
        placeholder={store.isCore() ? "카테고리" : "앱"}
      />

      <ChevronRight className="w-4 h-4 text-default-400" />

      {/* 3단계: 기능 */}
      <PlanSelector
        displayValue={featureDisplay}
        items={featureItems}
        onSelect={handleFeatureSelect}
        isDisabled={!store.selectedSecondLevelId}
        placeholder="기능"
      />
    </div>
  );
});
