import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PrismaClient from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  try {
    const { licitacaoId, produtos } = await request.json();

    if (!licitacaoId) {
      return NextResponse.json({ error: "ID da licitação é obrigatório" }, { status: 400 });
    }

    if (!produtos || !Array.isArray(produtos)) {
      return NextResponse.json({ error: "Lista de produtos inválida" }, { status: 400 });
    }

    const orcamentosCriados = await Promise.all(
      produtos.map(async (produto: any) => {
        // Assumindo que 'produto' no frontend tem 'descricao', 'quantidade', 'fornecedor', 'valorUnitario', 'valorTotal'
        // Você precisará buscar o 'Produto' pelo nome/descrição ou outro identificador único
        const existingProduto = await PrismaClient.produto.findFirst({
          where: {
            name: produto.descricao, // Ou outro campo que identifique o produto
          },
        });

        if (!existingProduto) {
          console.warn(`Produto não encontrado: ${produto.descricao}`);
          // Decida como lidar com produtos não encontrados: pular, criar um novo, retornar erro?
          return null; // Vamos pular este item por enquanto
        }

        return PrismaClient.orcamentoItem.create({
          data: {
            licitacaoId: licitacaoId,
            produtoId: existingProduto.id,
            quantidade: String(produto.quantidade),
            precoUnitario: String(produto.valorUnitario),
            totalItem: String(produto.valorTotal),
          },
        });
      })
    );

    // Filtra os orçamentos que foram criados com sucesso (não nulos)
    const orcamentosSalvos = orcamentosCriados.filter(orcamento => orcamento !== null);

    return NextResponse.json({ message: "Orçamentos da licitação salvos com sucesso!", data: orcamentosSalvos });

  } catch (error) {
    console.error("Erro ao salvar orçamentos da licitação:", error);
    return NextResponse.json({ error: "Erro ao salvar orçamentos da licitação" }, { status: 500 });
  }
}


export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  try {
    const produtos = await PrismaClient.produto.findMany()
    return NextResponse.json(produtos);
    
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 });
  }
}
