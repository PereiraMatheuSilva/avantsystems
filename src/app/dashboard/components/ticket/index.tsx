'use client'
import { FiFile } from 'react-icons/fi'
import { ModalContext } from '@/providers/modal';
import { useContext } from 'react';
import { LicitacaoInfo } from '@/utils/licitacao';


export function TicketItem({ licitacao, orcamentos }: LicitacaoInfo) {

  const { handleModalVisible, setDetailLicitacao } = useContext(ModalContext)

  function handleOpenModal(){
    handleModalVisible();
    setDetailLicitacao({
      licitacao: licitacao,
      orcamentos: orcamentos
    })
  }


  return(
    <>
      <tr className='border-b-2 border-b-slate-200 h-16 last:border-b-0
      bg-slate-50 hover:bg-slate-100 duration-300'>
        <td className='text-left pl-1'>{licitacao.name}</td>
        <td className='text-left'>{licitacao.dataAbertura ? licitacao.dataAbertura.toLocaleDateString() : 'Sem data'}</td>
        <td className='text-left'>
          {Number(licitacao.valorLicitacao).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          })}
        </td>
        <td className="text-left">
          <span
            className={`px-2 py-1 rounded text-white ${
              licitacao.status ? 'bg-green-800' : 'bg-red-600'
            }`}
          >
            {licitacao.status ? 'ABERTO' : 'FECHADO'}
          </span>
        </td>

        <td className='text-left'>
          <button onClick={handleOpenModal}>
            <FiFile size={24} color='#3b82f6' />
          </button>
        </td>

      </tr>
    </>
  )
}