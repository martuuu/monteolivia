import { defineConfig, devices } from '@playwright/test'

const PORT = 3300

/**
 * E2E sobre el build de producción: `npm run test:e2e` (buildea con un GA de prueba y corre la suite).
 * gtag.js se bloquea en los tests; los eventos se leen de window.dataLayer.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] }, testIgnore: /mobile\.spec\.ts/ },
    { name: 'mobile', use: { ...devices['iPhone 14'] }, testMatch: /mobile\.spec\.ts/ },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    port: PORT,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
})
