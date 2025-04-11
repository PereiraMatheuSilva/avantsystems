
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prismaClient from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);


  if(!session || !session.user){
    return NextResponse.json({error: "Not authorized"}, {status: 401})
  }

  const { name, representante, emailrep, phonerep } = await request.json();

  try {
    await prismaClient.fornecedor.create({
      data:{
        name,
        representante,
        emailrep: emailrep ? emailrep : "",
        phonerep: phonerep ? phonerep : ""
      }
    })


    return NextResponse.json({ messagem: 'Fornecedor cadastrado com Sucesso!' })

  } catch (err) {
    return NextResponse.json({error: "Failed create new Supplier"}, {status: 400})    
  }

}

export async function DELETE(request:Request) {
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    return NextResponse.json({error: "Not authorized"}, {status: 401})
  }

  const { searchParams } = new URL(request.url);

  const fornId = searchParams.get("id");
  
  if(!fornId){
    return NextResponse.json({error: "Failed delete customer"}, {status: 400})
  }


  try {
    await prismaClient.fornecedor.delete({
      where:{
        id: fornId
      }
    })


    return NextResponse.json({ message: "Fornecedor Deletado." })

  } catch (error) {
    console.log(error)
    return NextResponse.json({error: "Failed delete customer"}, {status: 400})
  }






}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    return NextResponse.json({error: "Not authorized"}, {status: 401})
  }
 
  try {
   const fornId = await prismaClient.fornecedor.findMany();   

   return NextResponse.json(fornId)

  } catch (error) {
    console.log(error)
    return NextResponse.json({error: "Failed get fornecedor"}, {status: 400})
  }
}