import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Politicker — Government Accountability',
  description: 'Track politicians\' voting records, donor influence, and integrity scores.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
          {children}
        </div>
      </body>
    </html>
  )
}