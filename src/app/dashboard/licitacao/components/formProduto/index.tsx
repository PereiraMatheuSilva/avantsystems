'use client'

import { useState } from 'react'
import MaskedCurrencyInput from '../MaskedCurrencyInput'
import { AutocompleteSuggestions } from '../useProdutoSearch/AutocompleteSuggestions'

interface ProdutoItem {
  descricao: string
  quantidade: string
  fornecedor: string
  valorUnitario: string
  valorTotal: string
}

export default function FormProduto() {
  const [itens, setItens] = useState<ProdutoItem[]>([{
    descricao: '', quantidade: '', fornecedor: '', valorUnitario: '', valorTotal: '',
  }])
  const [autocompleteIndex, setAutocompleteIndex] = useState<number | null>(null)

  const adicionarLinha = () => {
    setItens([...itens, {
      descricao: '', quantidade: '', fornecedor: '', valorUnitario: '', valorTotal: '',
    }])
  }

  const atualizarItem = (index: number, campo: keyof ProdutoItem, valor: string) => {
    const novosItens = [...itens]
    novosItens[index][campo] = valor

    if (campo === 'quantidade' || campo === 'valorUnitario') {
      const q = parseFloat(novosItens[index].quantidade.replace(',', '.')) || 0
      const v = parseFloat(novosItens[index].valorUnitario.replace(',', '.')) || 0
      novosItens[index].valorTotal = (q * v).toFixed(2).replace('.', ',')
    }

    setItens(novosItens)
  }

  const calcularTotalGeral = () => {
    return itens
      .reduce((total, item) => {
        const valor = parseFloat(item.valorTotal.replace(',', '.')) || 0
        return total + valor
      }, 0)
      .toFixed(2)
      .replace('.', ',')
  }

  return (
    <div className="space-y-4 mt-6">
      {itens.map((item, index) => (
        <form key={index} className="flex flex-row gap-x-6 items-end w-full relative">

          {/* Descrição */}
          <div className="flex flex-col flex-[2] relative">
            {index === 0 && <label className="mb-1 font-medium text-xl">Descrição Produto</label>}
            <input
              type="text"
              placeholder="Descrição Produto"
              value={item.descricao}
              onChange={(e) => atualizarItem(index, 'descricao', e.target.value)}
              className={`border-2 rounded-md px-2 ${index === 0 ? 'mb-2' : ''} h-11 w-full`}
              required
              autoComplete="off"
              onFocus={() => setAutocompleteIndex(index)}
            />

            {autocompleteIndex === index && (
              <AutocompleteSuggestions
                inputValue={item.descricao}
                onSelect={(valorSelecionado, produto) => {
                  atualizarItem(index, 'descricao', valorSelecionado)
                  atualizarItem(index, 'fornecedor', produto.fornecedor?.name || '')
                  atualizarItem(index, 'valorUnitario', produto.price)
                }}
                onClose={() => setAutocompleteIndex(null)} // fecha o autocomplete
              />
            )}
          </div>

          {/* Quantidade */}
          <div className="flex flex-col flex-[0.7]">
            {index === 0 && <label className="mb-1 font-medium text-xl">Qtdd</label>}
            <input
              type="text"
              placeholder="Quantidade"
              value={item.quantidade}
              onChange={(e) => atualizarItem(index, 'quantidade', e.target.value)}
              className={`border-2 rounded-md px-2 ${index === 0 ? 'mb-2' : ''} h-11 w-full`}
              required
            />
          </div>

          {/* Fornecedor */}
          <div className="flex flex-col flex-[0.7]">
            {index === 0 && <label className="mb-1 font-medium text-xl">Fornecedor</label>}
            <input
              type="text"
              placeholder="Fornecedor"
              value={item.fornecedor}
              onChange={(e) => atualizarItem(index, 'fornecedor', e.target.value)}
              className={`border-2 rounded-md px-2 ${index === 0 ? 'mb-2' : ''} h-11 w-full`}
              required
            />
          </div>

          {/* Valor Unitário */}
          <div className="flex flex-col flex-[1]">
            {index === 0 && <label className="mb-1 font-medium text-xl">Valor Unitário</label>}
            <MaskedCurrencyInput
              value={item.valorUnitario}
              onChange={(valor) => atualizarItem(index, 'valorUnitario', valor)}
            />
          </div>

          {/* Valor Total */}
          <div className="flex flex-col flex-[1]">
            {index === 0 && <label className="mb-1 font-medium text-xl">Valor Total</label>}
            <MaskedCurrencyInput
              value={item.valorTotal}
              onChange={() => {}}
              disabled
            />
          </div>
        </form>
      ))}

      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={adicionarLinha}
          className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-800"
        >
          + Adicionar Produto
        </button>

        <button
          type="button"
          className="bg-green-900 text-white px-4 py-2 rounded-md hover:bg-green-800"
        >
          + Salvar Licitação
        </button>

        <div className="w-60">
          <label className="block mb-1 font-medium text-xl">Total Geral</label>
          <MaskedCurrencyInput
            value={calcularTotalGeral()}
            disabled
            className="bg-amber-50"
          />
        </div>
      </div>
    </div>
  )
}