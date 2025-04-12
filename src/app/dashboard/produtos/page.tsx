// app/produtos/page.tsx (ou onde estiver)

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
                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                  <th className="px-2 text-left font-medium">Nome</th>
                  <th className="px-2 text-left font-medium">Fornecedor</th>
                  <th className="px-2 text-left font-medium">NCM</th>
                  <th className="px-2 text-left font-medium">Custo</th>
                  <th className="px-2 text-left font-medium">Frete</th>
                  <th className="px-2 text-left font-medium">Imposto</th>
                  <th className="px-2 text-left font-medium">Lucro</th>
                </tr>
              </thead>
              <tbody>
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
