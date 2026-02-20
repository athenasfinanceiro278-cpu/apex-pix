const express = require("express");
const axios = require("axios");

app.get("/health", (req, res) => res.status(200).send("ok"));

const app = express();
app.use(express.json());

const WITETEC_BASE_URL = "https://api.witetec.net";

// Healthcheck
app.get("/", (req, res) => {
  res.send("API Apex rodando 🚀");
});

// Criar PIX (WiteTec)
app.post("/criar-pix", async (req, res) => {
  try {
    const apiKey = process.env.WITETEC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "WITETEC_API_KEY não configurada no Railway" });
    }

    const { amount, name, document } = req.body;

    if (!Number.isInteger(amount) || amount < 500) {
      return res.status(400).json({ error: "amount deve ser inteiro em centavos e >= 500 (R$5,00)" });
    }
    if (!name || !document) {
      return res.status(400).json({ error: "name e document são obrigatórios" });
    }

    const payload = {
      amount,
      method: "PIX",
      customer: {
        name,
        documentType: document.length > 11 ? "CNPJ" : "CPF",
        document
      },
      items: [
        {
          title: "Pagamento Apex",
          amount,
          quantity: 1,
          tangible: false
        }
      ]
    };

    const r = await axios.post(`${WITETEC_BASE_URL}/transactions`, payload, {
      headers: {
        "x-api-key": apiKey,
        "Content-Type": "application/json"
      },
      timeout: 20000
    });

    return res.status(201).json(r.data);
  } catch (error) {
    const status = error?.response?.status || 500;
    const details = error?.response?.data || error.message;
    console.error("WiteTec error:", status, details);
    return res.status(status).json({ error: "Erro ao criar PIX", details });
  }
});

// Webhook (para a WiteTec chamar)
app.post("/witetec/webhook", (req, res) => {
  console.log("Webhook recebido:", JSON.stringify(req.body));
  res.sendStatus(200);
});

// Railway
const PORT = Number(process.env.PORT) || 8080;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});