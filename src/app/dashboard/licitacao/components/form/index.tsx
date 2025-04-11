'use client';

import { useState } from 'react';
import MaskedCurrencyInput from '../MaskedCurrencyInput'; // Ajuste o caminho se necessário


interface FormLicitacaoProps {
  numeroOrcamento: number | null;
  setNumeroOrcamento: (id: number) => void;
}


export default function FormLicitacao({ numeroOrcamento, setNumeroOrcamento }: FormLicitacaoProps) {
  const [name, setName] = useState('');
  const [valorLicitacao, setValorLicitacao] = useState('');
  const [dataAbertura, setDataAbertura] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const response = await fetch('/api/licitacao', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, valorLicitacao, dataAbertura }),
    });

    const data = await response.json();

    if (response.ok) {
      setNumeroOrcamento(data.id); // ID retornado do banco
      console.log('Licitação criada:', data);
    } else {
      console.error('Erro ao criar licitação:', data.error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-row gap-x-6 mt-6 items-end w-full'
    >
      <div className='flex flex-col flex-1'>
        <label className='mb-1 font-medium text-xl'>Numero</label>
        <input
          type='text'
          value={numeroOrcamento ?? ''}
          disabled
          placeholder='Identificador gerado automáticamente'
          className='border-2 rounded-md px-2 mb-2 h-11 w-full bg-gray-50'
        />
      </div>

      <div className='flex flex-col flex-1'>
        <label className='mb-1 font-medium text-xl'>Licitação</label>
        <input
          type='text'
          required
          placeholder='Digite nome da Cidade/Licitação'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='border-2 rounded-md px-2 mb-2 h-11 w-full'
        />
      </div>

      <div className='flex flex-col flex-1'>
        <label className='mb-1 font-medium text-xl'>Data da sessão</label>
        <input
          type='date'
          required
          value={dataAbertura}
          onChange={(e) => setDataAbertura(e.target.value)}
          className='border-2 rounded-md px-2 mb-2 h-11 w-full'
        />
      </div>

      <div className='flex flex-col flex-1'>
        <label className='mb-1 font-medium text-xl'>Valor Total Licitação</label>
        <MaskedCurrencyInput
          value={valorLicitacao}
          onChange={setValorLicitacao}
          className='mb-2'
        />
      </div>

      <div className='flex items-center justify-between'>
        <button className='text-white px-4 py-1 rounded bg-blue-900'>Iniciar</button>
      </div>
    </form>
  );
}