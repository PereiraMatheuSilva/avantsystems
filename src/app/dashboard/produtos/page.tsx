'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importe o useRouter
import { Container } from '@/components/container';
import { CadProd } from './components/sheet';
import ListProd from './components/listProd/';
import { ProdutosProps } from '@/utils/produtos';
import { FormDetail } from './components/formDetail';
import { api } from '@/lib/api'; // Importe sua função api

export default function Produtos() {
  const [produtos, setProdutos] = useState<ProdutosProps[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ProdutosProps | null>(null);
  const router = useRouter(); // Inicialize o router

  async function fetchProdutos() {
    try {
      const res = await fetch('/api/produtos');
      if (!res.ok) {
        console.error('Erro ao buscar produtos:', res.status);
        return;
      }
      const data = await res.json();
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  const handleProdutoClick = (produto: ProdutosProps) => {
    setSelectedRow(produto);
    setOpen(true);
  };

  const handleCloseDetail = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  const handleDeleteProdu = async () => {
    try {
      if (selectedRow) {
        const response = await api.delete(`/api/produtos?id=${selectedRow.id}`); // Envia o ID como   query parameter
        console.log(response.data);
        setOpen(false);
        setSelectedRow(null);
        router.refresh(); // Atualiza a página para refletir a exclusão
      } else {
        alert("Nenhum produto selecionado.");
      }
    } catch (error: any) {
      console.error("Erro ao deletar produto:", error);
      alert(`Erro ao deletar o produto: ${error.message}`);
    }
  };

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
                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b    transition-colors">
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Nome</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Fornecedor</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">NCM</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Custo</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Frete</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Imposto</th>
                  <th className="text-foreground h-10 px-2 text-left align-middle font-medium     whitespace-nowrap">Lucro</th>
                </tr>
              </thead>
              <tbody className="[&>tr:last-child]:border-0">
                {produtos.map((item) => (
                  <ListProd
                    key={item.id}
                    produtos={item}
                    onRowClick={handleProdutoClick}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedRow && (
          <FormDetail
            open={open}
            setOpen={setOpen}
            selectedRow={selectedRow}
            handleDeleteProdu={handleDeleteProdu} // Passa a função para o FormDetail
          />
        )}
      </main>
    </Container>
  );
}