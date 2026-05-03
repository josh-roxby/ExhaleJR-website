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
        className="w-full rounded border border-fg/20 bg-transparent px-3 py-2 text-sm outline-none focus:border-fg/50"
      />
      <p className="text-sm">{name ? `Hello, ${name}.` : "Type something."}</p>
    </div>
  );
}
