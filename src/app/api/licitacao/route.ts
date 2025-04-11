
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import  prismaClient  from '@/lib/prisma';

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


