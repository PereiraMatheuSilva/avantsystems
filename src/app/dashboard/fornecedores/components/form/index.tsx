'use client'

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/input';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';

const schema = z.object({
  name_fornecedor: z.string().min(1, "O campo nome é obrigatório"),
  representante: z.string().min(1, "O campo representante é obrigatório"),
  email_representante: z.string().email("Digite um email válido").min(1, "O email é obrigatório"),
  phone: z.string().refine( (value) => { 
    return /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || /^\d{2}\s\d{9}$/.test(value) || /^\d{11}$/.test(value)
  }, {
    message: "O numero de telefone deve estar (DD)999999999"
  } )


})

type FormData = z.infer<typeof schema>

export function NewFornecedorForm(){
  const { register, handleSubmit, formState: {errors} } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const router = useRouter();

  async function handleRegisterFornecedor(data: FormData){
    await api.post('/api/supplier', {
      name: data.name_fornecedor,
      representante: data.representante,
      emailrep: data.email_representante,
      phonerep: data.phone,
    })

    router.refresh();
    router.replace('/dashboard/fornecedores')
  }

  return(
    <form className='flex flex-col mt-6' onSubmit={handleSubmit(handleRegisterFornecedor)}>

      <div className='flex gap-2 my-4'>
        <div className='flex-1'>
        <label className='mb-1 text-lg font-medium'>Nome Fornecedor</label>
        <Input 
          type='text'
          name='name_fornecedor'
          placeholder='Digite o nome do Fornecedor'
          error={errors.name_fornecedor?.message}
          register={register}
        />
        </div>
        <div className='flex-1'>
        <label className='mb-1 text-lg font-medium'>Nome Representante</label>
        <Input 
          type='text'
          name='representante'
          placeholder='Digite o nome do Representante'
          error={errors.representante?.message}
          register={register}
        />
        </div>
      </div>

      <div className='flex gap-2 my-4'>
        <div className='flex-1'>
        <label className='mb-1 text-lg font-medium'>Email do Representante</label>
        <Input 
          type='text'
          name='email_representante'
          placeholder='Digite o e-mail do Representante'
          error={errors.email_representante?.message}
          register={register}
        />
        </div>
        <div className='flex-1'>
        <label className='mb-1 text-lg font-medium'>Contato do Representante</label>
        <Input 
          type='number'
          name='phone'
          placeholder='Exemplo (DD) 9XXXX-XXXX'
          error={errors.phone?.message}
          register={register}
        />
        </div>
      </div>

      <button 
        type='submit'
        className='bg-blue-900 my-4 px-2 h-11 rounded text-white font-bold hover:bg-blue-800 transition 3s'
        >
        Cadastrar
      </button>

    </form>
  )
}