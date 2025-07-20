import { Button } from "../Button";
import { cn } from "@heroui/react";
import { HStack } from "../HStack";

export interface LogoProps {
  variants: "text" | "icon";
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Logo = (props: LogoProps) => {
  const { className, onClick } = props;

  // window.location을 사용하여 /auth 경로인지 확인
  const _isAuthPath = typeof window !== "undefined" && window.location.pathname.includes("/auth");

  // /auth 경로에서는 기본 "플레이트"만 표시

  return (
    <HStack className="items-center">
      {/* <Image src="/logo.png" alt="logo" width={50} height={50} /> */}
      <Button variant="light" className={cn(className, "font-bold text-2xl p-0")} onPress={onClick}>
        플레이트
      </Button>
    </HStack>
  );
};
