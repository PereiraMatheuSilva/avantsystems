import { Container } from '@/components/container';
import { CadProd } from './components/sheet';
import { Produto, columns } from './components/tableProd/columns';
import { DataTable } from './components/tableProd/data-table';
import prismaClient from '@/lib/prisma';


async function getData(): Promise<Produto[]> {
  const produtos = await prismaClient.produto.findMany({
    include: {
      fornecedor: true, // Certifique-se de que a relação existe no Prisma
    },
  });

  return produtos.map(produto => ({
    id: produto.id,
    name: produto.name,
    fornecedor: {
      id: produto.fornecedor.id,
      nome: produto.fornecedor.name,
    },
    fornecedorId: produto.fornecedorId,
    ncm: produto.ncm,
    price: produto.price
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
        }).format(Number(produto.price))
      : 'R$ 0,00',
    imposto: produto.price
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
        }).format(Number(produto.imposto))
      : 'R$ 0,00',
    frete: produto.price
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
        }).format(Number(produto.frete))
      : 'R$ 0,00',
    lucro: produto.price
      ? new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
        }).format(Number(produto.lucro))
      : 'R$ 0,00',
    status: produto.status,
    createdAt: produto.createdAt.toISOString(),
    updatedAt: produto.updatedAt.toISOString(),
  }));
}


export default async function Produtos(){
  const data = await getData()

 return(
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-600'>Meus Produtos</h1>

          <CadProd />
        </div>


        <section className='min-w-full my-2'>
          
          <DataTable columns={columns} data={data} />

        </section>


      </main>
    </Container>
  )
}