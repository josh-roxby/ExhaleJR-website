"use client";

import { useState } from "react";

export function Greeter() {
  const [name, setName] = useState("");
  return (
    <div className="space-y-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-sq border border-line-2 bg-surface-2 px-3 py-2 text-sm text-ink placeholder:text-mute-3 outline-none transition focus:border-accent focus:bg-surface focus:shadow-[0_0_0_3px_var(--accent-glow)]"
      />
      <p className="text-sm text-ink-2">{name ? `Hello, ${name}.` : "Type something."}</p>
    </div>
  );
}
