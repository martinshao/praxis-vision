import { promptHandler } from "@/server/prompts/runtime";
export const runtime = "nodejs";
type Context = { params: Promise<{ promptId: string }> };
export async function GET(request: Request, context: Context) {
	return promptHandler(request, "detail", (await context.params).promptId);
}
export async function PATCH(request: Request, context: Context) {
	return promptHandler(request, "metadata", (await context.params).promptId);
}
