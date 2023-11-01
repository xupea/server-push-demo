const fs = require("fs");
const path = require("path");

async function readDatabase() {
  return new Promise((resolve) => {
    const data = fs.readFileSync(
      path.join(__dirname, "../../database/index.json"),
      "utf-8"
    );

    resolve(JSON.parse(data));
  });
}

module.exports = { readDatabase };
