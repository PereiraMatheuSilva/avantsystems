
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import  prismaClient  from '@/lib/prisma';
import { request } from 'http';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    return NextResponse.json({error: "Not authorized"}, {status: 401})
  }

  const body = await req.json();
  const { name, valorLicitacao, dataAbertura } = body;

  if (!name || !valorLicitacao || !dataAbertura) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 400 });
  }

  const novaLicitacao = await prismaClient.licitacao.create({
    data: {
      name,
      valorLicitacao,
      dataAbertura: new Date(dataAbertura),
      status: true
    }
  });

  return NextResponse.json(novaLicitacao);
}


export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if(!session || !session.user){
    return NextResponse.json({error: "Not authorized"}, {status: 401})
  } 

  const { searchParams } = new URL(req.url)
  const licitacaoId = searchParams.get("id");

  console.log(licitacaoId)
  try {
    await prismaClient.orcamentoItem.deleteMany({
      where: {
        licitacaoId: licitacaoId as string
      }
    });

    await prismaClient.licitacao.delete({
      where: {
        id: licitacaoId as string
      }
    });

    return NextResponse.json({ message: "Licitação Deletada com sucesso!" })



  } catch (err) {
    console.log(err)
  }



}