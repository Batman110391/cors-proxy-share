const axios = require("axios");

export default async function handler(req, res) {
  const url = req.query["url"];
  const params = {};
  for (let i in req.query) {
    if (i !== "url") {
      params[i] = req.query[i];
    }
  }

  const cookie_string = req.headers.cookie || "";
  const useragent = req.headers["user-agent"] || "";

  const headers_to_send = {
    Cookie: cookie_string,
    "User-Agent": useragent,
    "content-type": "application/json",
    accept: "*/*",
  };

  const options = {
    method: req.method.toUpperCase(),
    headers: headers_to_send,
    data: req.body,
    params: params,
  };

  if (
    req.method.toUpperCase() === "GET" ||
    req.method.toUpperCase() === "HEAD"
  ) {
    delete options.data;
  }

  try {
    const response = await axios(url, options);
    const headers = response.headers;

    let cookie_header = null;
    if (headers["set-cookie"]) {
      cookie_header = headers["set-cookie"];
    }

    res.writeHead(response.status, {
      "content-type": headers["content-type"] || "text/plain",
      "set-cookie": cookie_header || [],
    });
    res.end(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
