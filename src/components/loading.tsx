export function Loading() {
  return (
    <div className="space-y-4" role="status" aria-label="A carregar">
      <div className="skeleton h-8 w-56" />
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card flex gap-3">
      <div className="skeleton size-12 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-5 w-1/2" />
      </div>
    </div>
  );
}
