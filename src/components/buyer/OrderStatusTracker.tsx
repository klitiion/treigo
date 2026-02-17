import { CheckCircle, Clock, Truck } from 'lucide-react'

interface OrderStatusTrackerProps {
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  estimatedDelivery?: string
}

export function OrderStatusTracker({ status, estimatedDelivery }: OrderStatusTrackerProps) {
  const statuses = [
    { id: 'pending', label: 'Porosi', icon: Clock },
    { id: 'processing', label: 'Përgatitje', icon: Clock },
    { id: 'shipped', label: 'Në Udhëtim', icon: Truck },
    { id: 'delivered', label: 'Dorëzuar', icon: CheckCircle },
  ]

  const currentIndex = statuses.findIndex((s) => s.id === status)
  const progress = ((currentIndex + 1) / statuses.length) * 100

  return (
    <div className="w-full">
      <div className="mb-6">
        <div className="relative h-2 bg-treigo-olive/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-treigo-forest to-treigo-sage transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {statuses.map((item, index) => {
          const Icon = item.icon
          const isActive = index <= currentIndex
          const isCurrent = index === currentIndex

          return (
            <div key={item.id} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                  isActive
                    ? isCurrent
                      ? 'bg-treigo-forest text-white ring-4 ring-treigo-sage/30'
                      : 'bg-treigo-sage text-white'
                    : 'bg-treigo-olive/20 text-treigo-olive'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <p
                className={`text-xs text-center font-medium ${
                  isActive ? 'text-treigo-dark' : 'text-treigo-dark/50'
                }`}
              >
                {item.label}
              </p>
            </div>
          )
        })}
      </div>

      {status === 'cancelled' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
          <p className="text-red-700 text-sm font-medium">❌ Porosi u Anulua</p>
        </div>
      )}

      {estimatedDelivery && status !== 'cancelled' && status !== 'delivered' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-700 text-xs font-medium">
            📦 Dorëzim i Pritur: <strong>{estimatedDelivery}</strong>
          </p>
        </div>
      )}

      {status === 'delivered' && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-green-700 text-sm font-medium">✓ Dorëzuar me sukses</p>
        </div>
      )}
    </div>
  )
}
