// Lab pages share a max-width container. Global chrome (floating nav,
// install prompt) lives at the root layout — see app/layout.tsx.
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4 pt-8">{children}</div>;
}
