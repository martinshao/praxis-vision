import { promptHandler } from "@/server/prompts/runtime";
export const runtime = "nodejs";
export async function POST(
	request: Request,
	context: { params: Promise<{ promptId: string }> },
) {
	return promptHandler(request, "restore", (await context.params).promptId);
}
