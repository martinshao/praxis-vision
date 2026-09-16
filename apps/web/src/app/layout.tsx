import type { Metadata } from "next";
import "../index.css";
import { AppShell } from "@/features/app-shell/app-shell";
export const metadata: Metadata = {
	title: { default: "Praxis Vision", template: "%s · Praxis Vision" },
	description: "个人私有的 AI 虚构人像创作工作台",
	robots: { index: false, follow: false },
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="zh-CN" className="dark">
			<body>
				<AppShell>{children}</AppShell>
			</body>
		</html>
	);
}
