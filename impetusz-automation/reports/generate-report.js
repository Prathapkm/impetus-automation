const report = require("multiple-cucumber-html-reporter");

report.generate({
  jsonDir: "./reports",
  reportPath: "./reports/html-report",
  metadata: {
    browser: { name: "chromium", version: "latest" },
    device: "Local Machine",
    platform: { name: "macOS" },
  },
  customData: {
    title: "Impetusz Platform Test Report",
    data: [
      { label: "Project", value: "Impetusz UAT Automation" },
      { label: "Environment", value: "UAT" },
      { label: "URL", value: "https://platform.uat.impetusz0.de/" },
    ],
  },
});
