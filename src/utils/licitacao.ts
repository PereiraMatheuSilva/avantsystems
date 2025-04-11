export interface OrcamentoProps {
  produtoId: string;
  precoUnitario: string;
  descricao: string;
  quantidade: string;
  fornecedor: string;
  valorUnitario: string;
  totalItem: string;
}

export interface LicitacaoProps {
  id: string;
  name: string | null;
  status: boolean;
  valorLicitacao: string | null;
  dataAbertura: Date | null;
}

export interface LicitacaoInfo {
  licitacao: LicitacaoProps;
  orcamentos: OrcamentoProps[];
}
