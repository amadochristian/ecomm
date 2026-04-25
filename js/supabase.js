// ============================================================
// 🗄️ SUPABASE — Cliente e funções de autenticação
// ============================================================
import { CONFIG } from './config.js';

// Inicializar cliente Supabase
// ⚠️ Certifique-se que as variáveis no CONFIG estão preenchidas
let supabase = null;

export function getSupabase() {
  if (!supabase) {
    // Carrega o SDK do Supabase (incluído via CDN no HTML)
    supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  }
  return supabase;
}

// ============================================================
// 🔐 AUTENTICAÇÃO
// ============================================================

/** Cadastro de novo usuário */
export async function cadastrar({ nome, email, telefone, senha }) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password: senha,
    options: {
      data: { nome, telefone }
    }
  });
  if (error) throw error;

  // Salvar dados extras na tabela de perfis
  if (data.user) {
    await sb.from('perfis').upsert({
      id: data.user.id,
      nome,
      email,
      telefone,
      criado_em: new Date().toISOString()
    });
  }
  return data;
}

/** Login com email/senha */
export async function login({ email, senha }) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password: senha });
  if (error) throw error;
  return data;
}

/** Logout */
export async function logout() {
  const sb = getSupabase();
  await sb.auth.signOut();
  window.location.href = '/';
}

/** Buscar usuário logado */
export async function getUsuarioAtual() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  // Buscar perfil completo
  const { data: perfil } = await sb.from('perfis').select('*').eq('id', user.id).single();
  return { ...user, perfil };
}

/** Verificar se é admin */
export async function isAdmin() {
  const usuario = await getUsuarioAtual();
  if (!usuario) return false;
  return CONFIG.adminEmails.includes(usuario.email);
}

/** Exigir login — redireciona se não logado */
export async function exigirLogin(redirectUrl = null) {
  const usuario = await getUsuarioAtual();
  if (!usuario) {
    const destino = redirectUrl || window.location.href;
    window.location.href = `/pages/login.html?redirect=${encodeURIComponent(destino)}`;
    return null;
  }
  return usuario;
}

/** Exigir admin */
export async function exigirAdmin() {
  const admin = await isAdmin();
  if (!admin) {
    window.location.href = '/';
    return false;
  }
  return true;
}

/** Atualizar perfil */
export async function atualizarPerfil({ nome, telefone, cep, endereco }) {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) throw new Error('Não autenticado');

  const { error } = await sb.from('perfis').update({ nome, telefone, cep, endereco }).eq('id', user.id);
  if (error) throw error;
}

// ============================================================
// 📦 PEDIDOS
// ============================================================

/** Criar pedido */
export async function criarPedido({ itens, frete, endereco, cupom }) {
  const sb = getSupabase();
  const usuario = await getUsuarioAtual();
  if (!usuario) throw new Error('Não autenticado');

  const subtotal = itens.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const desconto = cupom ? await calcularDesconto(cupom, subtotal) : 0;
  const total = subtotal + frete.preco - desconto;

  const pedido = {
    usuario_id: usuario.id,
    usuario_nome: usuario.perfil?.nome || usuario.email,
    usuario_email: usuario.email,
    itens: JSON.stringify(itens),
    subtotal,
    frete_preco: frete.preco,
    frete_servico: frete.nome,
    desconto,
    total,
    status: 'pendente',
    endereco_entrega: JSON.stringify(endereco),
    cupom_codigo: cupom || null,
    criado_em: new Date().toISOString()
  };

  const { data, error } = await sb.from('pedidos').insert(pedido).select().single();
  if (error) throw error;

  // Log inicial
  await adicionarLog(data.id, 'Pedido criado', `Pedido #${data.id} criado com ${itens.length} item(ns). Total: R$${total.toFixed(2)}`);

  return data;
}

/** Buscar pedidos do usuário */
export async function getMeusPedidos() {
  const sb = getSupabase();
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return [];

  const { data, error } = await sb.from('pedidos')
    .select('*')
    .eq('usuario_id', user.id)
    .order('criado_em', { ascending: false });

  if (error) throw error;
  return data || [];
}

