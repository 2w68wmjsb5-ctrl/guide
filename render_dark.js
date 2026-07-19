const { chromium } = require("playwright");
const path = require("path");

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage();
  await page.goto("file://" + path.resolve(__dirname, "dark.html"));
  await page.pdf({
    path: path.resolve(__dirname, "dark.pdf"),
    width: "210mm",
    height: "297mm",
    printBackground: true,
    margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
  });
  await browser.close();
  console.log("dark.pdf written");
})();
