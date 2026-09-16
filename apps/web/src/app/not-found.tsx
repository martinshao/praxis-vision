import Link from "next/link";
export default function NotFound() {
	return (
		<section className="state-page">
			<p className="eyebrow">404</p>
			<h1>页面不存在</h1>
			<p>这个地址没有对应的页面。</p>
			<Link className="action-link" href="/projects">
				返回项目
			</Link>
			<Link className="action-link" href="/prompts">
				返回 Prompt 库
			</Link>
		</section>
	);
}
