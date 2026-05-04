// Lab pages share top spacing and side padding only. Each project picks its
// own max-width inside (cooking goes full-bleed; hello stays narrow). The
// drawingboard index also wraps its content in mx-auto max-w-5xl.
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <div className="px-4 pt-8">{children}</div>;
}
