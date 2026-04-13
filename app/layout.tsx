import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Veltis — Investir en bourse. On t'explique tout.",
  description: "La première plateforme française qui t'accompagne de zéro jusqu'à ton premier vrai investissement.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
