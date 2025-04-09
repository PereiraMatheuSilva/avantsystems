'use client'
import { SupplierProps } from '@/utils/suppliers.type';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation'

export function CardFornecedor({supplier}: {supplier: SupplierProps}){

  const router = useRouter();

  async function handleDeleteSupplier() {
    try {
      const response = await api.delete('/api/supplier',{
        params: {
          id: supplier.id
        } 
      })

      //console.log(response.data)
      router.refresh();
    } catch (err) {
      console.log(err)
    }
  }

  return(
    <article className='flex flex-col bg-gray-50 border-2 border-gray-300 p-2 rounded gap-2
    hover:scale-105 duration-300
    '>
      <h2>
        <a className='font-bold'>Nome: </a> {supplier.name}
      </h2>
      <p><a className='font-bold'>Email Representante: </a> {supplier.emailrep}</p>
      <p><a className='font-bold'>Celular Representante: </a> {supplier.phonerep}</p>


      <button className='bg-red-800 px-4 rounded text-white mt-2 self-start hover:bg-red-600 duration-300' onClick={handleDeleteSupplier}>
        Deletar
      </button>

    </article>
  )
}