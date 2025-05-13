import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
  type UserType
} from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import {
  getCookie,
  setCookie,
  deleteCookie
} from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";
import { createFactory, createMiddleware } from 'hono/factory';

const kindeClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
  authDomain: process.env.KINDE_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URI!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
});

const sessionManager = (c: Context): SessionManager => ({
  async getSessionItem(key: string) {
    return getCookie(c, key);
  },
  async setSessionItem(key: string, value: unknown) {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
    }

    if (typeof value === 'string') {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },
  async removeSessionItem(key: string) {
    deleteCookie(c, key);
  },
  async destroySession() {
    ["id_token", "access_token", "user", "refresh_token"].forEach((key) => {
      deleteCookie(c, key);
    })
  }
});

type Env = {
  Variables: {
    user: UserType
  }
}

const getUser = createMiddleware<Env>(async (c, next) => {
  try {
    const manager = sessionManager(c);
    const isAuthenticated = await kindeClient.isAuthenticated(manager);

    if (!isAuthenticated) {
      return c.json<{ error: string }>({ error: "Unauthorized" }, 401);
    }

    const user = await kindeClient.getUserProfile(manager);

    c.set('user', user);
    await next();
  } catch (error) {
    console.error('Error in getUser middleware:', error);
    return c.json<{ error: string }>({ error: "Unauthorized" }, 401);
  }
})

export {
  kindeClient,
  sessionManager,
  getUser
};
