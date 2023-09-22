import { Spacer } from '@nextui-org/react'

export default function Layout(props: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col items-center pt-10">
      {props.children}
    </div>
  )
}
