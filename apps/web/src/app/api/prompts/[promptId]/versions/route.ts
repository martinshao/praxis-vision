import { promptHandler } from "@/server/prompts/runtime";
export const runtime = "nodejs";
type Context = { params: Promise<{ promptId: string }> };
export async function GET(request: Request, context: Context) {
	return promptHandler(request, "versions", (await context.params).promptId);
}
export async function POST(request: Request, context: Context) {
	return promptHandler(
		request,
		"appendVersion",
		(await context.params).promptId,
	);
}
