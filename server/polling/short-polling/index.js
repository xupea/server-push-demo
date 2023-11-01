const Koa = require("koa");
const path = require("path");
const { createReadStream } = require("fs");
const { readDatabase } = require("../../utils");

const port = 3033;

new Koa()
  .use(async (ctx, next) => {
    if (ctx.path !== "/short-polling") {
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
