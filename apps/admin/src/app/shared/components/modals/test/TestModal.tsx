import { observable } from 'mobx'
import React from 'react'

export const state = observable({
  open: false,
})

export default function TestModal() {
  return <div>TestModal</div>
}
