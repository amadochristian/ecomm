// ============================================================
// 📦 PRODUTOS FICTÍCIOS — Dados para demonstração
// ============================================================
// Em produção, estes dados vêm do Supabase (tabela 'produtos')
// Substitua por chamadas reais da API após configurar o banco

export const PRODUTOS_MOCK = [
  {
    id: 1,
    slug: "camisa-selecao-brasileira-2026-torcedor",
    nome: "Camisa Seleção Brasileira 2026 — Torcedor",
    descricao: "A camisa oficial da Seleção Brasileira para a Copa 2026. Tecido leve, respirável e com sublimação de alta qualidade. Perfeita para torcer com estilo.",
    preco: 189.90,
    preco_antigo: 249.90,
    categoria: "selecao",
    imagens: ["/assets/produtos/camisa-2026-1.jpg", "/assets/produtos/camisa-2026-2.jpg"],
    tamanhos: ["PP", "P", "M", "G", "GG", "XGG"],
    modelos: ["Torcedor", "Jogador"],
    estoque: { "PP_Torcedor": 5, "P_Torcedor": 12, "M_Torcedor": 20, "G_Torcedor": 18, "GG_Torcedor": 8, "XGG_Torcedor": 3, "P_Jogador": 6, "M_Jogador": 10, "G_Jogador": 9 },
    destaque: true,
    ativo: true,
    tags: ["copa2026", "selecao", "lancamento"],
    peso: 350, // gramas
    dimensoes: { comprimento: 30, altura: 5, largura: 25 }
  },
  {
    id: 2,
    slug: "camisa-retro-selecao-1970",
    nome: "Camisa Retrô Brasil 1970 — Copa do Mundo",
    descricao: "Reviva a era de ouro do futebol brasileiro! A camisa da conquista do tricampeonato. Tecido 100% algodão com bordado artesanal.",
    preco: 219.90,
    preco_antigo: null,
    categoria: "retro",
    imagens: ["/assets/produtos/retro-1970-1.jpg"],
    tamanhos: ["P", "M", "G", "GG"],
    modelos: ["Retrô Clássico", "Retrô Premium"],
    estoque: { "P_Retrô Clássico": 4, "M_Retrô Clássico": 7, "G_Retrô Clássico": 5, "GG_Retrô Clássico": 2 },
    destaque: true,
    ativo: true,
    tags: ["retro", "1970", "tricampeonato"],
    peso: 400,
    dimensoes: { comprimento: 32, altura: 5, largura: 26 }
  },
  {
    id: 3,
    slug: "camisa-selecao-brasileira-2002-retro",
    nome: "Camisa Retrô Brasil 2002 — Pentacampeonato",
    descricao: "A camisa do penta! 2002, Japão/Coreia, Ronaldo, Ronaldinho e a maior conquista do futebol brasileiro.",
    preco: 199.90,
    preco_antigo: 239.90,
    categoria: "retro",
    imagens: ["/assets/produtos/retro-2002-1.jpg"],
    tamanhos: ["P", "M", "G", "GG", "XGG"],
    modelos: ["Torcedor", "Jogador", "Retrô Premium"],
    estoque: { "M_Torcedor": 15, "G_Torcedor": 12, "M_Jogador": 8, "G_Jogador": 6 },
    destaque: false,
    ativo: true,
    tags: ["retro", "2002", "penta"],
    peso: 380,
    dimensoes: { comprimento: 31, altura: 5, largura: 25 }
  },
  {
    id: 4,
    slug: "camisa-goleiro-brasil-2026",
    nome: "Camisa Goleiro Seleção Brasileira 2026",
    descricao: "A camisa oficial do goleiro da Seleção para 2026. Design moderno em laranja com detalhes em verde.",
    preco: 189.90,
    preco_antigo: null,
    categoria: "selecao",
    imagens: ["/assets/produtos/goleiro-2026-1.jpg"],
    tamanhos: ["P", "M", "G", "GG"],
    modelos: ["Torcedor", "Jogador"],
    estoque: { "M_Torcedor": 8, "G_Torcedor": 9, "GG_Torcedor": 4 },
    destaque: false,
    ativo: true,
    tags: ["copa2026", "goleiro", "laranja"],
    peso: 350,
    dimensoes: { comprimento: 30, altura: 5, largura: 25 }
  },
  {
    id: 5,
    slug: "kit-infantil-selecao-2026",
    nome: "Kit Infantil Seleção Brasileira 2026",
    descricao: "Camisa + shorts oficiais para os pequenos torcedores. Qualidade premium, confortável e resistente.",
    preco: 159.90,
    preco_antigo: 199.90,
    categoria: "infantil",
    imagens: ["/assets/produtos/kit-infantil-1.jpg"],
    tamanhos: ["2", "4", "6", "8", "10", "12"],
    modelos: ["Torcedor"],
    estoque: { "4_Torcedor": 5, "6_Torcedor": 8, "8_Torcedor": 10, "10_Torcedor": 7 },
    destaque: true,
    ativo: true,
    tags: ["infantil", "kit", "copa2026"],
    peso: 300,
    dimensoes: { comprimento: 25, altura: 5, largura: 20 }
  },
  {
    id: 6,
    slug: "camisa-away-selecao-2026-azul",
    nome: "Camisa Away Seleção Brasileira 2026 — Azul",
    descricao: "A camisa alternativa azul da Seleção para 2026. Design elegante para as partidas fora de casa.",
    preco: 189.90,
    preco_antigo: null,
    categoria: "selecao",
    imagens: ["/assets/produtos/away-2026-1.jpg"],
    tamanhos: ["PP", "P", "M", "G", "GG", "XGG"],
    modelos: ["Torcedor", "Jogador"],
    estoque: { "M_Torcedor": 14, "G_Torcedor": 11, "GG_Torcedor": 6 },
    destaque: false,
    ativo: true,
    tags: ["copa2026", "away", "azul"],
    peso: 350,
    dimensoes: { comprimento: 30, altura: 5, largura: 25 }
  }
];

