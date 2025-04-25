import type { Viewport } from "next"

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#121212",
}

export default function TesteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
} 