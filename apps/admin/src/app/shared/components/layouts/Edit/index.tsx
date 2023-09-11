'use client'

import { Button, Card, CardBody, CardFooter, CardHeader } from '@kimjwally/ui'
import { ButtonGroup } from '@nextui-org/react'

interface EditLayoutProps {
  children: React.ReactNode
}

export const EditLayout = (props: EditLayoutProps) => {
  const { children } = props
  return (
    <Card>
      <CardHeader>생성</CardHeader>
      <CardBody>{children}</CardBody>
      <CardFooter>
        <ButtonGroup>
          <Button variant="solid" color="primary">
            생성
          </Button>
          <Button>목록</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  )
}
