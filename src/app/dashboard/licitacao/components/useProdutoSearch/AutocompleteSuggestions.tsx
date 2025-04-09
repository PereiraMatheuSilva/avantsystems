'use client'

import useProdutoSearch from '@/app/dashboard/licitacao/components/useProdutoSearch/'

interface Props {
  inputValue: string
  onSelect: (value: string, produto: any) => void
  onClose: () => void // nova prop
}

export function AutocompleteSuggestions({ inputValue, onSelect, onClose }: Props) {
  const { produtos, loading } = useProdutoSearch(inputValue)

  if (!produtos.length && !loading) return null

  return (
    <ul className="absolute top-full z-10 bg-white border mt-1 rounded-md shadow w-full max-h-48 overflow-y-auto">
      {loading ? (
        <li className="p-2 text-gray-500">Carregando...</li>
      ) : (
        produtos.map((produto) => (
          <li
            key={produto.id}
            onClick={() => {
              onSelect(produto.name, produto)
              onClose() // fecha o autocomplete
            }}
            className="p-2 hover:bg-gray-100 cursor-pointer"
          >
            <div className="font-medium">{produto.name}</div>
            <div className="text-sm text-gray-500">
              Fornecedor: {produto.fornecedor?.name || 'Não informado'} – R$ {produto.price}
            </div>
          </li>
        ))
      )}
    </ul>
  )
}
