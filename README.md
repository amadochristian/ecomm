# BragShirt — E-commerce de Camisetas da Selecao Brasileira

> Template reutilizavel de e-commerce mobile-first com HTML/CSS/JS puro + Supabase + Mercado Pago + Melhor Envio + Resend

---

## Visao Geral

**BragShirt** e um e-commerce completo e escalavel construido como template reutilizavel para multiplas marcas. Focado em performance, codigo limpo e facilidade de personalizacao.

### Stack

| Camada | Tecnologia |
|--------|-----------|
| Frontend | HTML5, CSS3, JavaScript ES Modules (sem frameworks) |
| Banco de Dados | Supabase (PostgreSQL + Auth) |
| Deploy | Vercel (static + serverless functions) |
| Pagamento | Mercado Pago (checkout redirect) |
| Frete | Melhor Envio API |
| E-mail | Resend |

---

## Estrutura do Projeto

```
bragshirt/
├── index.html                  # Home page
├── vercel.json                 # Configuracao Vercel
├── package.json
├── .env.example                # Variaveis de ambiente (copiar para .env.local)
├── supabase-schema.sql         # Schema completo do banco de dados
│
├── css/
│   └── global.css              # Design system completo
│
├── js/
│   ├── config.js               # CONFIGURACOES GLOBAIS (editar aqui para reutilizar)
│   ├── supabase.js             # Cliente Supabase + todas as funcoes de dados
│   ├── carrinho.js             # Logica do carrinho (localStorage)
│   └── produtos.js             # Dados de produtos + frete + pagamento
│
├── pages/
│   ├── login.html              # Login + Cadastro
│   ├── produto.html            # Detalhe do produto com variacoes
│   ├── produtos.html           # Listagem com filtros
│   ├── carrinho.html           # Pagina do carrinho
│   ├── checkout.html           # Checkout (endereco + frete + pagamento)
│   ├── pedido-confirmado.html  # Pos-pagamento
│   ├── minha-conta.html        # Area do cliente (pedidos, perfil)
│   ├── sobre.html
│   ├── contato.html
│   ├── politica-privacidade.html
│   ├── termos-uso.html
│   └── lgpd.html
│
├── admin/
│   └── index.html              # Painel administrativo completo
│
└── api/
    ├── frete.js                # Calculo de frete via Melhor Envio
    ├── pagamento/
    │   ├── criar.js            # Criar preferencia Mercado Pago
    │   └── webhook.js          # Webhook de confirmacao de pagamento
    └── assets/                 # Logo, favicon, imagens
```

---

## Configuracao Rapida

### 1. Clonar e preparar

```bash
git clone https://github.com/seu-usuario/bragshirt.git
cd bragshirt
cp .env.example .env.local
npm install
```

### 2. Configurar o Supabase

1. Crie um projeto em https://app.supabase.com
2. Va em **SQL Editor** e execute o arquivo `supabase-schema.sql`
3. Va em **Authentication > Providers** e ative **Email**
4. Copie as chaves de `Project Settings > API` para o `.env.local`

### 3. Editar configuracoes globais

Abra `js/config.js` e edite as variaveis marcadas com `ALTERAR AQUI`:

```javascript
export const CONFIG = {
  nomeLoja: "BragShirt",         // Nome da sua loja
  corPrimaria: "#0D47A1",        // Cor principal
  corSecundaria: "#FFDF00",      // Cor de destaque
  whatsapp: "5511999999999",     // WhatsApp da loja
  email: "contato@bragshirt.com",
  supabaseUrl: "https://xxxx.supabase.co",
  supabaseAnonKey: "eyJ...",
  adminEmails: ["admin@sualojacom"],  // Emails com acesso ao admin
}
```

