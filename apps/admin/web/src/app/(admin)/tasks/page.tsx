"use client";

import {
  getGetTasksQueryKey,
  type TaskDto,
  useDeleteTask,
  useGetTasksSuspense,
} from "@cocrepo/api/core/tasks";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
  DateTimeCell,
  MetaDataGrid,
  Page,
  PageSurface,
  PageTitleBar,
  SectionSurface,
  useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import {
  addToast,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import dynamic from "next/dynamic";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = seconds % 60;
  return minutes > 0 ? `${minutes}분 ${remainSeconds}초` : `${remainSeconds}초`;
};

const leftInputs: InputConfig[] = [
  {
    type: "search",
    id: "search",
    placeholder: "운동명으로 검색...",
    props: {
      debounceMs: 300,
    },
  },
  {
    type: "select",
    id: "spaceScope",
    placeholder: "Space 범위",
    props: {
      options: [
        { label: "현재 Space만", value: "CURRENT" },
        { label: "상위 Space 포함", value: "INCLUDE_ANCESTORS" },
      ],
    },
  },
];

interface TaskExerciseRow {
  id: string;
  name: string;
  duration: number;
  count: number;
  description?: string;
  createdAt: string;
  task: TaskDto;
}

type TasksQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[0];
type SetTasksQueryStates = ReturnType<typeof useMetaDataGridQueryStates>[1];

function buildTaskRows(tasks: TaskDto[]): TaskExerciseRow[] {
  return tasks.map((task) => ({
    id: task.id,
    name: task.exercise.name,
    duration: task.exercise.duration,
    count: task.exercise.count,
    description: task.exercise.description,
    createdAt: task.createdAt,
    task,
  }));
}

function getTaskParams(queryStates: TasksQueryStates) {
  return {
    take: queryStates.take,
    skip: queryStates.skip,
    search: queryStates.search || undefined,
    spaceScope:
      (queryStates.spaceScope as "CURRENT" | "INCLUDE_ANCESTORS") || undefined,
  };
}

function buildTaskColumns({
  onClickTaskName,
  onClickDeleteButton,
}: {
  onClickTaskName: (taskId: string) => void;
  onClickDeleteButton: (task: TaskDto) => void;
}): MetaDataGridColumnConfig<TaskExerciseRow>[] {
  return [
    {
      field: "name",
      label: "운동명",
      size: 200,
      isRequired: true,
      cell: ({ getValue, row }) => (
        <button
          type="button"
          className="cursor-pointer text-left text-primary hover:underline"
          onClick={() => onClickTaskName((row.original as TaskExerciseRow).id)}
        >
          {getValue() as string}
        </button>
      ),
    },
    {
      field: "duration",
      label: "지속시간",
      size: 100,
      align: "center",
      cell: ({ getValue }) => (
        <span>{formatDuration(getValue() as number)}</span>
      ),
    },
    {
      field: "count",
      label: "반복횟수",
      size: 80,
      align: "center",
      cell: ({ getValue }) => <span>{getValue() as number}회</span>,
    },
    {
      field: "description",
      label: "설명",
      size: 250,
      cell: ({ getValue }) => (
        <span className="line-clamp-2 text-sm text-default-500">
          {(getValue() as string | undefined) || "-"}
        </span>
      ),
    },
    {
      field: "createdAt",
      label: "등록일",
      size: 150,
      cell: ({ getValue }) => <DateTimeCell value={getValue() as string} />,
    },
    {
      field: "id",
      label: "액션",
      size: 80,
      align: "center",
      cell: ({ row }) => (
        <button
          type="button"
          className="cursor-pointer text-sm text-danger hover:text-danger-600"
          onClick={() =>
            onClickDeleteButton((row.original as TaskExerciseRow).task)
          }
        >
          삭제
        </button>
      ),
    },
  ];
}

const TasksPageContent = observer(function TasksPageContent({
  queryStates,
  setQueryStates,
  columns,
}: {
  queryStates: TasksQueryStates;
  setQueryStates: SetTasksQueryStates;
  columns: MetaDataGridColumnConfig<TaskExerciseRow>[];
}) {
  const { data: response } = useGetTasksSuspense(getTaskParams(queryStates));
  const tasks = (response?.data ?? []) as TaskDto[];
  const rows = buildTaskRows(tasks);
  const totalCount = response?.meta?.total ?? rows.length;

  return (
    <MetaDataGrid
      config={{
        entity: "Task",
        data: rows,
        totalCount,
        isLoading: false,
        queryStates,
        setQueryStates,
        columns,
        leftInputs,
        emptyMessage: "등록된 태스크가 없습니다.",
      }}
    />
  );
});

