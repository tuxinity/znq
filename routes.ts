/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */

import { UserRole } from "@prisma/client";

export const publicRoutes = ["/auth/new-verification"];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /settings
 * @type {string[]}
 */

export const authRoutes = [
  "/auth/login",
  "/auth/error",
  "/auth/reset",
  "/auth/register",
  "/auth/new-password",
];

/**
 * The prefix for Api authentication routes
 * Routes that star with this prefix are used for API authentication purpose
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT: string = UserRole.ADMIN
  ? "/dashboard/admin"
  : "dashboard";
