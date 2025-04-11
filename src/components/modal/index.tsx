"use client"

import { useState, useContext, useRef, MouseEvent, useEffect } from 'react'
import { ModalContext } from '@/providers/modal'
import { Produto } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export function ModalLicitacao() {
  const [valorMinimo, setValorMinimo] = useState(0)
  const [valorAtual, setValorAtual] = useState('')
  const [produtos, setProdutos] = useState<Produto[]>([])

  const { handleModalVisible, licitacao } = useContext(ModalContext)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  const lucroPercentual = 30 // <<== aqui você define o percentual de lucro desejado

  const atual = parseFloat(valorAtual.replace(',', '.')) || 0
  const lucroAtual = atual - valorMinimo
  const valorComLucro = valorMinimo + (valorMinimo * lucroPercentual / 100)
  const faltaParaLucro = valorComLucro - atual

  const lucroEhPositivo = lucroAtual >= 0
  const corFundo = lucroEhPositivo ? 'bg-green-100' : 'bg-red-100'
  const corTexto = lucroEhPositivo ? 'text-green-800' : 'text-red-800'
  const corBorda = lucroEhPositivo ? 'border-green-400' : 'border-red-400'

  const formatarMoeda = (valor: number) =>
    valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleModalVisible()
    }
  }

  useEffect(() => {
    async function fetchProdutos() {
      const res = await fetch('/api/produtos')
      const data = await res.json()
      setProdutos(data)
    }

    if (licitacao?.orcamentos?.length) {
      fetchProdutos()
    }
  }, [licitacao])

  useEffect(() => {
    if (!licitacao || !produtos.length) return

    const totalMinimo = licitacao.orcamentos.reduce((total, item) => {
      const produto = produtos.find(p => p.id === item.produtoId)
      const precoUnitario = parseFloat(item.precoUnitario ?? '0')
      const imposto = parseFloat(produto?.imposto ?? '0')
      const frete = parseFloat(produto?.frete ?? '0')
      const quantidade = item.quantidade ?? 0
      return total + (precoUnitario + imposto + frete) * Number(quantidade)
    }, 0)

    setValorMinimo(totalMinimo)
  }, [produtos, licitacao])

  async function handleLicitacaoDelete() {
    try {
      await api.delete("/api/licitacao", {
        params: {
          id: licitacao?.licitacao.id
        }
      })

      router.refresh()
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className='absolute bg-gray-900/70 w-full min-h-screen z-50' onClick={handleModalClick}>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div ref={modalRef} className='bg-white shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 p-6 rounded-2xl'>

          {/* Topo */}
          <div className='flex items-center justify-between mb-6'>
            <h1 className='font-bold text-2xl md:text-3xl text-gray-800'>Detalhes da Licitação</h1>
            <div className='flex gap-3'>
              <button className='bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm'>Salvar Licitacao</button>
              <button className='bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm' onClick={handleLicitacaoDelete}>Excluir</button>
              <button className='bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm' onClick={handleModalVisible}>Fechar</button>
            </div>
          </div>

          {/* Informações principais */}
          <div className='flex flex-wrap gap-4 mb-6'>
            <Info label="Data de Abertura" value={licitacao?.licitacao.dataAbertura ? new Date(licitacao.licitacao.dataAbertura).toLocaleDateString('pt-BR') : '—'} />
            <Info label="Nome Licitação" value={licitacao?.licitacao.name || '—'} />
            <Info label="Valor Licitação" value={formatarMoeda(Number(licitacao?.licitacao.valorLicitacao ?? 0))} />
            <Info label={`Lucro Desejado (${lucroPercentual}%)`} value={formatarMoeda(valorComLucro)} />
            <Info label="Valor Mínimo Empresa" value={formatarMoeda(valorMinimo)} />
            <div className='flex-1 min-w-[150px] bg-gray-100 p-3 rounded'>
              <label className='text-xs text-gray-500'>Valor Atual do Lance</label>
              <input
                type='number'
                value={valorAtual}
                onChange={(e) => setValorAtual(e.target.value)}
                className='mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
                placeholder='R$ 0,00'
              />
            </div>
          </div>

          {/* Tabela de Produtos */}
          <div className='overflow-x-auto mb-6'>
            <table className='w-full text-sm text-left border border-gray-200'>
              <thead className='bg-gray-100 text-gray-700'>
                <tr>
                  <th className='p-2 border'>Produto</th>
                  <th className='p-2 border'>Qtdd</th>
                  <th className='p-2 border'>Valor Unit.</th>
                  <th className='p-2 border'>Imposto</th>
                  <th className='p-2 border'>Frete</th>
                  <th className='p-2 border'>Valor Venda</th>
                </tr>
              </thead>
              <tbody>
                {licitacao?.orcamentos?.map((item, index) => {
                  const produto = produtos.find(p => p.id === item.produtoId)
                  const precoUnitario = parseFloat(item.precoUnitario ?? '0')
                  const imposto = parseFloat(produto?.imposto ?? '0')
                  const frete = parseFloat(produto?.frete ?? '0')
                  const quantidade = item.quantidade ?? 0
                  const valorVenda = (precoUnitario + imposto + frete) * Number(quantidade)

                  return (
                    <tr key={index} className='hover:bg-gray-50'>
                      <td className='p-2 border'>{produto?.name || 'Produto não encontrado'}</td>
                      <td className='p-2 border'>{quantidade}</td>
                      <td className='p-2 border'>R$ {precoUnitario.toFixed(2)}</td>
                      <td className='p-2 border'>R$ {imposto.toFixed(2)}</td>
                      <td className='p-2 border'>R$ {frete.toFixed(2)}</td>
                      <td className='p-2 border'>{formatarMoeda(valorVenda)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Lucro ou Prejuízo */}
          <div className={`${corFundo} ${corBorda} ${corTexto} px-4 py-3 rounded-lg text-center text-lg font-bold`}>
            {lucroEhPositivo ? 'Lucro Atual' : 'Prejuízo Atual'}: {formatarMoeda(lucroAtual)} <br />
            Meta de lucro: {formatarMoeda(valorComLucro)}<br />
            {faltaParaLucro > 0
              ? `Faltam ${formatarMoeda(faltaParaLucro)} para atingir a meta de lucro.`
              : 'Meta de lucro atingida ✅'}
          </div>
        </div>
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className='flex-1 min-w-[150px] bg-gray-100 p-3 rounded'>
      <p className='text-xs text-gray-500'>{label}</p>
      <p className='font-semibold text-sm'>{value}</p>
    </div>
  )
}
