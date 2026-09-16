import type { Route } from "next";
import Link from "next/link";

const labels: Record<string, string> = {
	"/projects": "项目",
	"/characters": "人物",
	"/skills": "摄影技能",
	"/styles": "摄影风格",
	"/works": "作品",
	"/prompts": "Prompt",
};
export function PlaceholderPage({
	title,
	description,
	parent,
}: {
	title: string;
	description: string;
	parent?: string;
}) {
	return (
		<section aria-labelledby="page-title">
			<nav aria-label="面包屑" className="breadcrumbs">
				<Link href="/">工作区</Link>
				{parent && (
					<>
						<span aria-hidden="true">/</span>
						<Link href={parent as Route}>{labels[parent]}</Link>
					</>
				)}
				<span aria-hidden="true">/</span>
				<span aria-current="page">{title}</span>
			</nav>
			<header className="page-heading">
				<p className="eyebrow">PRAXIS VISION · 个人创作工作台</p>
				<h1 id="page-title">{title}</h1>
				<p>{description}</p>
				<span className="status-label">功能尚未实现</span>
			</header>
			<div className="placeholder">
				<div className="placeholder-mark" aria-hidden="true">
					＋
				</div>
				<h2>创作内容将在这里展开</h2>
				<p>当前仅提供页面导航与布局占位。</p>
				<p>此页面没有连接业务数据，也不会触发生图。</p>
			</div>
		</section>
	);
}
