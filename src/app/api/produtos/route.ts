
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import  PrismaClient  from '@/lib/prisma';

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("id");


  try {
    const produto = await PrismaClient.produto.delete({
      where:{
        id: productId as string
      }
    })

    return NextResponse.json(produto, { status: 201 });

  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: "Failed delete product" }, { status: 400 });
  }


}

//Cadastro de Produto
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { name, fornecedorId, ncm, description, status, price, frete, imposto, lucro,} = await request.json();

  try {
    // Criando o produto
    const produto = await PrismaClient.produto.create({
      data: {
        name,
        fornecedorId,
        ncm,
        price,
        description,
        status,
        frete,
        imposto,
        lucro
      },
    });

    return NextResponse.json({ message: "Produto cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao cadastrar produto:", err);
    return NextResponse.json({ error: "Failed to create new product" }, { status: 400 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  try {
    const produtos = await PrismaClient.produto.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      include: {
        fornecedor: {
          select: {
            name: true,
          },
        },
      },
      take: 10,
    });

    return NextResponse.json(produtos);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}
