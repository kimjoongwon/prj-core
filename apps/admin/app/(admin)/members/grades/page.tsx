"use client";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, CardHeader } from "@heroui/react";

/**
 * 회원 등급 관리 페이지
 */
export default function MemberGradesPage() {
  return (
    <Card>
      <CardHeader>
        <Text variant="h4">회원 등급 관리</Text>
      </CardHeader>
      <CardBody>
        <Text variant="body1">회원 등급 관리 페이지</Text>
      </CardBody>
    </Card>
  );
}
