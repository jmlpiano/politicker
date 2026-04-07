import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PoliticianGrader — Government Accountability',
  description: 'Track politicians\' voting records, donor influence, integrity scores, and entrenchment ratings.',
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