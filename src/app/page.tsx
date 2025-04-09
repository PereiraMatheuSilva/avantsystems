import Image from 'next/image'
import logoAzul from '@/assets/logo_azul.png';

export default function Home(){
  return(
    <main className='flex items-center flex-col justify-center 
    min-h-[calc(100vh-80px)]'>
      <h2 className='font-medium text-3xl mb-8 text-black '>Painel de Usuário</h2>

      <Image 
        src={logoAzul}
        alt='Imagem Logo'
        width={600}
        className='max-w-sm md:max-w-xl'
      />
    </main>
  )
}