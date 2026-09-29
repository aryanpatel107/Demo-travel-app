import { NextRequest, NextResponse } from "next/server";
import {
  resolveCurrentHostname,
  HOSTNAME_TO_API_BASE,
  type SupportedHostname,
} from "@/config";

export const dynamic = "force-dynamic";

function makeAbsolute(
  url: unknown,
  base: string
): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();

  if (!trimmed) {
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `${base.replace(/\/+$/, "")}/${trimmed.replace(/^\/+/, "")}`;
}

function getSiteFromRequest(request: NextRequest): {
  hostname: SupportedHostname;
  apiBaseUrl: string;
} {
  const hostname = resolveCurrentHostname({
    url: request.nextUrl,
    headers: request.headers,
  });

  const apiBaseUrl =
    (process.env.API_BASE_URL &&
      (process.env.HOSTNAME === hostname ||
        process.env.NEXT_PUBLIC_HOSTNAME === hostname))
      ? process.env.API_BASE_URL.replace(/\/+$/, "")
      : HOSTNAME_TO_API_BASE[hostname];

  return {
    hostname,
    apiBaseUrl,
  };
}

export async function GET(request: NextRequest) {
  try {
    const lang =
      request.nextUrl.searchParams.get("lang") || "en";

    const site = getSiteFromRequest(request);

    const apiBaseUrl = site.apiBaseUrl.replace(/\/+$/, "");
    const hostname = site.hostname;

    const targetUrl =
      `${apiBaseUrl}/api/core/v1/config/` +
      `${encodeURIComponent(hostname)}` +
      `?lang=${encodeURIComponent(lang)}`;

    console.log(
      `[brand-config] selectedHostname: ${hostname} -> ${apiBaseUrl}`
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    let response: Response;
    try {
      response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          isSuccess: false,
          result: null,
          error:
            data?.error ||
            data?.message ||
            `External configuration API returned ${response.status}`,
        },
        { status: response.status }
      );
    }

    const result = data?.result ?? data;

    /*
     * Fix remote asset paths.
     *
     * The actual remote website.staticPath is preferred by the
     * frontend later. These fixes are only for relative paths
     *
     * Make relative image / asset paths absolute using the website hostname
     * where static assets are served (rather than the API base URL which only
     * serves REST endpoints).
     */
    if (result && typeof result === "object") {
      const remoteResult =
        result as Record<string, unknown>;

      const website =
        remoteResult.website &&
        typeof remoteResult.website === "object"
          ? (remoteResult.website as Record<string, unknown>)
          : null;

      const staticPath =
        (typeof website?.staticPath === "string" && website.staticPath.trim()) ||
        (typeof website?.serviceImageCdnPath === "string" &&
          `${website.serviceImageCdnPath.trim().replace(/\/+$/, "")}/uploads/`) ||
        `https://${hostname}`;

      const assetBaseUrl = staticPath;

      if (website) {
        website.logo =
          makeAbsolute(website.logo, assetBaseUrl) ??
          website.logo;

        website.logoUrl =
          makeAbsolute(website.logoUrl, assetBaseUrl) ??
          website.logoUrl;

        website.logoURL =
          makeAbsolute(website.logoURL, assetBaseUrl) ??
          website.logoURL;

        website.icon =
          makeAbsolute(website.icon, assetBaseUrl) ??
          website.icon;

        website.image =
          makeAbsolute(website.image, assetBaseUrl) ??
          website.image;

        website.favicon =
          makeAbsolute(website.favicon, assetBaseUrl) ??
          website.favicon;

        website.faviconImagePath =
          makeAbsolute(
            website.faviconImagePath,
            assetBaseUrl
          ) ?? website.faviconImagePath;

        website.darkThemeLogoPath =
          makeAbsolute(
            website.darkThemeLogoPath,
            assetBaseUrl
          ) ?? website.darkThemeLogoPath;
      }

      remoteResult.logo =
        makeAbsolute(remoteResult.logo, assetBaseUrl) ??
        remoteResult.logo;

      remoteResult.logoUrl =
        makeAbsolute(remoteResult.logoUrl, assetBaseUrl) ??
        remoteResult.logoUrl;

      remoteResult.icon =
        makeAbsolute(remoteResult.icon, assetBaseUrl) ??
        remoteResult.icon;
    }

    const responseObj = NextResponse.json(
      {
        isSuccess: true,
        result,
        error: null,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

    if (request.cookies.has("active_brand_hostname")) {
      responseObj.cookies.delete("active_brand_hostname");
    }

    return responseObj;
  } catch (error) {
    const isTimeout =
      error instanceof Error &&
      (error.name === "AbortError" ||
        error.message.toLowerCase().includes("abort") ||
        error.message.toLowerCase().includes("timeout"));

    console.warn("[brand-config]", isTimeout ? "Proxy request timed out" : error);

    return NextResponse.json(
      {
        isSuccess: false,
        result: null,
        error: isTimeout
          ? "The external configuration API request timed out."
          : (error instanceof Error
            ? error.message
            : "Failed to load configuration"),
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}