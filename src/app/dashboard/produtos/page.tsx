'use client';

import { useEffect, useState } from 'react';
import { Container } from '@/components/container';
import { CadProd } from './components/sheet';
import ListProd from './components/listProd';

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);

  async function fetchProdutos() {
    const res = await fetch('/api/produtos');
    const data = await res.json();
    setProdutos(data);
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  return (
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-600'>Meus Produtos</h1>
          <CadProd onSuccess={fetchProdutos} />
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
                {produtos.map((item: any) => (
                  <ListProd key={item.id} produtos={item} />
                ))}
              </tbody>
              </table>
            </div>
          </div>
      </main>
    </Container>
  );
}
