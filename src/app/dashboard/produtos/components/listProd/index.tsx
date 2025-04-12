import { ProdutosProps } from '@/utils/produtos';


export default function ListProd({ produtos }: { produtos: ProdutosProps }) {
  return (
    <tr className="data-[state=selected]:bg-muted border-b transition-colors cursor-pointer hover:bg-gray-100">
      <td className="p-2 align-middle whitespace-nowrap">{produtos.name}</td>
      <td className="p-2 align-middle whitespace-nowrap">{produtos.fornecedor.nome}</td>
      <td className="p-2 align-middle whitespace-nowrap">{produtos.ncm}</td>
      <td className="p-2 align-middle whitespace-nowrap">{produtos.price}</td>
      <td className="p-2 align-middle whitespace-nowrap">{produtos.frete}</td>
      <td className="p-2 align-middle whitespace-nowrap">{produtos.imposto}</td>
      <td className="p-2 align-middle whitespace-nowrap">{produtos.lucro}</td>
    </tr>
  )
}
