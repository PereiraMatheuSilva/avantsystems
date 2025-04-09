import { Container } from '@/components/container';
import FormLicitacao from './components/form'
import FormProduto from './components/formProduto/'
 
export default async function Licitacao(){

 return(
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-600'>Licitações</h1>

        </div>

        
        <FormLicitacao />


        
        <h1 className='text-3xl font-bold text-gray-600 mt-6'>Produtos</h1>

        <FormProduto />


      </main>
    </Container>
  )
}