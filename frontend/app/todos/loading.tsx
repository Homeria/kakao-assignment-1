import PageCard from "../components/ui/PageCard";

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

export default function TodosLoading() {
  return (
    <main className="min-h-screen px-5 py-10 text-slate-950">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <PageCard>
          <SkeletonBlock className="h-4 w-52" />
          <SkeletonBlock className="mt-4 h-9 w-40" />
          <SkeletonBlock className="mt-5 h-5 w-full" />
          <SkeletonBlock className="mt-2 h-5 w-4/5" />
        </PageCard>

        <PageCard padding="compact">
          <div className="flex gap-2">
            <SkeletonBlock className="h-20 w-9 shrink-0" />
            <div className="grid flex-1 grid-cols-7 gap-1">
              {Array.from({ length: 7 }, (_, index) => (
                <SkeletonBlock key={index} className="h-20" />
              ))}
            </div>
            <SkeletonBlock className="h-20 w-9 shrink-0" />
          </div>
        </PageCard>

        <PageCard>
          <div className="flex items-center justify-between gap-3">
            <SkeletonBlock className="size-10 shrink-0" />
            <div className="flex flex-1 flex-col items-center">
              <SkeletonBlock className="h-4 w-20" />
              <SkeletonBlock className="mt-2 h-7 w-56" />
            </div>
            <SkeletonBlock className="size-10 shrink-0" />
          </div>

          <SkeletonBlock className="mt-6 h-12 w-full" />
          <SkeletonBlock className="mt-4 h-10 w-full" />
          <SkeletonBlock className="mt-5 h-11 w-24" />

          <div className="mt-6 space-y-3">
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-16 w-full" />
            <SkeletonBlock className="h-16 w-full" />
          </div>
        </PageCard>
      </div>
    </main>
  );
}
