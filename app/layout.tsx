// app/layout.tsx - root layout shell, locale layout in app/[locale]/layout.tsx owns html/body
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
