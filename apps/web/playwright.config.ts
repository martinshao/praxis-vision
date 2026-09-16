import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
	testDir: "./e2e",
	fullyParallel: false,
	workers: 1,
	use: { baseURL: "http://127.0.0.1:3001", trace: "retain-on-failure" },
	projects: [
		{
			name: "desktop",
			use: {
				...devices["Desktop Chrome"],
				channel: "chrome",
				viewport: { width: 1440, height: 900 },
			},
		},
		{
			name: "mobile",
			use: {
				...devices["Desktop Chrome"],
				channel: "chrome",
				viewport: { width: 375, height: 812 },
			},
		},
	],
	webServer: {
		command: "pnpm dev",
		url: "http://127.0.0.1:3001",
		reuseExistingServer: false,
		timeout: 120000,
	},
});
