"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  ApiError,
  apiFetch,
  getCachedRemoteConfig,
  resolveBrandFromConfig,
} from "@/lib/apiClient";

import {
  useAuth,
  type AuthUser,
} from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();

  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      /*
       * Get the real website configuration and resolve
       * the valid brand identifier from cached RemoteConfigProvider.
       */
      const cached = getCachedRemoteConfig();
      const brandId = resolveBrandFromConfig(cached);

      if (!brandId) {
        throw new Error(
          "Could not resolve brand from website configuration."
        );
      }

      /*
       * Login using the resolved valid brand ID.
       */
      const user =
        await apiFetch<AuthUser>(
          "/api/auth/login",
          {
            method: "POST",

            headers: {
              "X-Brand": brandId,
            },

            body: JSON.stringify({
              email,
              password,
            }),
          }
        );

      /*
       * IMPORTANT:
       *
       * Update AuthProvider immediately.
       * This makes the Navbar know that the
       * user is logged in.
       */
      login(user);

      setSuccess(true);

      /*
       * Give React a moment to update the
       * authentication state before navigating.
       */
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 500);
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Login failed. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center px-4 py-8 sm:px-6 sm:py-16">
      <div className="w-full rounded-2xl sm:rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Welcome back
        </p>

        <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-5 sm:mt-6 space-y-4 sm:space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs sm:text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full min-h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs sm:text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full min-h-11 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm outline-none transition focus:border-sky-500 focus:bg-white"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Login successful! Redirecting…
            </div>
          )}

          <button
            type="submit"
            disabled={loading || success}
            className="flex min-h-11 w-full items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Signing in..."
              : success
                ? "Signed in"
                : "Login"}
          </button>
        </form>

        <p className="mt-5 sm:mt-6 text-center text-sm text-slate-600">
          Need an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-sky-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}