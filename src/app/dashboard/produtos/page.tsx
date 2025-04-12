import { Container } from '@/components/container';
import { CadProd } from './components/sheet';
import prismaClient from '@/lib/prisma';
import ListProd from './components/listProd';
import { ProdutosProps } from '@/utils/produtos';

interface ProductsTicket{
  produtosItem: ProdutosProps
}


async function getData(){
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


export default async function Produtos({produtosItem}: ProductsTicket){
  const data = await getData()

  const produtos = await prismaClient.produto.findMany();
  console.log(produtos)

 return(
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-600'>Meus Produtos</h1>

          <CadProd />
        </div>


        <div className="rounded-md border mt-6">
          <div className="relative w-full overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&>tr]:border-b">
                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b    transition-colors">
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Nome</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Fornecedor</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">NCM</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Custo</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Frete</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Imposto</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Lucro</th>
                </tr>
              </thead>
              <tbody className="[&>tr:last-child]:border-0">

                {data.map(item => {// Adicione isso para verificar a estrutura de `item`
                  return (
                    <ListProd key={item.id} produtos={item} />
                  );
                })}


              </tbody>
            </table>
          </div>
        </div>







      </main>
    </Container>
  )
}