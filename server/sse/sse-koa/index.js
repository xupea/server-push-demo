const Koa = require("koa");
const { PassThrough } = require("stream");
const { createReadStream } = require("fs");
const path = require("path");
const { readDatabase } = require("../../../utils");

const port = 3000;

let lastStatus = "unscanned";
let msgId = 0;

new Koa()
  .use(async (ctx, next) => {
    if (ctx.path !== "/sse") {
      return await next();
    }

    ctx.request.socket.setTimeout(0);
    ctx.req.socket.setNoDelay(true);
    ctx.req.socket.setKeepAlive(true);

    ctx.set({
      "Content-TYpe": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });

    const stream = new PassThrough();

    ctx.status = 200;
    ctx.body = stream;

    const res = await readDatabase();

    lastStatus = res.status;

    stream.write(
      `retry: 10000\nid: msg${msgId++}\ndata: ${JSON.stringify(res)}\n\n`
    );

    const timer = setInterval(async () => {
      const res = await readDatabase();
      if (res.status !== lastStatus) {
        lastStatus = res.status;

        stream.write(
          `retry: 10000\nid: msg${msgId++}\ndata: ${JSON.stringify(res)}\n\n`
        );

        if (
          res.status === "scanned-confirmed" ||
          res.status === "scanned-cancel"
        ) {
          clearInterval(timer);
        }
      }
    }, 1000);

    stream.on("close", () => {
      console.log("stream is close");
      clearInterval(timer);
    });
  })
  .use((ctx) => {
    ctx.type = "html";
    ctx.body = createReadStream(path.join(__dirname, "./index.html"));
  })
  .listen(port, () => {
    console.log(`Listening to ${port}`);
  });
