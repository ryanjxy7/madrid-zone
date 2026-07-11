import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-24 text-center">
      <span className="font-display text-6xl font-bold text-brand">404</span>
      <h1 className="font-display text-2xl font-bold text-heading">Page not found</h1>
      <p className="max-w-sm font-body text-sm text-muted">
        The story you&apos;re looking for has moved or doesn&apos;t exist.
      </p>
      <Link href="/" className="rounded-[4px] bg-brand px-5 py-2.5 font-body text-sm font-bold text-white">
        Back to Madrid Zone
      </Link>
    </div>
  );
}
