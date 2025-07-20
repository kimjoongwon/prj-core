import { observer } from "mobx-react-lite";
import { ElementBuilder as ElementBuilderInterface } from "@shared/types";
import { ComponentManager } from "../../../../index";
import { usePage } from "../../../provider";
import { InputValidationBuilder } from "../InputValidationBuilder/InputValidation";
import { addToast } from "@heroui/react";
import { v4 } from "uuid";
import { useEffect } from "react";

interface ElementBuilderProps {
  elementBuilder: ElementBuilderInterface;
  data?: (unknown & { id: string })[];
}

export const ElementBuilder = observer((props: ElementBuilderProps) => {
  const page = usePage();
  const state = page.state;
  const { elementBuilder } = props;

  // 에러 처리 및 토스트 알림
  useEffect(() => {
    // 1. elementBuilder가 null 또는 undefined인 경우
    if (!elementBuilder) {
      addToast({
        title: "ElementBuilder 오류",
        description: "elementBuilder가 정의되지 않았습니다.",
        color: "danger",
      });
      return;
    }

    // 2. elementBuilder.name이 없는 경우
    if (!elementBuilder.name) {
      addToast({
        title: "ElementBuilder 오류",
        description: "Element name이 정의되지 않았습니다.",
        color: "danger",
      });
      return;
    }

    // 3. ComponentManager가 없는 경우
    if (!ComponentManager) {
      addToast({
        title: "ComponentManager 오류",
        description: "ComponentManager가 초기화되지 않았습니다.",
        color: "danger",
      });
      return;
    }

    // 4. 해당 컴포넌트가 ComponentManager에 등록되지 않은 경우
    if (!ComponentManager?.[elementBuilder.name]) {
      addToast({
        title: "컴포넌트 등록 오류",
        description: `'${elementBuilder.name}' 컴포넌트가 ComponentManager에 등록되지 않았습니다.`,
        color: "danger",
      });
      return;
    }
  }, [elementBuilder]);

  // 에러 상황에 대한 조기 리턴
  if (!elementBuilder) {
    return <div className="text-red-500">ElementBuilder가 정의되지 않았습니다.</div>;
  }

  if (!elementBuilder.name) {
    return <div className="text-red-500">Element name이 정의되지 않았습니다.</div>;
  }

  if (!ComponentManager) {
    return <div className="text-red-500">ComponentManager가 초기화되지 않았습니다.</div>;
  }

  const Component = ComponentManager?.[elementBuilder.name];

  if (!Component) {
    return <div className="text-red-500">'{elementBuilder.name}' 컴포넌트를 찾을 수 없습니다.</div>;
  }

  const renderElement = (element: ElementBuilderInterface) => {
    try {
      // 5. 자식 요소 렌더링 중 에러 처리
      if (!element) {
        console.warn("Empty element found in children array");
        return null;
      }

      return <ElementBuilder key={v4()} elementBuilder={element} />;
    } catch (error) {
      console.error("Error rendering child element:", error);
      addToast({
        title: "자식 요소 렌더링 오류",
        description: `자식 요소 렌더링 중 오류가 발생했습니다: ${
          error instanceof Error ? error.message : "알 수 없는 오류"
        }`,
        color: "danger",
      });
      return <div className="text-red-500">자식 요소 렌더링 오류</div>;
    }
  };

  try {
    // 6. 컴포넌트 렌더링 중 에러 처리
    const isReadOnly = state.type === "detail";

    return (
      <InputValidationBuilder validation={elementBuilder.validation}>
        <Component
          key={v4()}
          state={state}
          path={elementBuilder?.path}
          isReadOnly={isReadOnly}
          {...elementBuilder.props}
        >
          {elementBuilder.props?.children || elementBuilder?.children?.map(renderElement)}
        </Component>
      </InputValidationBuilder>
    );
  } catch (error) {
    console.error("Error rendering component:", error);

    // 7. 컴포넌트 렌더링 실패에 대한 상세 에러 메시지
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";

    addToast({
      title: "컴포넌트 렌더링 오류",
      description: `'${elementBuilder.name}' 컴포넌트 렌더링 중 오류가 발생했습니다: ${errorMessage}`,
      color: "danger",
    });

    return (
      <div className="text-red-500 p-4 border border-red-300 rounded">
        <h4 className="font-bold">컴포넌트 렌더링 오류</h4>
        <p>컴포넌트: {elementBuilder.name}</p>
        <p>오류: {errorMessage}</p>
      </div>
    );
  }
});
