const express = require("express");
const app = express();

app.use(express.json());

console.log("INICIANDO SERVIDOR...");

app.get("/", (req, res) => {
  res.send("API Apex rodando 🚀");
});

app.post("/witetec/webhook", (req, res) => {
  console.log("Evento recebido:", req.body);

  if (req.body.status === "PAID") {
    console.log("Pagamento confirmado!");
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});