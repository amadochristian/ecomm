// ============================================================
// 💳 API: Criar Preferência de Pagamento — Mercado Pago
// Arquivo: /api/pagamento/criar.js
// ============================================================

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { pedido_id, items, payer, back_urls, external_reference, shipments } = req.body;

  try {
    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}`, // ⚠️ CONFIGURAR no .env Vercel
      },
      body: JSON.stringify({
        items,
        payer,
        back_urls,
        auto_approve: true,
        external_reference,
        shipments: { cost: shipments?.cost || 0 },
        notification_url: `${process.env.BASE_URL}/api/pagamento/webhook`, // ⚠️ CONFIGURAR no .env
        statement_descriptor: 'BRAGSHIRT',
        expires: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.message || 'Erro ao criar preferência');
    }

    const data = await response.json();
    return res.status(200).json({
      id: data.id,
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });

  } catch (error) {
    console.error('Pagamento erro:', error);
    return res.status(500).json({ error: error.message });
  }
}
