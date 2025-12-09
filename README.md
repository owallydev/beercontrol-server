# 🍺 BeerControl Server  
Backend oficial do BeerControl, escrito em **Node.js + Express**, projetado para funcionar com o **ESP32 FlowNode** e o aplicativo BeerControlConfig.

---

## 🚀 Funcionalidades Principais

### ✔ Health Check  
`GET /api/ping`  
Retorna se a API está online (usado pelo ESP32 no comando SERVER_TEST).

### ✔ Ativação de Dispositivo (ESP32)  
`POST /api/device/activate`  
Registra ou atualiza um FlowNode no servidor.

Exemplo do corpo enviado pelo ESP32:
```json
{
  "mac": "AA:BB:CC:DD:EE:FF",
  "model": "BC-FLOWNODE"
}

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
