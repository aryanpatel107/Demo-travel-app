"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAppConfig } from "@/components/RemoteConfigProvider";
import { apiFetch, getCachedRemoteConfig, resolveBrandFromConfig } from "@/lib/apiClient";

function EyeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10.5 7 10.5 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61C3.06 8.9 1.5 12 1.5 12s3.5 7 10.5 7a9.27 9.27 0 0 0 5.39-1.61" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M1 1l22 22" />
    </svg>
  );
}

export default function RegisterPage() {
  const router = useRouter();

  const { branding, loading: configLoading } = useAppConfig();

  const brandName = branding.name?.trim() || "";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ==========================================================
      // GET THE CURRENT REMOTE WEBSITE CONFIGURATION
      // ==========================================================

      const config = getCachedRemoteConfig();

      const brandId = resolveBrandFromConfig(config);

      if (!brandId) {
        throw new Error(
          "Could not resolve brand from website configuration."
        );
      }

      await apiFetch<{ id: string }>("/api/auth/register", {
        method: "POST",

        headers: {
          "X-Brand": brandId,
        },

        body: JSON.stringify({
          name,
          email,
          password,
          confirmPassword,
        }),
      });

      // ==========================================================
      // SUCCESS
      // ==========================================================

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 700);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center justify-center px-4 py-8 sm:px-6 sm:py-16">
      <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
          Create your {brandName} account
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:mt-3 sm:text-3xl">
          Register
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4 sm:space-y-5">
          {/* ======================================================
              NAME
          ====================================================== */}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white sm:py-3"
            />
          </div>

          {/* ======================================================
              EMAIL
          ====================================================== */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-sky-500 focus:bg-white sm:py-3"
            />
          </div>

          {/* ======================================================
              PASSWORD
          ====================================================== */}

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                className="min-h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 pr-11 text-sm outline-none transition focus:border-sky-500 focus:bg-white sm:py-3"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((current) => !current)
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center px-3 text-slate-400 transition hover:text-slate-600"
              >
                {showPassword ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>
          </div>

          {/* ======================================================
              CONFIRM PASSWORD
          ====================================================== */}

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                className="min-h-11 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 pr-11 text-sm outline-none transition focus:border-sky-500 focus:bg-white sm:py-3"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
                aria-pressed={showConfirmPassword}
                className="absolute inset-y-0 right-0 flex min-h-11 min-w-11 items-center justify-center px-3 text-slate-400 transition hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon />
                ) : (
                  <EyeIcon />
                )}
              </button>
            </div>
          </div>

          {/* ======================================================
              ERROR
          ====================================================== */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ======================================================
              SUCCESS
          ====================================================== */}

          {success && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Account created! Redirecting to login…
            </div>
          )}

          {/* ======================================================
              REGISTER BUTTON
          ====================================================== */}

          <button
            type="submit"
            disabled={
              loading ||
              success ||
              configLoading ||
              !brandName
            }
            className="flex min-h-11 w-full items-center justify-center rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? "Creating account..."
              : success
                ? "Account created"
                : configLoading
                  ? "Loading..."
                  : "Register"}
          </button>
        </form>

        {/* ========================================================
            LOGIN LINK
        ======================================================== */}

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-sky-700"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}