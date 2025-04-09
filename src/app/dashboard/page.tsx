import { Container } from '@/components/container';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { TicketItem } from '@/app/dashboard/components/ticket';

export default async function Dashboard(){
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    redirect("/")
  }

  return(
    <Container>
     <main className='mt-9 mb-2'>
      <div className='mb-6'>
        <h1 className='text-3xl font-bold text-gray-600'>Dashboard</h1>
      </div>

      <table className='min-w-full my-2'>
        <thead>
          <tr>
            <th className='font-medium text-left pl-2'>CLIENTE</th>
            <th className='font-medium text-left'>DATA</th>
            <th className='font-medium text-left'>STATUS</th>
            <th className='font-medium text-left'>#</th>
          </tr>
        </thead>
        <tbody>
          <TicketItem />
          <TicketItem />
          <TicketItem />
        </tbody>

      </table>




     </main>



    </Container>
  )
}