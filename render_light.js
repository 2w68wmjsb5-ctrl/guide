const { chromium } = require("playwright");
const path = require("path");

const files = ["light-1", "light-2", "light-3", "light-4", "light-5"];

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const f of files) {
    const page = await browser.newPage();
    await page.goto("file://" + path.resolve(__dirname, f + ".html"));
    await page.pdf({
      path: path.resolve(__dirname, f + ".pdf"),
      format: "A4",
      printBackground: true,
      margin: { top: "16mm", bottom: "16mm", left: "0mm", right: "0mm" },
    });
    await page.close();
    console.log(f + ".pdf written");
  }
  await browser.close();
})();
