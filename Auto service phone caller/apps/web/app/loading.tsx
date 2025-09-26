import { Spinner } from "./components/ui";

export default function RootLoading() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Spinner size={32} />
        <p className="mt-4 text-sm text-slate-600">Loading...</p>
      </div>
    </div>
  );
}
