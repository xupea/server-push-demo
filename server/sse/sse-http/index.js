const http = require("http");

http
  .createServer((req, res) => {
    const routeName = "." + req.url;
    if (routeName === "./sse") {
      res.writeHead(200, {
        "Content-Type": "text/stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      });

      res.write("retry: 10000\n");

      const timer = setInterval(() => {
        res.write(`data: ${new Date()} \n\n`);
      });

      req.connection.addListener("close", () => {
        clearInterval(timer);
      });
    } else {
      res.writeHead(200);
      res.write("ok");
      res.end();
    }
  })
  .listen(3031, "127.0.0.1", () => {
    console.log("http server is listening to 3031");
  });
