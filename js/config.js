// ============================================================
// ⚙️ CONFIGURAÇÕES GLOBAIS DA LOJA — EDITAR AQUI
// ============================================================
// Este arquivo centraliza TODAS as configurações da loja.
// Para reutilizar este template em outra marca, edite apenas este arquivo.

export const CONFIG = {
  // 🏷️ IDENTIDADE DA LOJA
  nomeLoja: "BragShirt",
  tagline: "Veste a Garra, Vive a Copa",
  descricao: "Camisetas oficiais e retrô da Seleção Brasileira. Qualidade premium para o torcedor apaixonado.",

  // 🎨 CORES — ALTERAR AQUI
  corPrimaria: "#0D47A1",       // Azul Brasil
  corSecundaria: "#FFDF00",     // Amarelo Brasil
  corAcento: "#009C3B",         // Verde Brasil
  corFundo: "#0a0a0f",          // Fundo escuro
  corTexto: "#f0f0f0",          // Texto claro

  // 🖼️ ASSETS — ALTERAR AQUI
  logo: "/assets/logo.png",
  logoAlt: "BragShirt Logo",
  favicon: "/assets/favicon.ico",
  ogImage: "/assets/og-image.jpg",

  // 📞 CONTATO — ALTERAR AQUI
  whatsapp: "5511999999999",
  whatsappTextoDefault: "Olá! Vim pelo site e gostaria de mais informações.",
  email: "contato@bragshirt.com",
  emailSuporte: "suporte@bragshirt.com",

  // 📍 ENDEREÇO — ALTERAR AQUI
  endereco: "Rua das Camisetas, 123 - Bragança Paulista, SP",
  cep: "12900-000",
  cidade: "Bragança Paulista",
  estado: "SP",

  // 🌐 URLs — ALTERAR AQUI
  urlSite: "https://bragshirt.com.br",
  urlAdmin: "/admin",

  // 💳 MERCADO PAGO — ALTERAR AQUI
  mercadoPagoPublicKey: "TEST-xxxx-xxxx-xxxx-xxxx", // ⚠️ ALTERAR PARA CHAVE DE PRODUÇÃO
  mercadoPagoAcessToken: "TEST-xxxx",               // ⚠️ ALTERAR NO BACKEND (.env)

  // 🚚 MELHOR ENVIO — ALTERAR AQUI
  melhorEnvioToken: "xxxx",   // ⚠️ ALTERAR NO BACKEND (.env)
  melhorEnvioSandbox: true,   // false em produção

  // 📧 RESEND — ALTERAR AQUI
  resendApiKey: "re_xxxx",    // ⚠️ ALTERAR NO BACKEND (.env)
  resendFrom: "BragShirt <noreply@bragshirt.com>",

  // 🗄️ SUPABASE — ALTERAR AQUI
  supabaseUrl: "https://xxxx.supabase.co",          // ⚠️ ALTERAR AQUI
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxx", // ⚠️ ALTERAR AQUI

  // 🔐 ADMINS — ALTERAR AQUI
  adminEmails: [
    "admin@bragshirt.com",    // ⚠️ ALTERAR AQUI
    "seu@email.com",          // ⚠️ ALTERAR AQUI
  ],

  // 🛒 CONFIGURAÇÕES DA LOJA
  moeda: "BRL",
  moedaSymbol: "R$",
  freteGratisAcima: 299.90,   // Frete grátis acima deste valor
  maxParcelas: 12,
  taxaCartao: 0,              // % adicional no cartão (0 = sem taxa)

  // 📱 REDES SOCIAIS — ALTERAR AQUI
  instagram: "https://instagram.com/bragshirt",
  facebook: "https://facebook.com/bragshirt",
  tiktok: "",

  // 🔍 SEO
  seoKeywords: "camiseta seleção brasileira, camisa copa do mundo, camiseta retrô brasil, camisa canarinho",
};

// ============================================================
// 🎨 CSS VARIABLES — geradas automaticamente a partir do CONFIG
// ============================================================
export function aplicarTema() {
  const root = document.documentElement;
  root.style.setProperty('--cor-primaria', CONFIG.corPrimaria);
  root.style.setProperty('--cor-secundaria', CONFIG.corSecundaria);
  root.style.setProperty('--cor-acento', CONFIG.corAcento);
  root.style.setProperty('--cor-fundo', CONFIG.corFundo);
  root.style.setProperty('--cor-texto', CONFIG.corTexto);
}

// ============================================================
// 💰 HELPERS DE FORMATAÇÃO
// ============================================================
export const formatarMoeda = (valor) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: CONFIG.moeda }).format(valor);

export const formatarData = (data) =>
  new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(data));
