"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Produto = {
  id: string;
  name: string;
  fornecedor: {
    id: string;
    nome: string; // Assumindo que o fornecedor tem um campo 'nome'
  };
  fornecedorId: string;
  ncm: string | null;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Produto>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  {
    accessorKey: "fornecedor.nome", // Acessando o nome do fornecedor
    header: "Fornecedor",
  },
  {
    accessorKey: "ncm",
    header: "NCM",
  },
  {
    accessorKey: "price",
    header: "Custo",
  },
  {
    accessorKey: "frete",
    header: "Frete",
  },
  {
    accessorKey: "imposto",
    header: "Imposto",
  },
  {
    accessorKey: "lucro",
    header: "Lucro",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => row.getValue("status") ? "Ativo" : "Inativo", // Renderizando como "Ativo" ou "Inativo"
  },
];