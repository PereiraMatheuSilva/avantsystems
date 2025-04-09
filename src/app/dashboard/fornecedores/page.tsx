import {Container} from '@/components/container';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { CardFornecedor } from './components/card';
import prismaClient from '@/lib/prisma';

import Link from 'next/link';

export default async function Licitacao(){
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    redirect("/")
  }

  const suppliers = await prismaClient.fornecedor.findMany({
    where:{
      status: true
    }
  })

  return(
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-600'>Meus Fornecedores</h1>

          <Link href="/dashboard/fornecedores/new" className='bg-blue-900 text-white px-4 py-1
          rounded '>
            Novo Fornecedor
          </Link>

        </div>


        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-6'>
          
          {suppliers.map(supplier => (
            <CardFornecedor supplier={supplier} key={supplier.id}/>
          ))}

        </section>


      </main>
    </Container>
  )
}