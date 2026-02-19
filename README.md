<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## United Club – Backend (Plataforma de Afiliados Gamificada)

Backend em NestJS + TypeScript, Prisma, **MongoDB Atlas**, JWT, comissões multinível, jornada de níveis, pagamentos e notificações.

### Pré-requisitos

- Node.js 18+
- MongoDB Atlas (ou outro MongoDB com replica set)
- npm ou yarn

### Setup

```bash
npm install --legacy-peer-deps
cp .env.example .env
# Edite .env: DATABASE_URL (MongoDB Atlas), JWT_SECRET, JWT_REFRESH_SECRET
npx prisma generate
npx prisma db push
npm run prisma:seed
npm run build
npm run start:dev
```

- **API:** `http://localhost:3000`
- **Swagger:** `http://localhost:3000/api/docs`

### Variáveis de ambiente (.env)

- `DATABASE_URL` – MongoDB (ex.: `mongodb+srv://user:pass@cluster.mongodb.net/dbname?retryWrites=true&w=majority`)
- `JWT_SECRET` / `JWT_EXPIRES_IN` – Access token
- `JWT_REFRESH_SECRET` / `JWT_REFRESH_EXPIRES_IN` – Refresh token
- `PORT` (opcional, default 3000; no Render é definido automaticamente)
- `CORS_ORIGIN` – Origens permitidas para o frontend (separadas por vírgula)

### Configuração com o frontend

Para o frontend (React, Next.js, Vite, etc.) conseguir chamar esta API sem erro de CORS e em qualquer ambiente, siga os passos abaixo.

#### 1. Backend – CORS

No **backend**, defina de onde o frontend pode acessar a API:

- **Desenvolvimento local:** no `.env` do backend:
  ```env
  CORS_ORIGIN=http://localhost:5173,http://localhost:3000
  ```
  (Ajuste as portas: 5173 é Vite, 3000 é comum em React/Next.)

- **Produção (ex.: front no Vercel, backend no Render):** no **Render** → seu serviço → **Environment**:
  ```env
  CORS_ORIGIN=https://seu-app.vercel.app,https://www.seudominio.com
  ```
  Várias origens: separe por vírgula, **sem espaço**.

