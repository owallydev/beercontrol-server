# BeerControl Server

Backend inicial do projeto **BeerControl**, escrito em **Node.js + Express**.

## 🚀 Funcionalidades iniciais

- Rota de saúde (`GET /`) para testar se a API está online
- Rota de login (`POST /login`) que devolve um token JWT (mock simples)
- Rota para gerar token de estação (`POST /station/token`)

## 📦 Como rodar localmente

```bash
npm install
cp .env.example .env
# edite o .env se quiser
npm start
```

A API ficará disponível em `http://localhost:3000` (ou na porta definida em `PORT`).

## 🌐 Deploy na Render

Na Render:

- Crie um **Web Service**
- Conecte ao repositório do GitHub com este projeto
- Build command: `npm install`
- Start command: `npm start`
- Environment:
  - `JWT_SECRET` -> defina um segredo forte
  - `PORT` -> 3000 (ou deixe em branco que a Render define)
