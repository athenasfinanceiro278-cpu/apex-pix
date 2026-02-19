const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

console.log("INICIANDO SERVIDOR...");

// ROTA TESTE
app.get("/", (req, res) => {
  res.send("API Apex rodando 🚀");
});

// 🔔 WEBHOOK WITETEC
app.post("/witetec/webhook", (req, res) => {
  console.log("Evento recebido:", req.body);

  if (req.body.status === "PAID") {
    console.log("Pagamento confirmado!");
  }

  res.sendStatus(200);
});

// 💰 CRIAR PIX
app.post("/criar-pix", async (req, res) => {
  try {
    const { amount, description } = req.body;

    const response = await axios.post(
      "https://api.witetec.com/transactions",
      {
        amount: amount,
        method: "PIX",
        description: description
      },
      {
        headers: {
          "x-api-key": process.env.WITETEC_API_KEY
        }
      }
    );

    res.json(response.data);

  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Erro ao criar PIX" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});