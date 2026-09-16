"use client";
import Link from "next/link";
export default function ErrorPage({
	retry,
}: {
	error: Error & { digest?: string };
	retry: () => void;
}) {
	return (
		<section className="state-page" role="alert">
			<h1>页面暂时无法显示</h1>
			<p>你可以重试加载页面，或返回项目。</p>
			<button type="button" onClick={retry}>
				重试加载
			</button>
			<Link className="action-link" href="/projects">
				返回项目
			</Link>
		</section>
	);
}
