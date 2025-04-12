export interface ProdutosProps{
  id: string;
  name: string;
  fornecedor: {
      id: string;
      name: string;
  };
  fornecedorId: string;
  ncm: string | null;
  price: string;
  imposto: string;
  frete: string;
  lucro: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}
