'use client'

import {
  Button,
  Checkbox,
  DataGrid,
  Input,
  RadioGroup,
  Switch,
} from '@kimjwally/ui'
import { Spacer } from '@nextui-org/react'
import { useLocalObservable } from 'mobx-react-lite'
import Link from 'next/link'
export default function Page() {
  const state = useLocalObservable(() => ({
    isChecked: false,
  }))

  return (
    <div>
      <p className="text-xl">뭔데</p>
      <Button color="primary">Button</Button>
      <Spacer />
      <Button color="secondary">Button</Button>
      <Spacer />
      <Button color="success">Button</Button>
      <Spacer />
      <Input />
      <Spacer />
      <DataGrid data={[]} columns={[]} />
      <Spacer />
      <Checkbox state={state} path="isChecked" />
      <Spacer />
      <Switch />
      <Spacer />
      <RadioGroup />
      <Link href={'/dashboard'}>
        <button>이동</button>
      </Link>
    </div>
  )
}
