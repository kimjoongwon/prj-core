export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <p>AuthLayout</p>
      {children}
    </div>
  )
}
