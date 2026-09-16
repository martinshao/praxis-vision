import { promptHandler } from "@/server/prompts/runtime";
export const runtime = "nodejs";
export async function POST(
	request: Request,
	context: { params: Promise<{ promptId: string }> },
) {
	return promptHandler(request, "addSource", (await context.params).promptId);
}