// ============================================================
// 🚚 FRETE — Integração com Melhor Envio
// ============================================================

/**
 * Calcular frete via API Melhor Envio
 * ⚠️ Em produção, esta chamada deve ser feita via backend (Vercel API Route)
 * para proteger o token
 */
export async function calcularFrete({ cep, itens }) {
  try {
    const peso = itens.reduce((acc, item) => acc + ((item.peso || 350) * item.quantidade), 0) / 1000; // kg

    // Chamar a API route do backend
    const res = await fetch('/api/frete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cep_destino: cep, peso, valor_declarado: itens.reduce((a, i) => a + i.preco * i.quantidade, 0) })
    });

    if (!res.ok) throw new Error('Erro ao calcular frete');
    const data = await res.json();
    return data.opcoes || [];

  } catch (error) {
    console.warn('Frete API indisponível, usando simulação:', error);
    // Simulação para desenvolvimento — REMOVER EM PRODUÇÃO
    return simularFrete(cep);
  }
}

/** Simulação de frete para desenvolvimento */
function simularFrete(cep) {
  const regiao = cep.substring(0, 2);
  const base = ['01','02','03','04','05','06','07','08','09'].includes(regiao) ? 15 : 25;

  return [
    { id: 1, nome: "PAC", empresa: "Correios", preco: base, prazo: 7, logo: "📦" },
    { id: 2, nome: "SEDEX", empresa: "Correios", preco: base + 20, prazo: 2, logo: "⚡" },
    { id: 3, nome: "Jadlog .Package", empresa: "Jadlog", preco: base + 5, prazo: 5, logo: "🚚" },
  ];
}

// ============================================================
// 💳 PAGAMENTO — Mercado Pago
// ============================================================

/**
 * Criar preferência de pagamento no Mercado Pago
 * ⚠️ Esta função chama o backend (Vercel API Route)
 * O access token fica apenas no servidor
 */
export async function criarPreferenciaPagamento({ pedido, usuario }) {
  const itens = JSON.parse(pedido.itens || '[]');

  const res = await fetch('/api/pagamento/criar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pedido_id: pedido.id,
      items: itens.map(item => ({
        title: `${item.nome} (${item.tamanho} / ${item.modelo})`,
        quantity: item.quantidade,
        unit_price: item.preco,
        currency_id: 'BRL',
      })),
      payer: {
        name: usuario.perfil?.nome || '',
        email: usuario.email,
      },
      back_urls: {
        success: `${window.location.origin}/pages/pedido-confirmado.html?id=${pedido.id}`,
        failure: `${window.location.origin}/pages/checkout.html?erro=pagamento`,
        pending: `${window.location.origin}/pages/pedido-confirmado.html?id=${pedido.id}&pendente=true`,
      },
      auto_approve: true,
      external_reference: String(pedido.id),
      shipments: { cost: pedido.frete_preco },
    })
  });

  if (!res.ok) throw new Error('Erro ao criar preferência de pagamento');
  const data = await res.json();
  return data; // Retorna { init_point, sandbox_init_point, id }
}
