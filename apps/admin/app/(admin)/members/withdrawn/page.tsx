"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 탈퇴 회원 페이지
 */
export default function WithdrawnMembersPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">탈퇴 회원</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">탈퇴 회원 페이지</Text>
      </CardBody>
    </Card>
  );
}
