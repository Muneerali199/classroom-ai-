import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Select Your Role - Classroom AI',
  description: 'Choose your role to continue using Classroom AI',
}

export default function RoleSelectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}