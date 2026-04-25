// ============================================================
// 💳 API: Webhook do Mercado Pago
// Arquivo: /api/pagamento/webhook.js
// ============================================================
// Deploy: Vercel Serverless Function
// ⚠️ Configure as variáveis de ambiente no painel da Vercel

import { createClient } from '@supabase/supabase-js';

// Inicializar Supabase com chave de serviço (acesso total)
const supabase = createClient(
  process.env.SUPABASE_URL,           // ⚠️ CONFIGURAR no .env da Vercel
  process.env.SUPABASE_SERVICE_KEY,   // ⚠️ CONFIGURAR no .env da Vercel
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data } = req.body;

  // Apenas processar notificações de pagamento
  if (type !== 'payment') {
    return res.status(200).json({ ok: true });
  }

  try {
    const paymentId = data?.id;
    if (!paymentId) return res.status(400).json({ error: 'No payment ID' });

    // Buscar detalhes do pagamento no Mercado Pago
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.MP_ACCESS_TOKEN}` // ⚠️ CONFIGURAR no .env
      }
    });
    const payment = await mpRes.json();

    const pedidoId = payment.external_reference;
    if (!pedidoId) return res.status(400).json({ error: 'No order reference' });

    // Mapear status do MP para status da loja
    const statusMap = {
      'approved': 'pago',
      'pending': 'pendente',
      'in_process': 'pendente',
      'rejected': 'cancelado',
      'refunded': 'cancelado',
      'cancelled': 'cancelado',
    };
    const novoStatus = statusMap[payment.status] || 'pendente';

    // Atualizar pedido no Supabase
    const { data: pedido, error } = await supabase
      .from('pedidos')
      .update({
        status: novoStatus,
        mp_payment_id: String(paymentId),
        mp_status: payment.status,
        pago_em: novoStatus === 'pago' ? new Date().toISOString() : null,
      })
      .eq('id', pedidoId)
      .select()
      .single();

    if (error) throw error;

    // Registrar log
    await supabase.from('logs_pedidos').insert({
      pedido_id: pedidoId,
      evento: novoStatus === 'pago' ? 'Pagamento aprovado' : `Pagamento: ${payment.status}`,
      detalhes: `Mercado Pago ID: ${paymentId}`,
      criado_em: new Date().toISOString(),
    });

    // Enviar e-mail de confirmação se pago
    if (novoStatus === 'pago' && pedido) {
      await enviarEmailConfirmacao(pedido);
    }

    return res.status(200).json({ ok: true, status: novoStatus });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: error.message });
  }
}

/** Enviar e-mail de confirmação via Resend */
async function enviarEmailConfirmacao(pedido) {
  const itens = JSON.parse(pedido.itens || '[]');
  const itensHtml = itens.map(i =>
    `<tr><td>${i.nome} (${i.tamanho}/${i.modelo}) × ${i.quantidade}</td><td>R$ ${(i.preco * i.quantidade).toFixed(2)}</td></tr>`
  ).join('');

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`, // ⚠️ CONFIGURAR no .env
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BragShirt <noreply@bragshirt.com.br>',
        to: pedido.usuario_email,
        subject: `✅ Pedido #${pedido.id} confirmado — BragShirt`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="UTF-8"></head>
          <body style="font-family:sans-serif;background:#0a0a0f;color:#f0f0f0;padding:40px 20px">
            <div style="max-width:600px;margin:0 auto;background:#13131a;border-radius:16px;overflow:hidden">
              <div style="background:#0D47A1;padding:32px;text-align:center">
                <h1 style="color:#FFDF00;margin:0;font-size:2rem;letter-spacing:0.05em">BRAGSHIRT</h1>
              </div>
              <div style="padding:32px">
                <h2 style="color:#FFDF00">✅ Pedido Confirmado!</h2>
                <p>Olá <strong>${pedido.usuario_nome}</strong>,</p>
                <p>Seu pedido <strong>#${pedido.id}</strong> foi confirmado e está sendo preparado!</p>
                <table style="width:100%;border-collapse:collapse;margin:24px 0">
                  <thead>
                    <tr style="background:#1c1c28">
                      <th style="padding:12px;text-align:left">Produto</th>
                      <th style="padding:12px;text-align:right">Valor</th>
                    </tr>
                  </thead>
                  <tbody>${itensHtml}</tbody>
                  <tfoot>
                    <tr style="border-top:1px solid rgba(255,255,255,0.1)">
                      <td style="padding:12px;font-weight:bold">TOTAL</td>
                      <td style="padding:12px;font-weight:bold;color:#FFDF00;text-align:right">R$ ${pedido.total?.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
                <p style="color:rgba(240,240,240,0.6);font-size:0.875rem">Acompanhe o status do seu pedido acessando <a href="https://bragshirt.com.br/pages/minha-conta.html" style="color:#FFDF00">Minha Conta</a>.</p>
              </div>
              <div style="background:#1c1c28;padding:24px;text-align:center;font-size:0.75rem;color:rgba(240,240,240,0.4)">
                © 2026 BragShirt. Veste a Garra, Vive a Copa.
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    });
  } catch (err) {
    console.error('Erro ao enviar e-mail:', err);
    // Não lançar erro — o webhook deve retornar sucesso mesmo se o e-mail falhar
  }
}
