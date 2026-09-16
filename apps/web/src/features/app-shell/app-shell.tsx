"use client";
import {
	Archive,
	Camera,
	Folder,
	Image,
	Menu,
	Sparkles,
	User,
	Wand2,
	X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useRef } from "react";

const navigation = [
	{ href: "/projects", label: "项目", icon: Folder },
	{ href: "/characters", label: "人物", icon: User },
	{ href: "/prompts", label: "Prompt", icon: Sparkles },
	{ href: "/skills", label: "摄影技能", icon: Wand2 },
	{ href: "/styles", label: "摄影风格", icon: Camera },
	{ href: "/works", label: "作品", icon: Image },
] as const;
export function AppShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const dialog = useRef<HTMLDialogElement>(null);
	const trigger = useRef<HTMLButtonElement>(null);
	function close() {
		if (dialog.current?.open) {
			dialog.current.close();
			trigger.current?.focus();
		}
	}
	function links() {
		return (
			<>
				<Link className="brand" href="/" onClick={close}>
					<Camera aria-hidden="true" size={22} />
					<span>
						Praxis Vision<small>虚构人像创作</small>
					</span>
				</Link>
				<Link className="quick-link" href="/quick" onClick={close}>
					<Wand2 aria-hidden="true" size={18} />
					快捷生成
				</Link>
				<nav aria-label="主导航">
					{navigation.map(({ href, label, icon: Icon }) => (
						<Link
							key={href}
							href={href}
							onClick={close}
							aria-current={
								pathname === href ||
								pathname.startsWith(`${href}/`) ||
								(href === "/projects" &&
									(pathname === "/" || pathname.startsWith("/studio/")))
									? "page"
									: undefined
							}
						>
							<Icon size={18} aria-hidden="true" />
							{label}
						</Link>
					))}
				</nav>
				<div className="sidebar-bottom">
					<nav aria-label="次级导航">
						<Link
							href="/archive"
							onClick={close}
							aria-current={pathname === "/archive" ? "page" : undefined}
						>
							<Archive size={18} aria-hidden="true" />
							归档与恢复
						</Link>
						<Link
							href="/sign-in"
							onClick={close}
							aria-current={pathname === "/sign-in" ? "page" : undefined}
						>
							私有工作区登录
						</Link>
					</nav>
					<p>
						个人私有工作区
						<br />仅 AI 虚构人物
					</p>
				</div>
			</>
		);
	}
	return (
		<>
			<a className="skip-link" href="#main-content">
				跳过导航
			</a>
			<aside className="desktop-sidebar">{links()}</aside>
			<div className="shell-body">
				<header className="topbar">
					<button
						className="menu-toggle"
						type="button"
						ref={trigger}
						aria-label="打开导航"
						aria-haspopup="dialog"
						aria-controls="mobile-navigation"
						onClick={() => dialog.current?.showModal()}
					>
						<Menu size={22} aria-hidden="true" />
					</button>
					<span>个人创作工作区</span>
					<span className="topbar-note">页面框架 · 功能待实现</span>
				</header>
				<main id="main-content" tabIndex={-1}>
					{children}
				</main>
			</div>
			<dialog
				id="mobile-navigation"
				ref={dialog}
				className="mobile-drawer"
				aria-label="工作区导航"
				onCancel={close}
				onClose={() => trigger.current?.focus()}
			>
				<button
					type="button"
					className="drawer-close"
					aria-label="关闭导航"
					onClick={close}
				>
					<X aria-hidden="true" />
				</button>
				{links()}
			</dialog>
		</>
	);
}
