import { defineConfig } from "@playwright/test";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests",
  forbidOnly: isCI,
  workers: isCI ? 2 : undefined,
  use: {
    baseURL: "http://localhost:3000",
    browserName: "chromium",
    // Patient imagery must not enter retained traces or automatic captures.
    screenshot: "off",
    trace: "off",
    video: "off",
  },
  webServer: {
    command: isCI ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !isCI,
    timeout: 120_000,
  },
  reporter: "list",
});
