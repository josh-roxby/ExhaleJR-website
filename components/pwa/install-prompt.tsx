"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "exhalejr.install-dismissed";

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");

    const onBefore = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", onBefore);
    return () => window.removeEventListener("beforeinstallprompt", onBefore);
  }, []);

  if (!deferred || dismissed) return null;

  const install = async () => {
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div className="mx-auto mt-3 flex max-w-5xl items-center justify-between gap-3 rounded-lg border border-fg/10 bg-bg px-4 py-2 text-sm">
      <span className="text-muted">Install the lab as an app for quicker access.</span>
      <div className="flex gap-2">
        <button
          onClick={dismiss}
          className="rounded px-2 py-1 text-muted hover:text-fg"
          type="button"
        >
          Not now
        </button>
        <button
          onClick={install}
          className="rounded bg-fg px-3 py-1 text-bg hover:opacity-90"
          type="button"
        >
          Install
        </button>
      </div>
    </div>
  );
}
