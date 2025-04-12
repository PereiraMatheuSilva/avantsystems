import { ProdutosProps } from '@/utils/produtos';

const formatCurrency = (value?: string | number): string => {
  let numberValue: number | undefined;

  if (typeof value === 'string') {
    numberValue = parseFloat(value);
  } else if (typeof value === 'number') {
    numberValue = value;
  }

  if (numberValue === undefined || numberValue === null) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue);
};

export default function ListProd({ produtos }: { produtos: ProdutosProps }) {
  return (
    <tr className="data-[state=selected]:bg-muted border-b transition-colors cursor-pointer hover:bg-gray-100">
      <td className="p-2 align-middle whitespace-nowrap">{produtos.name}</td>
      <td className="p-2 align-middle whitespace-nowrap">{produtos.fornecedor.nome}</td>
      <td className="p-2 align-middle whitespace-nowrap">{produtos.ncm}</td>
      <td className="p-2 align-middle whitespace-nowrap">{formatCurrency(produtos.price)}</td>
      <td className="p-2 align-middle whitespace-nowrap">{formatCurrency(produtos.frete)}</td>
      <td className="p-2 align-middle whitespace-nowrap">{formatCurrency(produtos.imposto)}</td>
      <td className="p-2 align-middle whitespace-nowrap">{formatCurrency(produtos.lucro)}</td>
    </tr>
  );
}