import { Copy, Trash2 } from 'lucide-react'

interface CouponProps {
  code: string
  discount: number
  description: string
  expiryDate: string
  isUsed?: boolean
  onCopy?: (code: string) => void
  onDelete?: (code: string) => void
}

export function CouponCard({
  code,
  discount,
  description,
  expiryDate,
  isUsed = false,
  onCopy,
  onDelete,
}: CouponProps) {
  return (
    <div className={`relative border-2 border-black bg-white h-48 ${isUsed ? 'opacity-50' : ''}`}>
      {/* Content */}
      <div className="relative h-full p-6 flex flex-col justify-between">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">COUPON</p>
              <h3 className="text-2xl font-bold text-black tracking-wider">{code}</h3>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-black">{discount}%</p>
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">DISCOUNT</p>
            </div>
          </div>
          <p className="text-sm text-gray-700 font-semibold">{description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t-2 border-black pt-4">
          <div>
            <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold">EXPIRES</p>
            <p className="font-bold text-black">{expiryDate}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onCopy?.(code)}
              className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
              title="Copy code"
            >
              <Copy className="w-4 h-4" />
            </button>
            {onDelete && (
              <button
                onClick={() => onDelete(code)}
                className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
                title="Delete coupon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Used Badge */}
        {isUsed && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80">
            <span className="text-lg font-bold text-black uppercase tracking-wide">USED</span>
          </div>
        )}
      </div>
    </div>
  )
}
