# United Club Backend - Projeto para LinkedIn

## Construindo um backend completo de afiliados com NestJS + MongoDB

Desenvolvi o backend do **United Club**, uma plataforma de afiliados com foco em:

- gestao de propostas (vendas)
- comissao multinivel
- jornada gamificada por niveis
- solicitacao e processamento de pagamentos
- painel administrativo com visao operacional

O objetivo foi criar uma API robusta, segura e pronta para producao, cobrindo o fluxo real de afiliacao ponta a ponta.

---

## Principais tecnologias

- **Node.js + NestJS** (arquitetura modular e escalavel)
- **TypeScript** (tipagem forte e manutencao)
- **Prisma ORM**
- **MongoDB Atlas**
- **JWT + Refresh Token** (autenticacao e sessao)
- **Swagger/OpenAPI** (documentacao da API)
- **Render** (deploy)

---

## O que a plataforma faz

### 1) Autenticacao e perfis
- cadastro e login com JWT
- refresh token para renovacao de sessao
- perfis de usuario com dados comerciais/financeiros
- controle de acesso por role (**admin** e **affiliate**)

### 2) Produtos e propostas
- CRUD de produtos (admin)
- criacao de proposta por afiliado
- aprovacao/rejeicao de proposta por admin

### 3) Comissao multinivel
- ao aprovar proposta, o sistema distribui comissoes em niveis:
  - nivel 1: 5%
  - nivel 2: 3%
  - nivel 3: 1%
- suporte ao mapeamento de rede de indicacao (upline/downline)

### 4) Jornada gamificada
- progresso de afiliado por metas de vendas
- calculo de nivel atual e proximo nivel
- atualizacao automatica ao aprovar vendas

### 5) Pagamentos
- afiliado solicita saque/antecipacao
- admin visualiza todos os pagamentos da plataforma
- admin marca como pago ou cancela solicitacao
- endpoint para listar afiliados com saldo pendente (mesmo sem saque solicitado)

### 6) Area administrativa
- listagem de usuarios com filtros
- ativacao/desativacao de contas
- endpoint de detalhes completos por usuario:
  - vendas
  - comissoes
  - propostas (historico e status)
  - rede e jornada
  - proximos pagamentos

---

## Decisoes tecnicas e desafios resolvidos

- adaptacao para **MongoDB Atlas M0** (sem transacoes multi-documento em alguns cenarios)
- tratamento de idempotencia em fluxos sensiveis
- padronizacao de erros e respostas para facilitar integracao com o frontend
- validacao de DTOs para reduzir inconsistencias
- CORS configurado para ambientes de producao e integrações externas

---

## Resultado

Entreguei uma API com foco em negocio real, cobrindo regras importantes de afiliacao, comissao, pagamentos e administracao, com documentacao clara e pronta para ser consumida por frontend web.

---

## Texto curto (versao post LinkedIn)

Hoje finalizei o backend do **United Club**, uma plataforma de afiliados com **NestJS + TypeScript + Prisma + MongoDB Atlas**.

O projeto inclui autenticacao JWT, gestao de propostas, comissao multinivel (5%/3%/1%), jornada gamificada, pagamentos (saque/antecipacao) e area admin com visao completa dos usuarios.

Foi um desafio muito rico em regras de negocio e arquitetura, principalmente em consistencia de dados, permissoes por role e deploy em producao.

Se quiser trocar ideia sobre o projeto, arquitetura backend ou afiliacao multinivel, bora conversar.

#NodeJS #NestJS #TypeScript #Prisma #MongoDB #Backend #API #SoftwareEngineering

