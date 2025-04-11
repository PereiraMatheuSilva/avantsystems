"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

import { useState } from "react"
import { Produto } from "./columns"
import { useForm } from 'react-hook-form';
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation'


interface DataTableProps {
  columns: ColumnDef<Produto>[]
  data: Produto[]
}

export function DataTable({ columns, data }: DataTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const schema = z.object({
    name: z.string().min(1, 'Campo Obrigatório'),         
    fornecedorId: z.string().min(1, 'Campo Obrigatório'),  
    description: z.string().min(1, 'Campo Obrigatório'),   
    ncm: z.string().min(1, 'Campo Obrigatório').max(8),
    price: z.string().min(1, 'Campo Obrigatório')                 
  })

  type FormData = z.infer<typeof schema>

  const {register, handleSubmit, formState: { errors }} = useForm<FormData>({
    resolver: zodResolver(schema)
  })
  
  const router = useRouter();

  async function handleDeleteProdu() {
      try {
        if (selectedRow) {
          const response = await api.delete('/api/produtos', {
            params:{
              id:`${selectedRow.id}`
            }
          })
          console.log(response.data);
          setOpen(false)
          router.refresh()

        } else {
          alert("Nenhum produto selecionado.");
        }
    } catch (err) {
      console.log(err)
    }
  }


  // Estados para controlar o Sheet e os dados do produto selecionado
  const [open, setOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState<Produto | null>(null)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() => {
                  setSelectedRow(row.original) // Salva os dados da linha clicada
                  setOpen(true) // Abre o Sheet
                }}
                className="cursor-pointer hover:bg-gray-100"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Sheet que abre ao clicar na linha */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalhes do Produto</SheetTitle>
          </SheetHeader>

          {selectedRow && (
            <form className="space-y-4 mt-4 p-4">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
                <input className='w-full border-1 rounded-md h-11 px-2' type="text" name={selectedRow.name} defaultValue ={selectedRow.name}/>
              </div>
                
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Fornecedor</label>
                <input className='w-full border-1 rounded-md h-11 px-2' type="text" name={selectedRow.fornecedor.nome} defaultValue ={selectedRow.fornecedor.nome}/>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">NCM</label>
                <input className='w-full border-1 rounded-md h-11 px-2' type="text" 
                name={selectedRow.ncm as string} 
                defaultValue ={selectedRow.ncm as string}/>
              </div>


              <div className="mb-4">
                <label className="text-sm font-medium text-gray-700">Preço</label>
                {/* @ts-ignore */}
                <input className='w-full border-1 rounded-md h-11 px-2' type="text"name={selectedRow.price} 
                /* @ts-ignore */
                defaultValue ={selectedRow.price}
                />
              </div>


              <div className="flex justify-between gap-x-4">
                <button type="button" className="bg-red-400 text-white px-4 py-2 w-full rounded  hover:bg-red-500 transition duration-300" onClick={handleDeleteProdu}>
                  Excluir Produto
                </button>
              </div>


            </form>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
