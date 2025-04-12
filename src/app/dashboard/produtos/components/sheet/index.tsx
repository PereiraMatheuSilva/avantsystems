'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Input } from '@/components/input'
import { api } from '@/lib/api'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MaskedCurrencyInput from '@/app/dashboard/licitacao/components/MaskedCurrencyInput'

const schema = z.object({
  name: z.string().min(1, 'Campo Obrigatório'),
  fornecedorId: z.string().min(1, 'Campo Obrigatório'),
  frete: z.string().min(1, 'Campo Obrigatório'),
  impostos: z.string().min(1, 'Campo Obrigatório'),
  ncm: z.string().min(1, 'Campo Obrigatório').max(8),
  price: z.string().min(1, 'Campo Obrigatório'),
  lucro: z.string().min(1, 'Campo Obrigatório'),
})

type FormData = z.infer<typeof schema>

export function CadProd({ onSuccess }: { onSuccess: () => void }) {
  const [fornecedores, setFornecedores] = useState<any[]>([])
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      price: '',
      impostos: '',
      frete: '',
      lucro: '',
    },
  })

  useEffect(() => {
    async function fetchFornecedores() {
      try {
        const response = await api.get("/api/supplier")

        if (Array.isArray(response.data)) {
          setFornecedores(response.data)
        } else {
          console.error("Dados recebidos não são um array:", response.data)
          setFornecedores([]) // previne o erro do .map
        }
      } catch (error) {
        console.error("Erro ao buscar fornecedores:", error)
      }
    }

    fetchFornecedores()
  }, [])

  const price = watch('price') || '0'
  const impostos = watch('impostos') || '0'
  const frete = watch('frete') || '0'
  const lucro = watch('lucro') || '0'

  const calcularValorVenda = () => {
    const valor =
      parseFloat(price.replace(',', '.')) +
      parseFloat(impostos.replace(',', '.')) +
      parseFloat(frete.replace(',', '.')) +
      parseFloat(lucro.replace(',', '.'))

    return `R$ ${valor.toFixed(2).replace('.', ',')}`
  }

  const handleRegisterProduct = async (data: FormData) => {
    
    const payload = {
      name: data.name,
      fornecedorId: data.fornecedorId,
      ncm: data.ncm,
      price: (data.price),
      imposto: (data.impostos),
      frete: (data.frete),
      lucro: (data.lucro),
    };

    try {
      const response = await api.post("/api/produtos", payload)
      console.log("Produto cadastrado:", response.data)
      router.refresh() // Atualiza a página
      onSuccess() // <- Aqui está a chamada da função passada por props
      
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error)
    }
  }

  return (
    <Sheet>
      <SheetTrigger className="bg-blue-900 text-white px-4 py-2 rounded">
        Novo Produto
      </SheetTrigger>

      <SheetContent className="max-h-screen overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Cadastrar Novo Produto</SheetTitle>
        </SheetHeader>

        <form
          className="grid grid-cols-1 sm:grid-cols-1 gap-4 mt-4 p-4"
          onSubmit={handleSubmit(handleRegisterProduct)}
        >
          <div>
            <label htmlFor="name">Nome do Produto</label>
            <Input
              type="text"
              name="name"
              placeholder="Ex: Câmera bullet com 120 m de IR"
              error={errors.name?.message}
              register={register}
            />
          </div>

          <div>
            <label htmlFor="fornecedorId">Fornecedor</label>
            <select
              {...register("fornecedorId")}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="" disabled hidden>Selecione um fornecedor</option>
              {fornecedores.map((f: any) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
            {errors.fornecedorId && <p className="text-red-500 text-sm">{errors.fornecedorId.message}</p>}
          </div>

          <div>
            <label htmlFor="ncm">NCM</label>
            <Input
              type="text"
              name='ncm'
              placeholder="Ex: 6205.20.00"
              error={errors.ncm?.message}
              register={register}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label>Custo</label>
              <MaskedCurrencyInput
                value={price}
                onChange={(val) => setValue('price', val)}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
            </div>

            <div>
              <label>Impostos</label>
              <MaskedCurrencyInput
                value={impostos}
                onChange={(val) => setValue('impostos', val)}
              />
              {errors.impostos && <p className="text-red-500 text-sm">{errors.impostos.message}</p>}
            </div>

            <div>
              <label>Frete</label>
              <MaskedCurrencyInput
                value={frete}
                onChange={(val) => setValue('frete', val)}
              />
              {errors.frete && <p className="text-red-500 text-sm">{errors.frete.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label>Lucro</label>
              <MaskedCurrencyInput
                value={lucro}
                onChange={(val) => setValue('lucro', val)}
              />
              {errors.lucro && <p className="text-red-500 text-sm">{errors.lucro.message}</p>}
            </div>

            <div>
              <label>Valor Total</label>
              <MaskedCurrencyInput
                value={calcularValorVenda()}
                disabled
                className="bg-green-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-900 text-white px-4 py-2 w-full rounded hover:bg-blue-800 transition duration-300"
          >
            Cadastrar Produto
          </button>
        </form>
      </SheetContent>
    </Sheet>
  )
}
