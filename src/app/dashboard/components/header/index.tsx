import { Container } from '@/components/container';
import Link from 'next/link';


export function DashboardHeader(){
  return(
    <Container>

      <header className='w-full bg-blue-900 my-4 p-3 rounded flex gap-4'>

        <Link className='text-white hover:font-bold duration-300 items-center' href='/dashboard'>
          Dashboard
        </Link>

        <Link className='text-white hover:font-bold duration-300 items-center' href='/dashboard/licitacao'>
          Licitações
        </Link>

        <Link className='text-white hover:font-bold duration-300 items-center' href='/dashboard/produtos'>
          Produtos
        </Link>

        <Link className='text-white hover:font-bold duration-300 items-center' href='/dashboard/fornecedores'>
          Fornecedores
        </Link>



      </header>
    </Container>
  )
}