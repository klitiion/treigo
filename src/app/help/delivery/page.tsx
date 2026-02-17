'use client'

import { Truck, Clock, MapPin } from 'lucide-react'

export default function DeliveryPage() {
  return (
    <main className="min-h-screen py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-5xl lg:text-6xl font-900 text-black mb-4 uppercase tracking-tight">DELIVERY INFORMATION</h1>
          <p className="text-gray-600 mb-12 uppercase text-sm tracking-wide font-semibold">Everything you need to know about shipping</p>

          <div className="space-y-12">
            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-6 uppercase tracking-tight">DELIVERY TIMES</h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 border-2 border-black">
                  <Truck className="w-8 h-8 text-black flex-shrink-0" />
                  <div>
                    <p className="font-bold text-black">Within Tirana</p>
                    <p className="text-gray-700">2-3 business days</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border-2 border-black">
                  <Clock className="w-8 h-8 text-black flex-shrink-0" />
                  <div>
                    <p className="font-bold text-black">Rest of Albania</p>
                    <p className="text-gray-700">5-7 business days</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border-2 border-black">
                  <MapPin className="w-8 h-8 text-black flex-shrink-0" />
                  <div>
                    <p className="font-bold text-black">International</p>
                    <p className="text-gray-700">10-15 business days (if available)</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">SHIPPING COST</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Shipping costs are set by individual sellers. You'll see the total shipping cost before checkout.
              </p>
              <ul className="text-gray-700 space-y-2 ml-6 list-disc">
                <li>Flat rate shipping: Fixed price regardless of order size</li>
                <li>Weight-based shipping: Price varies by package weight</li>
                <li>Free shipping: Some sellers offer free shipping</li>
              </ul>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">TRACKING YOUR ORDER</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Once your order ships, you'll receive a tracking number via email. You can use this to monitor your package's progress.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Tracking updates are provided by the shipping carrier. Delays can occur due to weather, customs, or high order volumes.
              </p>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">PACKAGING</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All items are carefully packed to minimize damage during transit. High-value items are typically shipped with extra protection.
              </p>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">IF YOUR ITEM DOESN'T ARRIVE</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If your order doesn't arrive within the estimated timeframe:
              </p>
              <ol className="text-gray-700 space-y-2 ml-6 list-decimal">
                <li>Wait 1-2 additional days (delays happen)</li>
                <li>Contact the seller to ask about status</li>
                <li>If still missing, file a claim in your order</li>
                <li>Provide tracking number and evidence</li>
                <li>Trèigo will investigate and resolve</li>
              </ol>
            </section>

            <section className="bg-gray-100 border-2 border-black p-8">
              <h2 className="text-lg font-bold text-black mb-6 uppercase tracking-wide">DELIVERY SUPPORT</h2>
              <p className="text-gray-700 mb-4"><strong>Email:</strong> <a href="mailto:support@treigo.com" className="text-black hover:underline">support@treigo.com</a></p>
              <p className="text-gray-700"><strong>WhatsApp:</strong> <a href="https://wa.me/355692084763" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Message us on WhatsApp</a></p>
            </section>
          </div>
        </div>
      </main>
    )
  }
