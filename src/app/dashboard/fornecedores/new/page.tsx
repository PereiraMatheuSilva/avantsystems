import { Container } from '@/components/container';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { NewFornecedorForm } from '../components/form';
import Link from 'next/link';

export default async function NewFornecedor(){
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    redirect("/")
  }

  return(

    <Container>
      <main className='flex flex-col mt-9 mb-2'>
        <div className='flex items-center gap-3'>
          <Link href='/dashboard/fornecedores/' className='bg-blue-900 px-4 py-1 text-white rounded'>
            Voltar
          </Link>

          <h1 className='text-3xl font-bold text-gray-600'>Cadastrar Fornecedor</h1>
        </div>

        <NewFornecedorForm />

      </main>

    </Container>
  )
}