/** Buscar todos pedidos (admin) */
export async function getTodosPedidos({ status, limite = 50, pagina = 0 } = {}) {
  const sb = getSupabase();
  let query = sb.from('pedidos').select('*').order('criado_em', { ascending: false });
  if (status) query = query.eq('status', status);
  query = query.range(pagina * limite, (pagina + 1) * limite - 1);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/** Atualizar status do pedido */
export async function atualizarStatusPedido(pedidoId, status, trackingCode = null) {
  const sb = getSupabase();
  const updates = { status };
  if (trackingCode) updates.tracking_code = trackingCode;
  if (status === 'enviado') updates.enviado_em = new Date().toISOString();
  if (status === 'entregue') updates.entregue_em = new Date().toISOString();

  const { error } = await sb.from('pedidos').update(updates).eq('id', pedidoId);
  if (error) throw error;

  const labels = { pago: 'Pagamento confirmado', enviado: 'Pedido enviado', entregue: 'Pedido entregue', cancelado: 'Pedido cancelado' };
  await adicionarLog(pedidoId, labels[status] || status, trackingCode ? `Código de rastreio: ${trackingCode}` : '');
}

/** Adicionar log ao pedido */
export async function adicionarLog(pedidoId, evento, detalhes = '') {
  const sb = getSupabase();
  await sb.from('logs_pedidos').insert({
    pedido_id: pedidoId,
    evento,
    detalhes,
    criado_em: new Date().toISOString()
  });
}

/** Buscar logs de um pedido */
export async function getLogsPedido(pedidoId) {
  const sb = getSupabase();
  const { data } = await sb.from('logs_pedidos')
    .select('*')
    .eq('pedido_id', pedidoId)
    .order('criado_em', { ascending: true });
  return data || [];
}

// ============================================================
// 🛒 PRODUTOS
// ============================================================

/** Buscar todos os produtos ativos */
export async function getProdutos({ categoria, busca, limite = 20 } = {}) {
  const sb = getSupabase();
  let query = sb.from('produtos').select('*').eq('ativo', true);
  if (categoria) query = query.eq('categoria', categoria);
  if (busca) query = query.ilike('nome', `%${busca}%`);
  query = query.limit(limite);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

/** Buscar produto por slug */
export async function getProdutoPorSlug(slug) {
  const sb = getSupabase();
  const { data, error } = await sb.from('produtos').select('*').eq('slug', slug).eq('ativo', true).single();
  if (error) throw error;
  return data;
}

// ============================================================
// 🏷️ CUPONS
// ============================================================

/** Validar e calcular desconto de cupom */
export async function calcularDesconto(codigo, subtotal) {
  const sb = getSupabase();
  const { data: cupom } = await sb.from('cupons')
    .select('*')
    .eq('codigo', codigo.toUpperCase())
    .eq('ativo', true)
    .single();

  if (!cupom) throw new Error('Cupom inválido');
  if (cupom.valido_ate && new Date(cupom.valido_ate) < new Date()) throw new Error('Cupom expirado');
  if (cupom.minimo_compra && subtotal < cupom.minimo_compra) throw new Error(`Compra mínima de R$${cupom.minimo_compra} para usar este cupom`);
  if (cupom.usos_maximos && cupom.usos_atuais >= cupom.usos_maximos) throw new Error('Cupom esgotado');

  return cupom.tipo === 'percentual'
    ? (subtotal * cupom.valor) / 100
    : Math.min(cupom.valor, subtotal);
}

// ============================================================
// 📊 DASHBOARD (admin)
// ============================================================

export async function getDashboardStats() {
  const sb = getSupabase();

  const [pedidosRes, clientesRes] = await Promise.all([
    sb.from('pedidos').select('total, status, criado_em'),
    sb.from('perfis').select('id', { count: 'exact' })
  ]);

  const pedidos = pedidosRes.data || [];
  const totalVendas = pedidos.filter(p => ['pago','enviado','entregue'].includes(p.status)).reduce((a, p) => a + p.total, 0);
  const ticketMedio = pedidos.length ? totalVendas / pedidos.filter(p => p.status !== 'pendente').length : 0;

  return {
    totalPedidos: pedidos.length,
    totalVendas,
    ticketMedio: ticketMedio || 0,
    totalClientes: clientesRes.count || 0,
    pedidosPendentes: pedidos.filter(p => p.status === 'pendente').length,
    pedidosPagos: pedidos.filter(p => p.status === 'pago').length,
    pedidosEnviados: pedidos.filter(p => p.status === 'enviado').length,
  };
}