### 4. Configurar variaveis de ambiente (.env.local)

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...
MP_ACCESS_TOKEN=TEST-xxxx          # Mercado Pago
MELHOR_ENVIO_TOKEN=eyJ...          # Melhor Envio
RESEND_API_KEY=re_xxxx             # Resend
BASE_URL=https://sualoja.com.br
CEP_ORIGEM=12900000
```

### 5. Rodar localmente

```bash
npm run dev
# Acesse: http://localhost:3000
```

### 6. Deploy na Vercel

```bash
npm run deploy
# ou conecte o repositorio GitHub no painel da Vercel
```

**Importante**: Configure todas as variaveis de ambiente no painel da Vercel antes do deploy.

---

## Funcionalidades

### Loja
- Home com destaques, categorias e depoimentos
- Listagem de produtos com filtros por categoria e ordenacao
- Pagina de produto com galeria, variacoes (tamanho/modelo), controle de estoque
- Carrinho lateral (drawer) com contador no header
- Pagina de carrinho com edicao de quantidades

### Autenticacao
- Login com e-mail + senha via Supabase Auth
- Cadastro com nome, e-mail, telefone
- Recuperacao de senha por e-mail
- Login obrigatorio para finalizar compra

### Checkout
- Calculo de frete via Melhor Envio (com fallback de simulacao)
- Busca de endereco via ViaCEP
- Aplicacao de cupons de desconto
- Frete gratis automatico acima do valor configurado
- Redirecionamento para Mercado Pago

### Pos-venda
- Webhook do Mercado Pago atualiza status automaticamente
- E-mails automaticos via Resend (pedido criado, pago, enviado)
- Pagina "Minha Conta" com historico de pedidos e linha do tempo

### Admin (acesso restrito)
- Dashboard com KPIs: vendas totais, pedidos, ticket medio, clientes
- Grafico de status dos pedidos
- Tabela de pedidos com filtros por status
- Modal de detalhe do pedido com: itens, endereco, logs, alteracao de status
- Codigo de rastreio + botao WhatsApp para notificar cliente
- Gerenciamento de cupons (criar, desativar)
- Lista de clientes
- Visualizacao de produtos

### SEO
- Meta tags completas em todas as paginas
- Open Graph + Twitter Card
- JSON-LD estruturado na home
- Canonical URLs
- Robots meta configurados

### LGPD
- Pagina de Politica de Privacidade
- Pagina de Termos de Uso
- Pagina dedicada LGPD com direitos do usuario

---

## Como Reutilizar para Outra Marca

Para adaptar este template para outra loja, edite **apenas** `js/config.js`:

```javascript
export const CONFIG = {
  nomeLoja: "MinhaLoja",
  tagline: "Slogan da loja",
  corPrimaria: "#FF6B00",    // Nova cor primaria
  corSecundaria: "#FFF",     // Nova cor secundaria
  logo: "/assets/logo-nova.png",
  whatsapp: "5521988888888",
  email: "contato@minha-loja.com",
  adminEmails: ["admin@minha-loja.com"],
  supabaseUrl: "https://novo-projeto.supabase.co",
  supabaseAnonKey: "nova-chave",
  // ...
}
```

O tema e aplicado automaticamente via CSS custom properties em todas as paginas.

---

## Banco de Dados (Supabase)

### Tabelas criadas pelo schema SQL

| Tabela | Descricao |
|--------|-----------|
| `perfis` | Dados extras do usuario (nome, telefone, endereco) |
| `produtos` | Catalogo de produtos com variacoes e estoque |
| `pedidos` | Pedidos com status, itens, frete, pagamento |
| `logs_pedidos` | Linha do tempo de cada pedido |
| `cupons` | Codigos de desconto |

### Row Level Security (RLS)
- Usuarios so acessam os proprios dados
- Produtos e cupons tem leitura publica
- Operacoes de admin usam a `SUPABASE_SERVICE_KEY` no backend

---

## Integracao com Mercado Pago

### Fluxo de pagamento

```
Cliente -> Checkout -> /api/pagamento/criar.js
       -> Cria preferencia no MP
       -> Redireciona para MP
       -> MP processa o pagamento
       -> MP chama /api/pagamento/webhook.js
       -> Webhook atualiza status no Supabase
       -> E-mail de confirmacao enviado
       -> Cliente redirecionado para pedido-confirmado.html
```

### Configurar webhook no Mercado Pago
1. Acesse: https://www.mercadopago.com.br/developers
2. Va em **Webhooks** > **Configurar notificacoes**
3. URL: `https://sualoja.com.br/api/pagamento/webhook`
4. Eventos: `payment`

---

## Integracao com Melhor Envio

O calculo de frete esta em `/api/frete.js`. Em modo desenvolvimento, usa simulacao automatica se a API nao estiver configurada.

Para habilitar:
1. Crie conta em https://melhorenvio.com.br
2. Gere um token em **Minha Conta > Tokens**
3. Adicione ao `.env.local`

---

## Integracao com Resend

E-mails sao enviados automaticamente em:
- Pagamento aprovado (webhook do Mercado Pago)
- Status atualizado para "enviado" (pelo admin)

Para habilitar:
1. Crie conta em https://resend.com
2. Adicione e verifique seu dominio
3. Gere uma API key
4. Adicione ao `.env.local`

---

## Status Visual dos Pedidos

| Status | Cor | Descricao |
|--------|-----|-----------|
| `pendente` | Amarelo | Aguardando pagamento |
| `pago` | Azul | Pagamento confirmado |
| `enviado` | Verde | Produto despachado |
| `entregue` | Cinza | Entrega confirmada |
| `cancelado` | Vermelho | Pedido cancelado |

---

## WhatsApp — Mensagem estruturada

O painel admin gera automaticamente uma mensagem formatada para o cliente:

```
Ola [Nome], seu pedido #[ID] foi enviado!
Codigo de rastreio: [CODIGO]
Acompanhe: https://www.correios.com.br/
Obrigado por comprar na BragShirt!
```

---

## Checklist de Deploy

- [ ] Executar `supabase-schema.sql` no Supabase
- [ ] Configurar autenticacao por email no Supabase
- [ ] Preencher todas as variaveis no `.env` da Vercel
- [ ] Atualizar `js/config.js` com dados reais
- [ ] Configurar webhook do Mercado Pago
- [ ] Verificar dominio no Resend
- [ ] Testar fluxo completo em sandbox antes de ir para producao
- [ ] Desativar `melhorEnvioSandbox: false` em config.js
- [ ] Trocar `MP_ACCESS_TOKEN` de TEST para producao
- [ ] Configurar dominio personalizado na Vercel

---

## Seguranca

- Chaves de API ficam apenas nas variaveis de ambiente do servidor (nunca no frontend)
- Row Level Security (RLS) ativado em todas as tabelas do Supabase
- Headers de seguranca configurados no `vercel.json`
- Acesso ao painel admin verificado por e-mail E pelo Supabase

---

## Licenca

MIT — use, modifique e distribua livremente.

---

Feito com para a Selecao Brasileira e a Copa 2026.
