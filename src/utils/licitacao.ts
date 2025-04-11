export interface OrcamentoProps {
  produtoId: string;
  precoUnitario: string;
  quantidade: string;
  totalItem: string;
  descricao?: string;
  fornecedor?: string;
  valorUnitario?: string;
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
