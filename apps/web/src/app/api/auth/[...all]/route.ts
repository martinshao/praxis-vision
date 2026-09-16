import { env } from "../../../../env.server";
import { createPrivateAuthHandler } from "../../../../server/auth/http";
import { auth, getDb } from "../../../../services";

export const runtime = "nodejs";
const handler = createPrivateAuthHandler(auth, getDb(), env.BETTER_AUTH_URL);
export const GET = handler;
export const POST = handler;
