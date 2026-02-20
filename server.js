const r = await axios.post(
  "https://api.witetec.net/transactions",
  payload,
  {
    headers: {
      "x-api-key": process.env.WITETEC_API_KEY,
      "Content-Type": "application/json"
    },
    timeout: 20000
  }
);