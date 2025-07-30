import { cn } from "@heroui/react";
import { Button } from "../Button";
import { HStack } from "../HStack";

export interface LogoProps {
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const Logo = (props: LogoProps) => {
  const { className, onClick } = props;

  return (
    <HStack className="items-center">
      <Button
        variant="light"
        className={cn(className, "font-bold text-2xl p-0")}
        onPress={onClick}
      >
        플레이트
      </Button>
    </HStack>
  );
};