const TasksPageInner = observer(function TasksPageInner() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
  const state = useLocalObservable(() => ({
    deleteTarget: null as TaskDto | null,
  }));
  const deleteModal = useDisclosure();
  const deleteMutation = useDeleteTask();

  const onClickTaskName = (taskId: string) => {
    router.push(`/tasks/${taskId}/exercise` as Route);
  };

  const onClickDeleteButton = (task: TaskDto) => {
    state.deleteTarget = task;
    deleteModal.onOpen();
  };

  const onClickDeleteConfirm = () => {
    const target = state.deleteTarget;
    if (!target) {
      return;
    }

    deleteMutation.mutate(
      { taskId: target.id },
      {
        onSuccess: () => {
          addToast({
            title: "삭제 성공",
            description: "태스크와 운동 detail이 삭제되었습니다.",
            color: "success",
          });
          deleteModal.onClose();
          state.deleteTarget = null;
          queryClient.invalidateQueries({
            queryKey: getGetTasksQueryKey(),
          });
        },
        onError: (error) => {
          addToast({
            title: "삭제 실패",
            description:
              error.message ||
              "삭제 중 오류가 발생했습니다. 루틴에서 사용 중인 태스크는 삭제할 수 없습니다.",
            color: "danger",
          });
        },
      },
    );
  };

  const columns = buildTaskColumns({
    onClickTaskName,
    onClickDeleteButton,
  });

  return (
    <Page
      top={
        <PageTitleBar
          title="태스크 목록"
          description="시스템에 등록된 태스크와 운동 detail을 관리합니다."
          actions={
            <Button
              as={Link}
              href={"/tasks/new" as Route}
              color="primary"
              startContent={<Plus className="h-4 w-4" />}
            >
              태스크 등록
            </Button>
          }
        />
      }
    >
      <PageSurface>
        <SectionSurface padding="none">
          <Suspense
            fallback={
              <MetaDataGrid
                config={{
                  entity: "Task",
                  data: [],
                  totalCount: 0,
                  isLoading: true,
                  queryStates,
                  setQueryStates,
                  columns,
                  leftInputs,
                  emptyMessage: "등록된 태스크가 없습니다.",
                }}
              />
            }
          >
            <TasksPageContent
              queryStates={queryStates}
              setQueryStates={setQueryStates}
              columns={columns}
            />
          </Suspense>
        </SectionSurface>
      </PageSurface>
      <Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
        <ModalContent>
          <ModalHeader>태스크 삭제</ModalHeader>
          <ModalBody>
            <p>
              <strong>{state.deleteTarget?.exercise.name}</strong> 운동 detail이
              포함된 태스크를 삭제하시겠습니까?
            </p>
            <p className="mt-2 text-sm text-danger">
              루틴에서 사용 중인 태스크는 삭제할 수 없습니다.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="flat"
              onPress={deleteModal.onClose}
              isDisabled={deleteMutation.isPending}
            >
              취소
            </Button>
            <Button
              color="danger"
              onPress={onClickDeleteConfirm}
              isLoading={deleteMutation.isPending}
            >
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Page>
  );
});

const TasksPageClient = observer(function TasksPageClient() {
  return (
    <Suspense
      fallback={
        <Page
          top={
            <PageTitleBar
              title="태스크 목록"
              description="시스템에 등록된 태스크와 운동 detail을 관리합니다."
            />
          }
        >
          <PageSurface>
            <SectionSurface>
              <div className="h-32" />
            </SectionSurface>
          </PageSurface>
        </Page>
      }
    >
      <TasksPageInner />
    </Suspense>
  );
});

const TasksPage = dynamic(Promise.resolve(TasksPageClient), {
  ssr: false,
  loading: () => (
    <Page
      top={
        <PageTitleBar
          title="태스크 목록"
          description="시스템에 등록된 태스크와 운동 detail을 관리합니다."
        />
      }
    >
      <PageSurface>
        <SectionSurface>
          <div className="h-32" />
        </SectionSurface>
      </PageSurface>
    </Page>
  ),
});

export default TasksPage;
