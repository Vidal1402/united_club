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
- `CORS_ORIGIN` – Origens permitidas (separadas por vírgula)

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
   - `CORS_ORIGIN` – (opcional) URL do frontend, ex.: `https://seu-app.vercel.app`
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

### Endpoints principais

| Recurso        | Método | Descrição                    |
|----------------|--------|------------------------------|
| /auth/login    | POST   | Login (email, password)      |
| /auth/refresh  | POST   | Renovar access token         |
| /users         | GET    | Listar usuários (admin)      |
| /profiles/me   | GET    | Meu perfil                   |
| /products      | GET    | Listar produtos (público)    |
| /proposals     | GET/POST | Listar/criar propostas     |
| /proposals/:id/approve | POST | Aprovar (admin)        |
| /commissions/me | GET   | Minhas comissões             |
| /commissions/me/balance | GET | Saldo pendente        |
| /payments/request | POST | Solicitar saque/antecipação |
| /payments/me   | GET    | Meus pagamentos              |
| /network/me    | GET    | Minha rede (uplines/downlines) |
| /journey/me    | GET    | Meu progresso na jornada     |
| /notifications/me | GET | Minhas notificações      |
| /dashboard/me  | GET    | Dashboard (vendas, comissões, próximo pagamento, rede) |

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
