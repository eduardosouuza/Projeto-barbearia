import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">404 - Página não encontrada</h1>
      <p className="mb-6">A página que você está procurando não existe.</p>
      <Link href="/" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition">
        Voltar para a página inicial
      </Link>
    </div>
  )
} 