const axios = require("axios");

export default async function handler(req, res) {
  const url = req.query["url"];

  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    const response = await axios.get(url);

    res.status(200).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
