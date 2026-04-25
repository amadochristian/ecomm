// ============================================================
// 🚚 API: Calcular Frete — Melhor Envio
// Arquivo: /api/frete.js
// ============================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { cep_destino, peso, valor_declarado } = req.body;

  // CEP de origem da loja — ALTERAR AQUI
  const CEP_ORIGEM = process.env.CEP_ORIGEM || '12900000'; // ⚠️ ALTERAR no .env

  try {
    const response = await fetch('https://www.melhorenvio.com.br/api/v2/me/shipment/calculate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.MELHOR_ENVIO_TOKEN}`, // ⚠️ ALTERAR no .env
        'User-Agent': 'BragShirt/1.0 (contato@bragshirt.com.br)',
      },
      body: JSON.stringify({
        from: { postal_code: CEP_ORIGEM.replace(/\D/g, '') },
        to: { postal_code: cep_destino.replace(/\D/g, '') },
        package: {
          height: 5,
          width: 25,
          length: 30,
          weight: peso || 0.35,
        },
        options: {
          insurance_value: valor_declarado || 0,
          receipt: false,
          own_hand: false,
        },
        services: '1,2,3,4,7,8', // PAC, SEDEX, Jadlog etc
      }),
    });

    if (!response.ok) throw new Error('Melhor Envio indisponível');
    const data = await response.json();

    // Filtrar apenas serviços com price disponível
    const opcoes = data
      .filter(s => s.price && !s.error)
      .map(s => ({
        id: s.id,
        nome: s.name,
        empresa: s.company?.name || '',
        preco: parseFloat(s.price),
        prazo: s.delivery_time,
        logo: s.company?.name?.includes('Correios') ? '📬' : '🚚',
      }))
      .sort((a, b) => a.preco - b.preco);

    return res.status(200).json({ opcoes });

  } catch (error) {
    console.error('Frete erro:', error);

    // Fallback com estimativas se API falhar
    const cepNum = parseInt(cep_destino.replace(/\D/g, ''));
    const base = (cepNum >= 1000000 && cepNum <= 9999999) ? 18 : 28; // SP = mais barato
    return res.status(200).json({
      opcoes: [
        { id: 1, nome: 'PAC', empresa: 'Correios', preco: base, prazo: 7, logo: '📬' },
        { id: 2, nome: 'SEDEX', empresa: 'Correios', preco: base + 22, prazo: 2, logo: '⚡' },
        { id: 3, nome: '.Package', empresa: 'Jadlog', preco: base + 7, prazo: 5, logo: '🚚' },
      ]
    });
  }
}


// ============================================================
// 📧 API: Enviar E-mail — Resend
// Arquivo: /api/email/enviar.js (uso interno)
// ============================================================

export async function enviarEmail({ para, assunto, html }) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, // ⚠️ ALTERAR no .env
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'BragShirt <noreply@bragshirt.com.br>', // ⚠️ ALTERAR domínio verificado no Resend
      to: para,
      subject: assunto,
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(`Resend error: ${err.message}`);
  }

  return await response.json();
}

// Templates de e-mail
export const templates = {
  pedidoCriado: (pedido) => ({
    assunto: `📦 Pedido #${pedido.id} recebido — BragShirt`,
    html: `<p>Olá <strong>${pedido.usuario_nome}</strong>,</p><p>Seu pedido #${pedido.id} foi recebido! Total: R$${pedido.total?.toFixed(2)}</p>`
  }),

  pedidoEnviado: (pedido) => ({
    assunto: `🚚 Pedido #${pedido.id} foi enviado — BragShirt`,
    html: `<p>Olá <strong>${pedido.usuario_nome}</strong>,</p><p>Seu pedido foi enviado!${pedido.tracking_code ? ` Rastreio: <strong>${pedido.tracking_code}</strong>` : ''}</p>`
  }),

  pedidoEntregue: (pedido) => ({
    assunto: `✅ Pedido #${pedido.id} entregue — BragShirt`,
    html: `<p>Olá <strong>${pedido.usuario_nome}</strong>,</p><p>Seu pedido foi entregue! Obrigado pela compra. 🇧🇷</p>`
  }),
};
