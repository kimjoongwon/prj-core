'use client'

import React from 'react'
import { Modal, ModalHeader } from '@nextui-org/react'
import { state } from '../../modals/Test'
import { observer } from 'mobx-react-lite'

interface ModalProviderProps {
  children: React.ReactNode
}

export const ModalProvider = observer((props: ModalProviderProps) => {
  return (
    <>
      <div>{props.children}</div>
      <Modal isOpen={state.open}>
        <ModalHeader>Header</ModalHeader>
      </Modal>
    </>
  )
})
