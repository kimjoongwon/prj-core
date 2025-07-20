import { Input, Button } from "@heroui/react";
import { VStack, Logo, Spacer, Text } from "@shared/frontend";
import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const LoginRouteComponent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "plate@gmail.com",
    password: "rkdmf12!@",
  });

  const handleLogin = () => {
    // Simple validation
    if (!formData.email || !formData.password) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    
    // Navigate to tenant select
    navigate({ to: "/admin/auth/login/tenant-select" });
  };

  return (
    <>
      <VStack className="space-y-4 max-w-md mx-auto mt-16">
        <Logo variants="primary" />
        <Spacer size={20} />
        <Text variant="h1" className="text-center text-2xl font-bold mb-6">
          로그인
        </Text>
        <Input
          label="이메일"
          type="email"
          variant="bordered"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
        <Input
          label="비밀번호"
          type="password"
          variant="bordered"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        />
        <Spacer size={2} />
        <Button
          color="primary"
          size="lg"
          variant="solid"
          className="w-full"
          onPress={handleLogin}
        >
          로그인
        </Button>
      </VStack>
      <Outlet />
    </>
  );
};

export const Route = createFileRoute("/admin/auth/login")({
  component: LoginRouteComponent,
});
