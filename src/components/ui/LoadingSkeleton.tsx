'use client'

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="skeleton h-64 rounded-2xl" />
      ))}
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-treigo-olive/10">
      <div className="skeleton aspect-square rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-10 w-full rounded-lg" />
      </div>
    </div>
  )
}
