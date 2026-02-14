import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcrypt";
import { prisma } from "./db.server";

type SessionData = {
  userId: string;
};

type SessionFlashData = {
  error: string;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage<SessionData, SessionFlashData>({
  cookie: {
    name: "bongg_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/admin?${searchParams}`);
  }
  return userId;
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/admin", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}

export async function verifyLogin(username: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password);

  if (!isValid) {
    return null;
  }

  return { id: admin.id, username: admin.username };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
