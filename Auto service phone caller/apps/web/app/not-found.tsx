import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="mx-auto max-w-3xl py-24 text-center">
      <div className="text-6xl font-bold tracking-tight">404</div>
      <p className="mt-3 text-slate-600">This page could not be found.</p>
      <div className="mt-6">
        <Link
          href="/app/calls"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
