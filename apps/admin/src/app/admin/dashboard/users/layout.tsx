export default function Layout(props: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <div>
      usersLayout
      {props.children}
    </div>
  )
}
