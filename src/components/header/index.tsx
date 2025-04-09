'use client';

import Link from 'next/link';
import Image from 'next/image';
import heroImg from '@/assets/logo.png';
import { FiUser, FiLogOut, FiLoader, FiLock } from 'react-icons/fi'
import { signIn, signOut, useSession } from 'next-auth/react';


export function Header(){

  const { status, data } = useSession();

  async function handleLogin(){
    await signIn();
  }

  async function handleLogout(){
    await signOut();
  }


  return(
    <header className='w-full flex items-center px-2 py-4 bg-blue-900 h-20 shadow-sm'>
      <div className='w-full flex items-center justify-between max-w-7xl mx-auto'>
          <Link href='/'>
            <Image 
              src={heroImg}
              alt='Logo'
              width={150}
            />
          </Link>


      {status === 'loading' && (
        <button className='animate-spin'>
          <FiLoader size={26} color='#fff' />
        </button>
      )}

      {status === 'unauthenticated' && (
        <button onClick={handleLogin}>
          <FiLock size={26} color='#fff' />
        </button>
      )}


      {status === 'authenticated' && (
        <div className='flex items-baseline gap-6'>
          <Link href="/dashboard">
            <FiUser size={26} color='#FFF' />
          </Link>

          <button onClick={handleLogout}>
            <FiLogOut size={26} color='#FFF' />
          </button>
        </div>
      )}


      </div>
    </header>
  )
}