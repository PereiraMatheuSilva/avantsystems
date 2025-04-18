'use client'
import { Container } from '@/components/container';
import FormLicitacao from './components/form'
import FormProduto from './components/formProduto/'
import { useState } from 'react';

export default function Licitacao(){
  const [numeroOrcamento, setNumeroOrcamento] = useState<number | null>(null)

 return(
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-600'>Licitações</h1>

        </div>

        
        <FormLicitacao 
          numeroOrcamento={numeroOrcamento}
          setNumeroOrcamento={setNumeroOrcamento}
        />


        
        <h1 className='text-3xl font-bold text-gray-600 mt-6'>Produtos</h1>

        {numeroOrcamento && (
          <FormProduto licitacaoId={numeroOrcamento}/>
        )}


      </main>
    </Container>
  )
}