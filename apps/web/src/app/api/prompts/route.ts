import { promptHandler } from "@/server/prompts/runtime";
export const runtime = "nodejs";
export function POST(request: Request) {
	return promptHandler(request, "create");
}

export async function GET(request: Request) {
	return promptHandler(request, "list");
}
