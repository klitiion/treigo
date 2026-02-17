'use client'

import { RotateCcw, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function ReturnsPage() {
  return (
    <main className="min-h-screen py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-5xl lg:text-6xl font-900 text-black mb-4 uppercase tracking-tight">RETURN POLICY</h1>
          <p className="text-gray-600 mb-12 uppercase text-sm tracking-wide font-semibold">How to return items purchased on Trèigo</p>

          <div className="space-y-12">
            {/* Overview */}
            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">RETURN WINDOW</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have <strong>14 days from receipt</strong> to return an item in Trèigo. This gives you two weeks to inspect the product and decide if you want to keep it.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Returns must be initiated within 14 days. Late requests will not be accepted.
              </p>
            </section>

            {/* Eligible Items */}
            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">ELIGIBLE FOR RETURN</h2>
              <p className="text-gray-700 leading-relaxed mb-4">Items can be returned if:</p>
              <ul className="text-gray-700 space-y-2 ml-6 list-disc">
                <li>Item is damaged in transit</li>
                <li>Item does not match the seller's description</li>
                <li>Item is counterfeit or fake</li>
                <li>Item is significantly different from photos</li>
                <li>Item stops working within 30 days (defective)</li>
              </ul>
            </section>

            {/* Not Eligible */}
            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">NOT ELIGIBLE FOR RETURN</h2>
              <p className="text-gray-700 leading-relaxed mb-4">The following cannot be returned:</p>
              <ul className="text-gray-700 space-y-2 ml-6 list-disc">
                <li>Item in worse condition than when received (buyer damage)</li>
                <li>Missing original tags or packaging (if new item)</li>
                <li>Item used extensively beyond inspection</li>
                <li>Personal preference changes (wrong size, color, style)</li>
                <li>Items purchased from non-authorized sellers (counterfeits)</li>
              </ul>
            </section>

            {/* How to Return */}
            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">HOW TO INITIATE A RETURN</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">1</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">Go to Your Orders</h3>
                    <p className="text-gray-700">Navigate to "My Orders" in your Buyer Dashboard within 14 days of receipt.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">2</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">Select the Item</h3>
                    <p className="text-gray-700">Click on the order and select "Request Return".</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">3</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">Provide Evidence</h3>
                    <p className="text-gray-700">Upload photos showing the damage/defect and explain why you want to return it.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">4</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">Wait for Approval</h3>
                    <p className="text-gray-700">Seller has 48 hours to respond. If they agree, you'll get shipping instructions.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-bold">5</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">Ship Back</h3>
                    <p className="text-gray-700">Pack the item securely and ship it back according to the seller's instructions.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Refund Process */}
            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">REFUND TIMELINE</h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-black">Return Approved: 48 hours</p>
                    <p className="text-gray-700 text-sm">Seller responds to your return request</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-black">Item in Transit: 5-7 business days</p>
                    <p className="text-gray-700 text-sm">Time to ship item back to seller</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-black">Inspection: 3-5 business days</p>
                    <p className="text-gray-700 text-sm">Seller inspects returned item</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <RotateCcw className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-black">Refund Processed: 5-7 business days</p>
                    <p className="text-gray-700 text-sm">Money returned to your original payment method</p>
                  </div>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-6 p-4 bg-blue-50 border-l-4 border-blue-600">
                <strong>Total Time:</strong> Returns typically process within 2-3 weeks from initiation. You can track your return status in your account.
              </p>
            </section>

            {/* Important Notes */}
            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">IMPORTANT NOTES</h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-yellow-50 border-l-4 border-yellow-600">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-black mb-1">Return Shipping</p>
                    <p className="text-gray-700 text-sm">Buyers pay return shipping costs unless the item is counterfeit or severely damaged.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-yellow-50 border-l-4 border-yellow-600">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-black mb-1">Proof of Purchase</p>
                    <p className="text-gray-700 text-sm">Keep your Trèigo order confirmation and shipping tracking for reference.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-yellow-50 border-l-4 border-yellow-600">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-black mb-1">Original Condition</p>
                    <p className="text-gray-700 text-sm">Item must be in the same condition as received. Normal wear from inspection is acceptable.</p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-yellow-50 border-l-4 border-yellow-600">
                  <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-black mb-1">Disputed Returns</p>
                    <p className="text-gray-700 text-sm">If seller disagrees with return, Trèigo will review evidence and make a final decision.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact */}
            <section className="bg-gray-100 border-2 border-black p-8">
              <h2 className="text-lg font-bold text-black mb-6 uppercase tracking-wide">NEED HELP WITH A RETURN?</h2>
              <p className="text-gray-700 mb-4"><strong>Email:</strong> <a href="mailto:support@treigo.com" className="text-black hover:underline">support@treigo.com</a></p>
              <p className="text-gray-700"><strong>WhatsApp:</strong> <a href="https://wa.me/355692084763" target="_blank" rel="noopener noreferrer" className="text-black hover:underline">Message us on WhatsApp</a></p>
            </section>
          </div>
        </div>
      </main>
    )
  }
