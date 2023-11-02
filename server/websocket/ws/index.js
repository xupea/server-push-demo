const Koa = require("koa");
const path = require("path");
const { createReadStream } = require("fs");
const { WebSocketServer, WebSocket } = require("ws");
const { readDatabase } = require("../../../utils");

const port = 3035;

const wss = new WebSocketServer({ port: 8080 });

let lastStatus;

wss.on("connection", function connection(ws, req) {
  const ip = req.socket.remoteAddress;

  setInterval(() => {
    wss.clients.forEach(async function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        const res = await readDatabase();

        if (res.status !== lastStatus) {
          lastStatus = res.status;
          client.send(JSON.stringify(res));
        }
      }
    });
  }, 2000);

  ws.on("error", console.error);
});

new Koa()
  .use(async (ctx, next) => {
    if (ctx.path !== "/ws") {
      return await next();
    }

    ctx.status = 200;
    ctx.body = await readDatabase();
  })
  .use((ctx) => {
    ctx.type = "html";
    ctx.body = createReadStream(path.join(__dirname, "./index.html"));
  })
  .listen(port, () => {
    console.log(`Listening to ${port}`);
  });
