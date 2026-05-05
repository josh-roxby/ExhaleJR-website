export type ClassValue = string | false | null | undefined | ClassValue[];

export function cn(...parts: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
  };
  parts.forEach(walk);
  return out.join(" ");
}
