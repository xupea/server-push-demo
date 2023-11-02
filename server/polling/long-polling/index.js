const Koa = require("koa");
const path = require("path");
const { createReadStream } = require("fs");
const { readDatabase } = require("../../../utils");

const port = 3034;

let lastStatus = 'unscanned';

new Koa()
  .use(async (ctx, next) => {
    if (ctx.path !== "/long-polling") {
      return await next();
    }

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(async () => {
        resolve(await readDatabase());
      }, 25000);
    });

    const getStatusPromise = new Promise((resolve) => {
      const timer = setInterval(async () => {
        const res = await readDatabase();
        if (res.status !== lastStatus) {
          clearInterval(timer);
          resolve(res);
        }
      }, 1000);
    });

    const res = await Promise.race([timeoutPromise, getStatusPromise]);

    lastStatus = res.status;

    ctx.status = 200;

    ctx.body = res;
  })
  .use((ctx) => {
    ctx.type = "html";
    ctx.body = createReadStream(path.join(__dirname, "./index.html"));
  })
  .listen(port, () => {
    console.log(`Listening to ${port}`);
  });
