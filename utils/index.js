const fs = require("fs");
const path = require("path");

const mapping = {
  unscanned: "未扫描",
  "scanned-unconfirmed": "已扫描，等待用户确认",
  "scanned-confirmed": "已扫描，用户同意授权",
  "scanned-cancel": "已扫描，用户取消授权",
  expired: "已过期",
};

async function readDatabase() {
  return new Promise((resolve) => {
    const data = fs.readFileSync(
      path.join(__dirname, "../database/index.json"),
      "utf-8"
    );

    const result = JSON.parse(data);

    resolve({
      status: result.status,
      description: mapping[result.status],
    });
  });
}

module.exports = { readDatabase };
