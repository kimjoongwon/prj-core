"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 회원 목록 페이지
 */
export default function MembersPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">회원 목록</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">회원 목록이 여기에 표시됩니다.</Text>
      </CardBody>
    </Card>
  );
}
