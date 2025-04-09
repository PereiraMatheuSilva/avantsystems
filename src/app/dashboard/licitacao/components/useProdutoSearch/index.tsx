import { useEffect, useState } from 'react'

interface Fornecedor {
  id: string
  name: string
  
}

interface Produto {
  id: string
  name: string
  description: string
  fornecedorId: string
  fornecedor: Fornecedor
  price: string
}


export default function useProdutoSearch(query: string) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) return

    const timeout = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/produtos?q=${query}`)
        const data = await res.json()
        setProdutos(data)
      } catch (err) {
        console.error('Erro ao buscar produtos:', err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [query])

  return { produtos, loading }
}
