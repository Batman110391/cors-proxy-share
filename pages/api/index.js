const fetch = require("node-fetch");

export default async function handler(req, res) {
  const url = new URL(req.query["url"]);
  for (let i in req.query) {
    if (i !== "url") {
      url.searchParams.append(i, req.query[i]);
    }
  }

  const cookie_string = req.headers.cookie || "";
  const useragent = req.headers["user-agent"] || "";

  const header_to_send = {
    Cookie: cookie_string,
    "User-Agent": useragent,
    "content-type": "application/json",
    accept: "*/*",
    host: url.host,
  };

  const options = {
    method: req.method.toUpperCase(),
    headers: header_to_send,
    body: req.body,
  };

  if (
    req.method.toUpperCase() === "GET" ||
    req.method.toUpperCase() === "HEAD"
  ) {
    delete options.body;
  }

  const response = await fetch(url, options);
  const response_text = await response.text();
  const headers = response.headers.raw();

  let cookie_header = null;
  if (headers["set-cookie"]) {
    cookie_header = headers["set-cookie"];
  }

  res.writeHead(response.status, {
    "content-type": String(headers["content-type"]) || "text/plain",
    "set-cookie": cookie_header || [],
  });
  res.end(response_text);
}
