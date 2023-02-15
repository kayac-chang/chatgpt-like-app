import { createCookieSessionStorage } from "@remix-run/node";
import env from "~/env.server";
import z from "zod";

const IS_PROD = process.env.NODE_ENV === "production";

const storage = createCookieSessionStorage({
  cookie: {
    name: IS_PROD ? "__Secure-session" : "__session",
    secure: IS_PROD,
    secrets: [env.SESSION_SECRET],
    sameSite: "lax",
    path: "/",
    httpOnly: true,
  },
});

function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return storage.getSession(cookie);
}

const USER_SESSION_KEY = "userId";
export async function getUserSession(request: Request) {
  const session = await getSession(request);
  const id = session.get(USER_SESSION_KEY);
  if (!id) return;
  return z.string().parseAsync(id);
}

export async function createUserSession(request: Request, id: string) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, id);
  return storage.commitSession(session);
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return storage.destroySession(session);
}
