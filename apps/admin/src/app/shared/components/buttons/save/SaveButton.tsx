import { Button } from '@kimjwally/ui'
import { ButtonProps } from '@nextui-org/react'
import React from 'react'

interface SaveButtonProps extends ButtonProps {
  onClickSave: () => void
}

export const SaveButton = (props: SaveButtonProps) => {
  const { onClickSave } = props

  const onClick = () => onClickSave()

  return (
    <Button variant="solid" onClick={onClick}>
      저장
    </Button>
  )
}