Se o front estiver em outro domínio (ex.: **https://unitedclub.lovable.app**), defina no Render → Environment: `CORS_ORIGIN=https://unitedclub.lovable.app`. Sem isso, o browser bloqueia as requisições (erro de CORS).

#### 2. Frontend – URL da API

No **frontend**, configure a URL base da API em variável de ambiente, para mudar fácil entre dev e prod.

| Stack        | Arquivo        | Variável (exemplo)     | Uso                          |
|-------------|----------------|------------------------|-----------------------------|
| Vite        | `.env` / `.env.production` | `VITE_API_URL`        | `import.meta.env.VITE_API_URL` |
| Create React App | `.env` / `.env.production` | `REACT_APP_API_URL` | `process.env.REACT_APP_API_URL` |
| Next.js     | `.env.local` / `.env.production` | `NEXT_PUBLIC_API_URL` | `process.env.NEXT_PUBLIC_API_URL` |

**Exemplo – desenvolvimento (front e back locais):**
```env
# Vite
VITE_API_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**Exemplo – produção (backend no Render):**
```env
VITE_API_URL=https://united-club-api.onrender.com
# ou
NEXT_PUBLIC_API_URL=https://united-club-api.onrender.com
```

No código do front, use essa variável como base das chamadas, por exemplo:
- `fetch(\`${import.meta.env.VITE_API_URL}/auth/login\`, { ... })`
- ou um client axios: `baseURL: process.env.NEXT_PUBLIC_API_URL`

#### 3. Autenticação (JWT)

- **Login:** `POST /auth/login` com body `{ "email", "password" }`. A resposta traz `accessToken` e `refreshToken`.
- **Registro (solicitar acesso):** `POST /auth/register` com body `{ "email", "password", "fullName", "phone" }` (público). Cria usuário afiliado com perfil e retorna os mesmos tokens + dados do usuário.
- **Rotas protegidas:** envie o token no header:
  ```http
  Authorization: Bearer <accessToken>
  ```
- **Renovar token:** quando o access expirar, chame `POST /auth/refresh` com body `{ "refreshToken": "..." }` e use o novo `accessToken` retornado.

O front deve guardar os tokens (ex.: em memória + refresh no `localStorage` ou em cookie httpOnly, conforme sua estratégia de segurança).

#### 4. Resumo rápido

| Onde      | O que configurar |
|----------|-------------------|
| Backend (.env ou Render) | `CORS_ORIGIN` = URL(s) do frontend (separadas por vírgula) |
| Frontend (.env) | `VITE_API_URL` ou `NEXT_PUBLIC_API_URL` = URL do backend (ex.: `http://localhost:3000` ou `https://united-club-api.onrender.com`) |
| Frontend (código) | Usar essa URL como base das requisições e enviar `Authorization: Bearer <accessToken>` nas rotas protegidas |

### Deploy no Render

1. **Repositório no GitHub** – Faça push deste projeto para um repositório (ex.: `seu-usuario/united-club-backend`).

2. **Render** – Acesse [render.com](https://render.com), crie conta e clique em **New** → **Web Service**.

3. **Conectar repositório** – Conecte o GitHub e escolha o repositório do backend. O Render pode detectar o `render.yaml` (Blueprint) ou você configura manualmente:
   - **Build Command:** `npm install --legacy-peer-deps && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Runtime:** Node

4. **Variáveis de ambiente** – No painel do serviço, em **Environment**, adicione:
   - `DATABASE_URL` – URL do MongoDB Atlas (com nome do banco e senha codificada)
   - `JWT_SECRET` – Chave forte (mín. 32 caracteres)
   - `JWT_REFRESH_SECRET` – Outra chave forte
   - **`CORS_ORIGIN`** – **Obrigatório** se o front estiver em outro domínio (ex.: Lovable). Ex.: `https://unitedclub.lovable.app` (várias origens: separar por vírgula, sem espaço)
   - `NODE_ENV` – (opcional) `production` (já está no Blueprint)

5. **MongoDB Atlas** – Em **Network Access**, permita acesso de qualquer IP (`0.0.0.0/0`) para o Render conseguir conectar.

6. **Deploy** – Clique em **Create Web Service**. O primeiro deploy vai instalar deps, gerar o Prisma Client, compilar e subir a API. A URL ficará tipo `https://united-club-api.onrender.com`.

7. **Swagger** – Após o deploy: `https://SEU-SERVICO.onrender.com/api/docs`.

### Fluxo principal (exemplo)

1. **Criar proposta** – `POST /proposals` (body: profileId, productId, value, opcional idempotencyKey).
2. **Aprovar proposta (admin)** – `POST /proposals/:id/approve`:
   - Atualiza status da proposta.
   - Cria comissões multinível (5% nível 1, 3% nível 2, 1% nível 3) na tabela `commissions`.
   - Atualiza `affiliate_progress` (total de vendas e nível da jornada).
   - Dispara notificação “proposta aprovada”.
3. **Solicitar saque/antecipação** – `POST /payments/request` (body: amount, type: withdrawal | advance). Antecipação: taxa 5%.
4. **Admin marca pagamento como pago** – `POST /payments/:id/mark-paid` (body opcional: externalId). Atualiza status das comissões para `paid` e dispara notificação.

### Referência da API para integração com o frontend

**Base URL:** `http://localhost:3000` (dev) ou `https://SEU-SERVICO.onrender.com` (prod)

**Header para rotas protegidas:**
```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

---

#### Raiz
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/` | Não | Health check |

**Resposta exemplo:** `{ "message": "United Club API" }`

---

#### Auth (público)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/auth/login` | Não | Login |
| POST | `/auth/register` | Não | Registro (solicitar acesso) |
| POST | `/auth/refresh` | Não | Renovar access token |

**POST /auth/register**

Request:
```json
{
  "email": "novo@example.com",
  "password": "senha123",
  "fullName": "João Silva",
  "phone": "+5511999999999"
}
```
`phone` é opcional. Senha mínima: 6 caracteres.

Response 201:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m",
  "user": {
    "id": "675abc123...",
    "email": "novo@example.com",
    "role": "affiliate",
    "fullName": "João Silva"
  }
}
```

**POST /auth/login**

Request:
```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

Response 201:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m"
}
```

**POST /auth/refresh**

Request:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Response 201: mesmo formato de `/auth/login` (novo `accessToken` e `refreshToken`).

---

#### Usuários (admin)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/users` | Admin | Listar usuários (query: `page`, `limit`, `role`) |
| GET | `/users/:id` | Sim | Buscar usuário por ID |

**GET /users?page=1&limit=20&role=affiliate**

Response 200:
```json
{
  "data": [
    {
      "id": "675abc123...",
      "email": "user@example.com",
      "role": "affiliate",
      "isActive": true,
      "createdAt": "2026-02-01T12:00:00.000Z",
      "profile": { "fullName": "João Silva", ... }
    }
  ],
  "meta": { "total": 42 }
}
```

---

#### Perfis
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/profiles/me` | Sim | Meu perfil |
| GET | `/profiles/:userId` | Sim | Perfil por userId (próprio ou admin) |
| PUT | `/profiles/:userId` | Sim | Atualizar perfil (próprio ou admin) |

**PUT /profiles/:userId**

Request:
```json
{
  "fullName": "João Silva",
  "document": "12345678900",
  "phone": "11999999999",
  "avatarUrl": "https://...",
  "bankCode": "001",
  "bankAgency": "1234",
  "bankAccount": "56789-0",
  "pixKey": "user@example.com"
}
```
Todos os campos são opcionais; envie apenas os que deseja atualizar.

**GET /profiles/me** – Response 200:
```json
{
  "id": "675abc...",
  "userId": "675def...",
  "fullName": "João Silva",
  "document": "12345678900",
  "phone": "11999999999",
  "avatarUrl": null,
  "bankCode": null,
  "bankAgency": null,
  "bankAccount": null,
  "pixKey": null,
  "createdAt": "2026-02-01T12:00:00.000Z",
  "updatedAt": "2026-02-01T12:00:00.000Z"
}
```

---

#### Produtos
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/products` | Não | Listar (query: `page`, `limit`, `activeOnly=true`) |
| GET | `/products/:id` | Não | Buscar por ID |
| POST | `/products` | Admin | Criar produto |
| PUT | `/products/:id` | Admin | Atualizar produto |

**GET /products?page=1&limit=10&activeOnly=true**

**POST /products** (admin)

Request:
```json
{
  "name": "Curso Premium",
  "slug": "curso-premium",
  "description": "Acesso vitalício ao curso.",
  "price": 997.9,
  "isActive": true
}
```

**PUT /products/:id** – body parcial (apenas campos a alterar), ex.:
```json
{
  "price": 797.9,
  "isActive": false
}
```

**Response produto (GET/POST/PUT):**
```json
{
  "id": "675abc...",
  "name": "Curso Premium",
  "slug": "curso-premium",
  "description": "Acesso vitalício ao curso.",
  "price": 997.9,
  "isActive": true,
  "createdAt": "2026-02-01T12:00:00.000Z",
  "updatedAt": "2026-02-01T12:00:00.000Z"
}
```

Listagem: `{ "data": [ ... ], "total": 5 }`.

---

#### Propostas (vendas)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/proposals` | Sim | Criar proposta |
| GET | `/proposals` | Sim | Listar (query: `page`, `limit`, `status`, `profileId`) |
| GET | `/proposals/:id` | Sim | Buscar por ID |
| POST | `/proposals/:id/approve` | Admin | Aprovar proposta |
| POST | `/proposals/:id/reject` | Admin | Rejeitar proposta (body opcional: `rejectionReason`) |

**POST /proposals**

Request:
```json
{
  "profileId": "675abc123def456...",
  "productId": "675xyz789...",
  "value": 997.9,
  "idempotencyKey": "venda-123-unica"
}
```
`idempotencyKey` opcional; evita duplicar proposta na mesma venda.

**POST /proposals/:id/reject**

Request (opcional):
```json
{
  "rejectionReason": "Documentação incompleta"
}
```

**Response proposta:** inclui `id`, `profileId`, `productId`, `value`, `status` (`pending` | `approved` | `rejected`), `approvedAt`, `rejectedAt`, `rejectionReason`, `createdAt`, `updatedAt`, e relações `profile`, `product` quando aplicável.

Listagem: `{ "data": [ ... ], "total": 10 }`.

---

#### Comissões
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/commissions/me` | Sim | Minhas comissões (query: `status`, `page`, `limit`) |
| GET | `/commissions/me/balance` | Sim | Saldo pendente |
| GET | `/commissions/me/pending` | Sim | Lista de comissões pendentes |
| GET | `/commissions/:id` | Sim | Comissão por ID (dono) |

**GET /commissions/me?status=pending&page=1&limit=20**

**GET /commissions/me/balance**

Response 200:
```json
{
  "balance": 1250.75
}
```
Ou o valor direto num número, conforme implementação.

**Response comissão:** `id`, `proposalId`, `userId`, `level`, `percentage`, `amount`, `status` (`pending` | `reserved` | `paid`), `paidAt`, `createdAt`, e relação `proposal` quando aplicável.

---

#### Pagamentos
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/payments/request` | Sim | Solicitar saque ou antecipação |
| GET | `/payments/me` | Sim | Meus pagamentos (query: `status`, `page`, `limit`) |
| GET | `/payments/:id` | Sim | Pagamento por ID (dono) |
| POST | `/payments/:id/mark-paid` | Admin | Marcar como pago |

**POST /payments/request**

Request:
```json
{
  "amount": 500,
  "type": "withdrawal"
}
```
`type`: `"withdrawal"` (saque) ou `"advance"` (antecipação; taxa 5%).

**POST /payments/:id/mark-paid** (admin)

Request (opcional):
```json
{
  "externalId": "PIX-12345"
}
```

**Response pagamento:** `id`, `userId`, `type`, `grossAmount`, `feeAmount`, `netAmount`, `status` (`pending` | `processing` | `completed` | `failed` | `cancelled`), `processedAt`, `externalId`, `createdAt`, `updatedAt`.

---

#### Rede (afiliados)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/network/me` | Sim | Minha rede (resumo) |
| GET | `/network/me/uplines` | Sim | Quem me indicou (uplines) |
| GET | `/network/me/downlines` | Sim | Quem indiquei (query: `level`) |
| GET | `/network/me/stats` | Sim | Estatísticas da rede |
| GET | `/network/:userId` | Admin | Rede de um usuário |

**GET /network/me/stats** – Response exemplo:
```json
{
  "totalUplines": 2,
  "totalDownlines": 5,
  "directDownlines": 3
}
```

---

#### Jornada (níveis)
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/journey/me` | Sim | Meu progresso na jornada |
| GET | `/journey/levels` | Não | Lista de níveis (metas em R$) |

**GET /journey/me** – Response exemplo:
```json
{
  "progress": {
    "userId": "675abc...",
    "totalSales": 25000,
    "currentLevelId": "675level2...",
    "currentLevel": { "name": "Executor", "slug": "executor", "order": 2, "minSales": 50000 },
    "lastLevelUpAt": "2026-02-01T12:00:00.000Z"
  },
  "levels": [ ... ],
  "nextLevel": { "name": "Alquimista", "minSales": 100000, "order": 3 },
  "totalSales": 25000
}
```

---

#### Notificações
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/notifications/me` | Sim | Minhas notificações (query: `unreadOnly`, `page`, `limit`) |
| PATCH | `/notifications/:id/read` | Sim | Marcar como lida |
| POST | `/notifications/read-all` | Sim | Marcar todas como lidas |

**Response notificação:** `id`, `userId`, `type`, `title`, `body`, `readAt`, `metadata`, `createdAt`.

---

#### Dashboard
| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| GET | `/dashboard/me` | Sim | Resumo: vendas, saldo, jornada, rede, próximo pagamento |

**GET /dashboard/me** – Response exemplo:
```json
{
  "totalSales": 25000,
  "totalCommissions": 1250.75,
  "nextPayment": {
    "id": "675pay...",
    "amount": 500,
    "type": "withdrawal",
    "status": "pending",
    "createdAt": "2026-02-01T12:00:00.000Z"
  },
  "journey": { ... },
  "network": { ... }
}
```

---

#### Exemplo de integração no frontend (fetch)

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Registro (solicitar acesso)
const register = async (email, password, fullName, phone) => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, fullName, phone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro no registro');
  return data; // { accessToken, refreshToken, expiresIn, user }
};

// Login
const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro no login');
  return data; // { accessToken, refreshToken, expiresIn }
};

// Importante: após login/registro, guarde o accessToken (estado + localStorage, etc.)
// e use-o em TODAS as requisições protegidas. Não chame /profiles/me, /dashboard/me
// etc. antes de ter o token definido no cliente, senão a API responde 401 e o app
// pode fazer logout automático.

// Chamada autenticada
const getProfile = async (accessToken) => {
  const res = await fetch(`${API_URL}/profiles/me`, {
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao buscar perfil');
  return data;
};

// Criar proposta
const createProposal = async (accessToken, body) => {
  const res = await fetch(`${API_URL}/proposals`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erro ao criar proposta');
  return data;
};
```

---

### Estrutura

- `src/modules/` – auth, users, profiles, products, proposals, commissions, payments, network, journey, notifications, dashboard
- `src/common/` – guards, decorators, filters, interceptors, utils, types
- `prisma/schema.prisma` – modelo de dados
- Regras: transações Prisma, idempotência em aprovação, ownership (afiliado só vê seus dados)

---

## Description (NestJS)

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install --legacy-peer-deps
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
