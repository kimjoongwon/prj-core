import { get, merge } from "lodash-es";
import { addToast } from "@heroui/react";
import { APIManager } from "@shared/api-client";
import { Mutation } from "@shared/types";
import { LoggerUtil } from "@shared/utils";

// 🎯 Debug logger utility for useMutation
const logger = LoggerUtil.create("[useMutation]");

// 🚨 Toast notification utility
const showToast = {
  success: (title: string, description?: string) => {
    addToast({
      title: `✅ ${title}`,
      description,
      color: "success",
    });
  },
  error: (title: string, description?: string) => {
    addToast({
      title: `❌ ${title}`,
      description,
      color: "danger",
    });
  },
  warning: (title: string, description?: string) => {
    addToast({
      title: `⚠️ ${title}`,
      description,
      color: "warning",
    });
  },
  info: (title: string, description?: string) => {
    addToast({
      title: `ℹ️ ${title}`,
      description,
      color: "primary",
    });
  },
};

/**
 * 🔧 Mutation 처리를 위한 유틸리티 함수
 *
 * @param mutation - Mutation 설정 객체
 * @param pageState - 페이지 상태 객체
 * @returns 처리된 API 인자 배열과 요청 바디
 */
export const processMutation = (
  mutation: Mutation,
  pageState: any,
): {
  apiArgs: unknown[];
  requestBody: any;
  pathParamValues: Record<string, any>;
} => {
  logger.info("🚀 Processing mutation", {
    mutationName: mutation.name,
    hasPathParams: !!mutation.pathParams,
    hasData: !!mutation.data,
    pageStateExists: !!pageState,
  });

  try {
    const apiArgs: unknown[] = [];
    const pathParamValues: Record<string, any> = {};

    // 🛣️ 1. pathParams 처리 - pageState에서 값 추출
    if (mutation.pathParams) {
      logger.debug("🛣️ Processing pathParams", {
        pathParams: mutation.pathParams,
        pageStateKeys: pageState ? Object.keys(pageState) : "no pageState",
        fullPageState: pageState,
      });

      Object.keys(mutation.pathParams).forEach((paramKey) => {
        const statePath = mutation.pathParams![paramKey];

        // pageState에서 값 추출
        const value = pageState ? get(pageState, statePath) : undefined;

        logger.debug(`🎯 PathParam ${paramKey} -> ${statePath}`, {
          statePath,
          finalValue: value,
          pageStateExists: !!pageState,
          valueType: typeof value,
        });

        if (value === undefined) {
          logger.warning(`🔍 PathParam value not found for ${paramKey} -> ${statePath}`, {
            availablePageStateKeys: pageState ? Object.keys(pageState) : "no pageState",
            fullPageState: pageState,
          });
        }

        pathParamValues[paramKey] = value;
        apiArgs.push(value);
      });

      logger.success("🛣️ PathParams processed", {
        paramCount: Object.keys(mutation.pathParams).length,
        values: pathParamValues,
      });
    }

    // 📦 2. data 처리 - PageState.params에서 값을 추출하여 form.inputs에 병합
    const extractedData: Record<string, any> = {};

    if (mutation.data) {
      logger.debug("📦 Processing data extraction", mutation.data);

      Object.keys(mutation.data).forEach((targetKey) => {
        const sourcePath = mutation.data![targetKey];

        // PageState에서 값 추출
        const value = pageState ? get(pageState, sourcePath) : undefined;

        if (value !== undefined) {
          extractedData[targetKey] = value;
          logger.debug(`📊 Data extracted: ${targetKey} <- ${sourcePath}`, {
            value,
          });
        } else {
          logger.warning(`📊 Data extraction failed: ${targetKey} <- ${sourcePath}`, {
            sourcePath,
            pageStateExists: !!pageState,
          });
        }
      });

      logger.success("📦 Data extraction completed", {
        extractedKeys: Object.keys(extractedData),
        extractedData,
      });
    }

    // 🔗 3. 요청 바디 구성 - form.inputs + extractedData 병합
    let requestBody: any = {};

    try {
      // form.inputs에서 기본 데이터 가져오기 (고정)
      const formInputs = pageState?.form?.inputs || {};
      logger.debug("📝 Form inputs retrieved", {
        hasFormInputs: Object.keys(formInputs).length > 0,
        formKeys: Object.keys(formInputs),
      });

      // 우선순위: formInputs < extractedData
      requestBody = merge({}, formInputs, extractedData);

      logger.success("🔗 Request body assembled", {
        finalBodyKeys: Object.keys(requestBody),
        sources: {
          fromFormInputs: Object.keys(formInputs).length,
          fromExtractedData: Object.keys(extractedData).length,
        },
      });
    } catch (bodyError: any) {
      logger.error("💥 Failed to assemble request body", bodyError);
      showToast.error("요청 데이터 구성 실패", "요청 바디를 구성하는 중 오류가 발생했습니다.");
      throw bodyError;
    }

    // 📤 4. API 인자에 요청 바디 추가 (pathParams 다음에 추가)
    if (Object.keys(requestBody).length > 0) {
      apiArgs.push(requestBody);
      logger.debug("📤 Request body added to API args");
    }

    logger.success("🏁 Mutation processing completed", {
      apiArgsCount: apiArgs.length,
      requestBodyKeys: Object.keys(requestBody),
      pathParamCount: Object.keys(pathParamValues).length,
    });

    return {
      apiArgs,
      requestBody,
      pathParamValues,
    };
  } catch (error: any) {
    logger.error("💥 Mutation processing failed", error);
    showToast.error(
      "Mutation 처리 실패",
      error instanceof Error ? error.message : "알 수 없는 오류",
    );
    throw error;
  }
};

/**
 * 🚀 Mutation 실행 함수
 *
 * @param mutation - Mutation 설정 객체
 * @param pageState - 페이지 상태 객체
 * @returns API 응답 결과
 */
export const executeMutation = async (mutation: Mutation, pageState: any): Promise<any> => {
  logger.info("🎬 Starting mutation execution", {
    mutationName: mutation.name,
  });

  try {
    // 🔍 API 함수 확인
    const apiFunction = APIManager[mutation.name as keyof typeof APIManager];

    if (!apiFunction) {
      const errorMsg = `API 함수를 찾을 수 없습니다: ${mutation.name}`;
      logger.error("🔍 API function not found", {
        mutationName: mutation.name,
        availableFunctions: Object.keys(APIManager),
      });
      showToast.error("API 함수 오류", errorMsg);
      throw new Error(errorMsg);
    }

    logger.success("🔍 API function found", { mutationName: mutation.name });

    // 🔧 Mutation 처리 (pageState만 사용)
    const { apiArgs, requestBody, pathParamValues } = processMutation(mutation, pageState);

    // 🚀 API 호출
    logger.info("🚀 Executing API call", {
      functionName: mutation.name,
      argsCount: apiArgs.length,
      bodyKeys: Object.keys(requestBody),
    });

    const response = await (apiFunction as Function).apply(null, apiArgs);

    logger.success("🎉 Mutation executed successfully", {
      responseType: typeof response,
      hasData: !!response?.data,
    });

    // ✅ 성공 토스트 (선택적)
    if (response?.data?.message) {
      showToast.success("작업 완료", response.data.message);
    }

    return response;
  } catch (error: any) {
    logger.error("💥 Mutation execution failed", error);

    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    showToast.error("작업 실패", `작업을 수행하는 중 오류가 발생했습니다: ${errorMessage}`);

    throw error;
  }
};
