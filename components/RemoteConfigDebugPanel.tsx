"use client";

import { useRemoteConfig } from "@/components/RemoteConfigProvider";

/**
 * Temporary visible proof that data from stagingapi.technoheaven.com is
 * actually being fetched and rendered in the UI. Drop this anywhere
 * (e.g. your homepage) to see the complete raw response. Remove once
 * you've confirmed the pipeline works and your team has filled in real
 * theme/color data.
 */
export default function RemoteConfigDebugPanel() {
  const { remoteConfig, loading, error } = useRemoteConfig();

  return (
    <div className="fixed bottom-4 right-4 z-50 max-h-96 w-96 overflow-auto rounded-2xl border-2 border-emerald-400 bg-slate-900 p-4 text-xs text-emerald-300 shadow-2xl">
      <p className="mb-2 font-bold text-white">
        🔴 LIVE from stagingapi.technoheaven.com
      </p>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {remoteConfig && (
        <pre className="whitespace-pre-wrap break-all">
          {JSON.stringify(remoteConfig, null, 2)}
        </pre>
      )}
    </div>
  );
}