import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "../src/app/error";
import Loading from "../src/app/loading";
import NotFound from "../src/app/not-found";
import { PlaceholderPage } from "../src/features/app-shell/placeholder-page";

describe("应用壳状态", () => {
	it("占位明确说明未实现并提供来源面包屑", () => {
		render(
			<PlaceholderPage
				title="条目详情与版本"
				description="查看提示词版本"
				parent="/prompts"
			/>,
		);
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"条目详情与版本",
		);
		expect(screen.getByText("功能尚未实现")).toBeVisible();
		expect(screen.getByRole("link", { name: "Prompt" })).toHaveAttribute(
			"href",
			"/prompts",
		);
		expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
	});
	it("404 可返回项目和 Prompt 库", () => {
		render(<NotFound />);
		expect(screen.getByRole("link", { name: "返回项目" })).toHaveAttribute(
			"href",
			"/projects",
		);
		expect(
			screen.getByRole("link", { name: "返回 Prompt 库" }),
		).toHaveAttribute("href", "/prompts");
	});
	it("加载状态可被辅助技术读取", () => {
		render(<Loading />);
		expect(screen.getByRole("status")).toHaveTextContent("正在加载页面");
	});
	it("错误重试只调用局部重试且不展示内部消息", async () => {
		const retry = vi.fn();
		render(<ErrorPage error={new Error("private detail")} retry={retry} />);
		await userEvent.click(screen.getByRole("button", { name: "重试加载" }));
		expect(retry).toHaveBeenCalledOnce();
		expect(screen.queryByText("private detail")).not.toBeInTheDocument();
	});
});
