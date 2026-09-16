import { expect, test } from "@playwright/test";

const routes = [
	["/", "最近项目"],
	["/projects", "拍摄项目"],
	["/projects/example", "项目详情"],
	["/archive", "归档与恢复"],
	["/characters", "人物列表"],
	["/characters/new", "创建虚构人物"],
	["/characters/example", "身份与版本"],
	["/skills", "技能库"],
	["/skills/new", "创建或提炼"],
	["/skills/example", "技能版本与试用记录"],
	["/styles", "摄影风格档案"],
	["/styles/new", "新建风格"],
	["/styles/example", "档案编辑与组合"],
	["/studio/example", "专业人像创作"],
	["/quick", "快捷提示词生成"],
	["/works", "作品库"],
	["/works/example", "作品来源与复用"],
	["/prompts", "Prompt 库"],
	["/prompts/new", "收集 Prompt"],
	["/prompts/example", "条目详情与版本"],
	["/sign-in", "私有工作区登录"],
];
test("shell 所有规划入口可刷新且仅呈现占位", async ({ page }) => {
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	for (const [path, title] of routes) {
		const response = await page.goto(path);
		expect(response?.status()).toBe(200);
		await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
		await expect(page.getByText("功能尚未实现")).toBeVisible();
		expect(await page.locator("form,input,textarea").count()).toBe(0);
		expect(
			await page.evaluate(
				() => document.documentElement.scrollWidth <= window.innerWidth,
			),
		).toBe(true);
	}
	expect(errors).toEqual([]);
});
test("shell 导航、面包屑与404返回", async ({ page }, info) => {
	await page.goto("/prompts/new");
	await page
		.getByRole("navigation", { name: "面包屑" })
		.getByRole("link", { name: "Prompt", exact: true })
		.click();
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Prompt 库");
	if (info.project.name === "mobile")
		await page.getByRole("button", { name: "打开导航" }).click();
	await page
		.getByRole("navigation", { name: "主导航" })
		.filter({ visible: true })
		.getByRole("link", { name: "作品", exact: true })
		.click();
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("作品库");
	await page.goBack();
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("Prompt 库");
	const response = await page.goto("/missing-page");
	expect(response?.status()).toBe(404);
	await page.getByRole("link", { name: "返回项目", exact: true }).click();
	await expect(page.getByRole("heading", { level: 1 })).toHaveText("拍摄项目");
});
test("shell 手机抽屉键盘约束和焦点恢复", async ({ page }, info) => {
	test.skip(info.project.name !== "mobile");
	await page.goto("/prompts");
	const trigger = page.getByRole("button", { name: "打开导航" });
	await trigger.click();
	const dialog = page.getByRole("dialog", { name: "工作区导航" });
	await expect(dialog).toBeVisible();
	for (let i = 0; i < 16; i++) {
		await page.keyboard.press("Tab");
		expect(
			await page.evaluate(
				() =>
					document.activeElement === document.body ||
					Boolean(document.activeElement?.closest("dialog")),
			),
		).toBe(true);
	}
	await page.keyboard.press("Escape");
	await expect(dialog).not.toBeVisible();
	await expect(trigger).toBeFocused();
	await page.reload();
	await page.keyboard.press("Tab");
	await expect(page.getByRole("link", { name: "跳过导航" })).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(page.locator("main")).toBeFocused();
});
