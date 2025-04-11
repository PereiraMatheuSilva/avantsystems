"use client"

import { useState, useContext, useRef, MouseEvent, useEffect} from 'react'
import { ModalContext } from '@/providers/modal';
import { Produto } from '@prisma/client'


export function ModalLicitacao() {
  const [valorMinimo, setValorMinimo] = useState('')
  const [valorAtual, setValorAtual] = useState('')
  const [produtos, setProdutos] = useState<Produto[]>([])

  const { handleModalVisible, licitacao } = useContext(ModalContext);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Converte os valores para float e faz o cálculo do lucro
  const minimo = parseFloat(valorMinimo) || 0
  const atual = parseFloat(valorAtual) || 0
  const lucro = atual - minimo

  // Formata para moeda brasileira
  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  // Define a cor com base no lucro
  const lucroEhPositivo = lucro >= 0
  const corFundo = lucroEhPositivo ? 'bg-green-100' : 'bg-red-100'
  const corTexto = lucroEhPositivo ? 'text-green-800' : 'text-red-800'
  const corBorda = lucroEhPositivo ? 'border-green-400' : 'border-red-400'

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    if(modalRef.current && !modalRef.current.contains(e.target as Node)){
      handleModalVisible();
    }
  }

  useEffect(() => {
    async function fetchProdutos() {
      const res = await fetch('/api/produtos') // ou qualquer endpoint
      const data = await res.json()
      setProdutos(data)
    }

    if (licitacao?.orcamentos?.length) {
      fetchProdutos()
    }
  }, [licitacao])
  
  return (
    <div className='absolute bg-gray-900/70 w-full min-h-screen z-50' onClick={handleModalClick}>
      <div className='absolute inset-0 flex items-center justify-center'>
        <div ref={modalRef} className='bg-white shadow-2xl w-11/12 md:w-3/4 lg:w-2/3 p-6 rounded-2xl'>

          {/* Topo */}
          <div className='flex items-center justify-between mb-6'>
            <h1 className='font-bold text-2xl md:text-3xl text-gray-800'>Detalhes da Licitação</h1>
            <div className='flex gap-3'>
              <button className='bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg  text-sm'>Mudar Status</button>
              <button className='bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg  text-sm'>PDF</button>
              <button className='bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm'   onClick={handleModalVisible}>Fechar</button>
            </div>
          </div>

          {/* Escopo 1 - Info rápida */}
          <div className='flex flex-wrap gap-4 mb-6'>
            <div className='flex-1 min-w-[150px] bg-gray-100 p-3 rounded'>
              <p className='text-xs text-gray-500'>Data de Abertura</p>
              <p className='font-semibold text-sm'>
                {licitacao?.licitacao.dataAbertura 
                  ? new Date(licitacao.licitacao.dataAbertura).toLocaleDateString('pt-BR') 
                  : '—'}
              </p>
            </div>

            <div className='flex-1 min-w-[150px] bg-gray-100 p-3 rounded'>
              <p className='text-xs text-gray-500'>Nome Licitação</p>
              <p className='font-semibold text-sm'>{licitacao?.licitacao.name}</p>
            </div>

            <div className='flex-1 min-w-[150px] bg-gray-100 p-3 rounded'>
              <label className='text-xs text-gray-500'>Valor Máximo</label>
              <input 
                type='text'
                value={licitacao?.licitacao.valorLicitacao 
                  ? Number(
                      licitacao.licitacao.valorLicitacao
                        .toString()
                        .replace('R$', '')
                        .replace(/\./g, '')
                        .replace(',', '.')
                        .trim()
                    ).toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }) 
                  : ''
                }
                readOnly
                className='mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm bg-gray-100 text-gray-700'
              />
            </div>


            {/* Input: Valor Mínimo Empresa */}
            <div className='flex-1 min-w-[150px] bg-gray-100 p-3 rounded'>
              {/* Acumulador de vendas */}
              <div>
                <label className='text-xs text-gray-500'>Valor Mínimo Empresa</label>
                <div className='mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm  bg-gray-100'>
                  {licitacao?.orcamentos?.reduce((total, item) => {
                    const produto = produtos.find(p => p.id === item.produtoId)
                    const precoUnitario = parseFloat(item.precoUnitario ?? '0')
                    const imposto = parseFloat(produto?.imposto ?? '0')
                    const frete = parseFloat(produto?.frete ?? '0')
                    const quantidade = item.quantidade ?? 0
                    return total + (precoUnitario + imposto + frete) * Number(quantidade)
                  }, 0).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })}
                </div>
              </div>
            </div>

            {/* Input: Valor Atual do Lance */}
            <div className='flex-1 min-w-[150px] bg-gray-100 p-3 rounded'>
              <label className='text-xs text-gray-500'>Valor Atual do Lance</label>
              <input 
                type='number'
                value={valorAtual}
                onChange={(e) => setValorAtual(e.target.value)}
                className='mt-1 w-full border border-gray-300 rounded px-2 py-1 text-sm   focus:outline-none focus:ring-2 focus:ring-blue-400'
                placeholder='R$ 0,00'
              />
            </div>
          </div>

          {/* Escopo 2 - Tabela de produtos */}
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
                
                  const formatarMoeda = (valor: number) =>
                    valor.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    })
                  
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

          {/* Escopo 3 - Lucro / Despesa */}
          <div className={`${corFundo} ${corBorda} ${corTexto} px-4 py-3 rounded-lg text-center   text-lg font-bold`}>
            {lucroEhPositivo ? 'Lucro Atual' : 'Prejuízo Atual'}: {formatarMoeda(lucro)}
          </div>
        </div>
      </div>
    </div>
  )

}
