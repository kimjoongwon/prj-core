interface EditLayoutProps {
  children: React.ReactNode
}

export const EditLayout = (props: EditLayoutProps) => {
  const { children } = props

  return <div className="flex flex-col items-center space-y-4">{children}</div>
}
