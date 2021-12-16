import { Router, Fetcher } from "flight-path";

const router = new Router();

router.get("/stitch", async (req, res) => {
  const fetcher = new Fetcher({
    header: {
      url: "https://shastarain.com/head.html",
      backend: "shastarain_backend"
    },
    page: {
      url: "https://shastarain.com/body.html",
      backend: "shastarain_backend"
    }
  })

  let data = await fetcher.fetch();

  res.send(`
    <html>
      <head>
        <title>Content Stitching</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
      </head>
      <body>
        ${data.header.data}
        <hr />
        ${data.page.data}
      </body>
    </html>
  `)
});

router.all("*", async (req, res) => {
  // Change the hostname of the url to our origin
  req.url.host = "shastarain.com";

  // remove port, defaulting to 443 or 80 depending on protocol.
  req.url.port = "";

  // Change Host header to the correct one for our origin
  req.setHeader("host", "shastarain.com");

  // Make a request to the origin
  let originRequest = await fetch(req.url.toString(), {
    backend: "shastarain_backend",
    headers: req.headers,
    method: req.method,
    body: await req.text(),
  });

  // Send response
  res.send(originRequest);
});

// Listen for requests
router.listen();