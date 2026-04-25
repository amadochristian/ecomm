// ============================================================
// 🛒 CARRINHO — Gerenciamento completo via localStorage
// ============================================================
import { CONFIG, formatarMoeda } from './config.js';

const CHAVE_CARRINHO = 'bragshirt_carrinho';

/** Buscar carrinho atual */
export function getCarrinho() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
  } catch {
    return [];
  }
}

/** Salvar carrinho */
function salvarCarrinho(itens) {
  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
  atualizarContadorHeader();
  dispatchCarrinhoAtualizado();
}

/** Adicionar item ao carrinho */
export function adicionarAoCarrinho({ id, slug, nome, preco, imagem, tamanho, modelo, quantidade = 1 }) {
  const carrinho = getCarrinho();

  // Verificar se já existe com mesmas variações
  const chave = `${id}_${tamanho}_${modelo}`;
  const existente = carrinho.find(i => i.chave === chave);

  if (existente) {
    existente.quantidade += quantidade;
  } else {
    carrinho.push({ id, slug, nome, preco, imagem, tamanho, modelo, quantidade, chave });
  }

  salvarCarrinho(carrinho);
  mostrarNotificacaoCarrinho(nome);
  return carrinho;
}

/** Remover item do carrinho */
export function removerDoCarrinho(chave) {
  const carrinho = getCarrinho().filter(i => i.chave !== chave);
  salvarCarrinho(carrinho);
  return carrinho;
}

/** Atualizar quantidade */
export function atualizarQuantidade(chave, quantidade) {
  if (quantidade <= 0) return removerDoCarrinho(chave);
  const carrinho = getCarrinho().map(i => i.chave === chave ? { ...i, quantidade } : i);
  salvarCarrinho(carrinho);
  return carrinho;
}

/** Limpar carrinho */
export function limparCarrinho() {
  localStorage.removeItem(CHAVE_CARRINHO);
  atualizarContadorHeader();
  dispatchCarrinhoAtualizado();
}

/** Calcular totais */
export function calcularTotais(frete = 0, desconto = 0) {
  const carrinho = getCarrinho();
  const subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const freteGratis = subtotal >= CONFIG.freteGratisAcima;
  const freteReal = freteGratis ? 0 : frete;
  const total = subtotal + freteReal - desconto;

  return {
    itens: carrinho,
    quantidade: carrinho.reduce((acc, i) => acc + i.quantidade, 0),
    subtotal,
    frete: freteReal,
    freteGratis,
    desconto,
    total
  };
}

/** Atualizar contador no header */
export function atualizarContadorHeader() {
  const carrinho = getCarrinho();
  const total = carrinho.reduce((acc, i) => acc + i.quantidade, 0);
  const contadores = document.querySelectorAll('.carrinho-contador');
  contadores.forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

/** Notificação visual ao adicionar */
function mostrarNotificacaoCarrinho(nome) {
  const notif = document.createElement('div');
  notif.className = 'notif-carrinho';
  notif.innerHTML = `
    <span>✅</span>
    <span><strong>${nome}</strong> adicionado!</span>
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.classList.add('visivel'), 10);
  setTimeout(() => {
    notif.classList.remove('visivel');
    setTimeout(() => notif.remove(), 300);
  }, 2500);
}

/** Evento customizado para atualizar componentes */
function dispatchCarrinhoAtualizado() {
  window.dispatchEvent(new CustomEvent('carrinhoAtualizado', { detail: getCarrinho() }));
}

/** Renderizar mini carrinho (para sidebar/drawer) */
export function renderizarMiniCarrinho(container) {
  const { itens, subtotal, quantidade, freteGratis } = calcularTotais();

  if (!itens.length) {
    container.innerHTML = `
      <div class="carrinho-vazio">
        <div class="carrinho-vazio-icon">🛒</div>
        <p>Seu carrinho está vazio</p>
        <a href="/" class="btn-primario">Explorar produtos</a>
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div class="mini-carrinho-itens">
      ${itens.map(item => `
        <div class="mini-item" data-chave="${item.chave}">
          <img src="${item.imagem}" alt="${item.nome}" loading="lazy">
          <div class="mini-item-info">
            <span class="mini-item-nome">${item.nome}</span>
            <span class="mini-item-var">${item.tamanho} • ${item.modelo}</span>
            <div class="mini-item-controles">
              <button class="qty-btn" onclick="window.carrinhoAlterarQty('${item.chave}', ${item.quantidade - 1})">−</button>
              <span>${item.quantidade}</span>
              <button class="qty-btn" onclick="window.carrinhoAlterarQty('${item.chave}', ${item.quantidade + 1})">+</button>
              <button class="remove-btn" onclick="window.carrinhoRemover('${item.chave}')">🗑️</button>
            </div>
          </div>
          <span class="mini-item-preco">${formatarMoeda(item.preco * item.quantidade)}</span>
        </div>
      `).join('')}
    </div>
    <div class="mini-carrinho-footer">
      ${freteGratis ? '<div class="frete-gratis-badge">🎉 Frete grátis!</div>' : `<div class="frete-info">Frete grátis acima de ${formatarMoeda(CONFIG.freteGratisAcima)}</div>`}
      <div class="mini-subtotal">
        <span>Subtotal (${quantidade} ${quantidade === 1 ? 'item' : 'itens'})</span>
        <strong>${formatarMoeda(subtotal)}</strong>
      </div>
      <a href="/pages/carrinho.html" class="btn-primario btn-block">Ver carrinho</a>
      <a href="/pages/checkout.html" class="btn-secundario btn-block">Finalizar compra</a>
    </div>
  `;

  // Expor funções globais para os botões inline
  window.carrinhoAlterarQty = (chave, qty) => {
    atualizarQuantidade(chave, qty);
    renderizarMiniCarrinho(container);
  };
  window.carrinhoRemover = (chave) => {
    removerDoCarrinho(chave);
    renderizarMiniCarrinho(container);
  };
}
