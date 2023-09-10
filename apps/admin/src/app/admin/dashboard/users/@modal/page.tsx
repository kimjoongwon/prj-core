'use client'

import { Modal, ModalBody, ModalContent } from '@nextui-org/react'
import React, { useState } from 'react'

export default function Page() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <Modal isOpen={isOpen} onClick={() => setIsOpen(true)}>
      <ModalBody>
        <ModalContent>hi!!</ModalContent>
      </ModalBody>
    </Modal>
  )
}
