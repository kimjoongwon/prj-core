import { Button } from "../Button";
import { cn } from "@heroui/react";
import { HStack } from "../HStack";
import { useGetCurrentSpace } from "@shared/api-client";
import { LoggerUtil } from "@shared/utils";

const logger = LoggerUtil.create("[Logo]");

export interface LogoProps {
  variants: "text" | "icon";
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Logo = (props: LogoProps) => {
  const { className, onClick } = props;

  // window.location을 사용하여 /auth 경로인지 확인
  const isAuthPath = typeof window !== "undefined" && window.location.pathname.includes("/auth");

  const { data: getCurrentSpaceResponse, error, isLoading, isError } = useGetCurrentSpace();

  // /auth 경로가 아닐 때만 spaceName 사용
  const spaceName = !isAuthPath ? getCurrentSpaceResponse?.data?.ground?.name : null;

  // 에러 처리 개선 (/auth 경로가 아닐 때만)
  if (isError && error && !isAuthPath) {
    logger.error("getCurrentSpace API error:", {
      message: error.message,
      status: (error as any)?.status || "unknown",
      response: (error as any)?.response || null,
    });
  }

  // /auth 경로에서는 기본 "플레이트"만 표시
  const displayName = isAuthPath
    ? "플레이트"
    : isLoading
      ? "플레이트 X (로딩중...)"
      : spaceName
        ? `플레이트 X ${spaceName}`
        : "플레이트 X";

  return (
    <HStack className="items-center">
      {/* <Image src="/logo.png" alt="logo" width={50} height={50} /> */}
      <Button variant="light" className={cn(className, "font-bold text-2xl p-0")} onPress={onClick}>
        {displayName}
      </Button>
    </HStack>
  );
};
