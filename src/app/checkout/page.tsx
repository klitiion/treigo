'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CreditCard, AlertCircle, Loader2, CheckCircle, Banknote, Wallet } from 'lucide-react'
import { usePayment } from '@/hooks/usePayment'
import { useCart } from '@/hooks/useCart'

export default function CheckoutPage() {
  const router = useRouter()
  const [cartTotal, setCartTotal] = useState(0)
  const [shippingCost] = useState(500) // 500 L shipping
  const [verifyProduct, setVerifyProduct] = useState(false) // Product verification option
  const [orderCreated, setOrderCreated] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'method-select' | 'cash' | 'card' | 'paypal'>('method-select')
  const [orderCode, setOrderCode] = useState<string>('')
  const { createOrder, redirectToPayment, isLoading, error } = usePayment()
  const { cart, getTotalPrice, isClient } = useCart()
  const [shippingInfo, setShippingInfo] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('shipping_info')
    if (!saved) {
      // Redirect to shipping page if no shipping info
      router.push('/shipping')
    } else {
      setShippingInfo(JSON.parse(saved))
    }
  }, [router])

  useEffect(() => {
    if (isClient && cart.length > 0) {
      setCartTotal(getTotalPrice())
    } else if (!isClient || cart.length === 0) {
      setCartTotal(85000) // Default price if no cart items
    }
  }, [cart, isClient, getTotalPrice])

  const total = cartTotal + shippingCost + (verifyProduct ? 200 : 0)

  // Generate order code
  const generateOrderCode = () => {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substring(2, 8).toUpperCase()
    return `TRG-${timestamp}-${random}`
  }

  // Handle cash payment - create order immediately
  const handleCashPayment = async () => {
    try {
      const code = generateOrderCode()
      setOrderCode(code)
      
      // Create order for cash payment
      const user = localStorage.getItem('treigo_user')
      const userData = user ? JSON.parse(user) : {}
      
      // Save order to localStorage (in real app, this would be in database)
      const orderData = {
        code: code,
        status: 'PENDING_CASH_PAYMENT',
        paymentMethod: 'CASH',
        amount: total,
        subtotal: cartTotal,
        shipping: shippingCost,
        verificationFee: verifyProduct ? 200 : 0,
        verifyProduct: verifyProduct,
        createdAt: new Date().toISOString(),
        shippingInfo: shippingInfo,
        products: cart.length > 0 ? cart : [{name: 'Products', quantity: 1, price: cartTotal}],
        buyer: userData,
      }
      
      // Store in localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      orders.push(orderData)
      localStorage.setItem('orders', JSON.stringify(orders))
      
      // Send confirmation email (mock)
      await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...orderData,
          shippingEmail: shippingInfo.email,
        }),
      }).catch(err => console.log('Order saved locally (email may be in demo mode)'))

      // Send product verification email if verification was requested
      if (verifyProduct) {
        try {
          const productNames = cart.length > 0 
            ? cart.map(item => item.name).slice(0, 3)
            : ['Products']
          
          await fetch('/api/test-email/route', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'verification_confirmation',
              to: shippingInfo.email,
              firstName: shippingInfo.firstName || 'Valued Customer',
              orderCode: code,
              productNames: productNames,
              verificationFee: 200,
            }),
          }).catch(err => console.log('Verification email may be in demo mode'))
        } catch (error) {
          console.error('Error sending verification email:', error)
        }
      }
      
      setOrderCreated(true)
      setPaymentMethod('cash')
      
      // Clear cart and shipping info
      localStorage.removeItem('cart')
      localStorage.removeItem('shipping_info')
    } catch (err) {
      console.error('Error creating cash order:', err)
    }
  }

  // Handle card/paypal payment
  const handleCardPayment = async () => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'
    const finalTotal = cartTotal + shippingCost + (verifyProduct ? 200 : 0)
    
    const order = await createOrder({
      amount: finalTotal,
      description: 'Trèigo Purchase',
      shippingCost: shippingCost,
      verificationFee: verifyProduct ? 200 : 0,
      verifyProduct: verifyProduct,
      products: cart.length > 0 ? cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })) : [
        {
          name: 'Products',
          quantity: 1,
          price: cartTotal,
        },
      ],
      redirectUrl: `${appUrl}/payment/success`,
      failRedirectUrl: `${appUrl}/payment/failed`,
    })

    if (order) {
      setOrderCreated(true)
      // Redirect to payment page after 2 seconds
      setTimeout(() => {
        redirectToPayment(order.confirmUrl)
      }, 2000)
    }
  }

  // Redirect after cash payment confirmation
  if (paymentMethod === 'cash' && orderCreated) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container-treigo max-w-2xl">
          <div className="text-center py-16">
            <div className="mb-8">
              <CheckCircle className="w-20 h-20 text-black mx-auto" />
            </div>
            <h1 className="text-4xl font-bold text-black mb-4 uppercase tracking-tight">ORDER CONFIRMED</h1>
            <p className="text-lg text-gray-700 mb-8">Thank you! Your order has been received.</p>
            
            <div className="bg-white border-2 border-black p-8 mb-8">
              <p className="text-gray-700 mb-4 text-sm uppercase tracking-wide font-semibold">ORDER CODE</p>
              <p className="text-3xl font-bold text-black font-mono mb-4">{orderCode}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">SAVE THIS CODE TO TRACK YOUR ORDER</p>
            </div>

            <div className="bg-gray-100 border-2 border-black p-6 mb-8">
              <p className="text-black font-semibold mb-2 uppercase text-sm tracking-wide">📧 CONFIRMATION EMAIL</p>
              <p className="text-sm text-blue-800">Një email konfirmimi me detajet e porosies është dërguar në {shippingInfo?.email}</p>
            </div>

            <div className="space-y-4">
              <Link
                href={`/track/${orderCode}`}
                className="block px-6 py-4 bg-black text-white font-semibold uppercase text-sm tracking-wide hover:bg-gray-800 transition-colors"
              >
                TRACK ORDER
              </Link>
              <Link
                href="/"
                className="block px-6 py-4 border-2 border-black text-black font-semibold uppercase text-sm tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                BACK HOME
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container-treigo max-w-2xl">
        {!mounted ? (
          <div className="text-center py-12">Loading...</div>
        ) : !shippingInfo ? (
          <div className="text-center py-12">Redirecting...</div>
        ) : paymentMethod === 'method-select' ? (
          // Payment Method Selection
          <>
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-tight">CHECKOUT</h1>
              <p className="text-gray-700 text-sm">Choose your payment method</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {/* Cash Payment */}
              <button
                onClick={handleCashPayment}
                className="p-8 bg-white border-2 border-black hover:bg-black hover:text-white transition-all group text-center"
              >
                <Banknote className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide text-sm">CASH ON DELIVERY</h3>
                <p className="text-sm">Pay when you receive your order</p>
              </button>

              {/* Card Payment */}
              <button
                onClick={() => setPaymentMethod('card')}
                className="p-8 bg-white border-2 border-black hover:bg-black hover:text-white transition-all group text-center"
              >
                <CreditCard className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide text-sm">CREDIT CARD</h3>
                <p className="text-sm">Visa, Mastercard, or Maestro</p>
              </button>

              {/* PayPal Payment */}
              <button
                onClick={() => setPaymentMethod('paypal')}
                className="p-8 bg-white border-2 border-black hover:bg-black hover:text-white transition-all group text-center"
              >
                <Wallet className="w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2 uppercase tracking-wide text-sm">PAYPAL</h3>
                <p className="text-sm">PayPal or Apple Pay</p>
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white border-2 border-black p-8">
              <h2 className="font-semibold text-black mb-6 uppercase text-sm tracking-wide">ORDER SUMMARY</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b-2 border-black">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 uppercase text-xs tracking-wide font-semibold">SUBTOTAL</span>
                  <span className="font-semibold text-black">{cartTotal.toLocaleString()}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 uppercase text-xs tracking-wide font-semibold">SHIPPING</span>
                  <span className="font-medium text-treigo-dark">{shippingCost.toLocaleString()} L</span>
                </div>
              </div>

              {/* Product Verification Option */}
              <div className="mb-6 pb-6 border-b-2 border-black">
                <label className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={verifyProduct} 
                    onChange={(e) => setVerifyProduct(e.target.checked)}
                    className="w-5 h-5 border-2 border-black focus:ring-black" 
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-black text-sm uppercase tracking-wide">Verify Product from Trèigo</p>
                    <p className="text-xs text-gray-600">Get professional verification for authenticity assurance</p>
                  </div>
                  <span className="font-bold text-black">+200 L</span>
                </label>
              </div>

              <div className="flex justify-between">
                <span className="font-semibold text-treigo-dark">Totali</span>
                <span className="text-2xl font-bold text-treigo-forest">
                  {total.toLocaleString()} L
                </span>
              </div>
            </div>
          </>
        ) : (
          // Card/PayPal Payment Form
          <>
            <div className="mb-8">
              <button
                onClick={() => setPaymentMethod('method-select')}
                className="text-black font-semibold mb-4 uppercase text-sm tracking-wide hover:opacity-70"
              >
                ← BACK</button>
              <h1 className="text-4xl font-bold text-black mb-2 uppercase tracking-tight">
                {paymentMethod === 'card' ? 'CARD PAYMENT' : 'PAYPAL PAYMENT'}
              </h1>
              <p className="text-gray-600 text-sm">Complete your payment details to finish your order</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {paymentMethod === 'card' ? (
              <>
                {/* Demo Info */}
                <div className="bg-gray-50 border-l-4 border-black p-6">
                  <h3 className="font-semibold text-black mb-2 uppercase text-sm tracking-wide">📋 DEMO CARD</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    This is a demo integration. For testing use:
                  </p>
                  <div className="space-y-1 text-sm font-mono text-gray-700">
                    <p>Card: 4111 1111 1111 1111</p>
                    <p>Exp: 12/25</p>
                    <p>CVV: 123</p>
                  </div>
                </div>

                {/* Card Payment Form */}
                <div className="bg-white border-2 border-black p-8">
                  <h2 className="font-semibold text-black mb-8 uppercase text-sm tracking-wide">CARD DETAILS</h2>
                  
                  <div className="space-y-6">
                    {/* Card Number */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        CARD NUMBER
                      </label>
                      <input
                        type="text"
                        placeholder="4111 1111 1111 1111"
                        maxLength={19}
                        className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                      />
                    </div>

                    {/* Cardholder Name */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                        CARDHOLDER NAME
                      </label>
                      <input
                        type="text"
                        placeholder="First Last"
                        className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                      />
                    </div>

                    {/* Expiry and CVV */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                          EXPIRY DATE
                        </label>
                        <input
                          type="text"
                          placeholder="12/25"
                          maxLength={5}
                          className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          maxLength={4}
                          className="w-full px-10 py-3 bg-white border-b-2 border-gray-300 focus:border-black focus:outline-none transition-colors text-black placeholder:text-gray-700 placeholder:font-semibold tracking-wide leading-relaxed"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              // PayPal Info
              <div className="bg-gray-50 border-l-4 border-black p-6">
                <h3 className="font-semibold text-black mb-2 uppercase text-sm tracking-wide">💳 PAYPAL</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Click the button below to redirect to PayPal and complete your payment.
                </p>
              </div>
            )}

            {/* Cart Items Display */}
            {isClient && cart.length > 0 && (
              <div className="bg-white border-2 border-black p-8 mb-8">
                <h2 className="font-semibold text-black mb-6 uppercase text-sm tracking-wide">YOUR ITEMS</h2>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center pb-4 border-b border-gray-300 last:border-0">
                      <div>
                        <p className="font-semibold text-black text-sm">{item.name}</p>
                        <p className="text-xs text-gray-600 uppercase tracking-wide">{item.seller} × {item.quantity}</p>
                      </div>
                      <span className="font-bold text-black text-sm">{(item.price * item.quantity).toLocaleString()}L</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cart Summary */}
            <div className="bg-white border-2 border-black p-8">
              <h2 className="font-semibold text-black mb-6 uppercase text-sm tracking-wide">ORDER TOTAL</h2>
              
              <div className="space-y-4 mb-6 pb-6 border-b-2 border-black">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 uppercase text-xs tracking-wide font-semibold">SUBTOTAL</span>
                  <span className="font-semibold text-black">{cartTotal.toLocaleString()}L</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700 uppercase text-xs tracking-wide font-semibold">SHIPPING</span>
                  <span className="font-semibold text-black">{shippingCost.toLocaleString()}L</span>
                </div>
              </div>

              <div className="flex justify-between mb-8">
                <span className="font-bold text-black uppercase text-sm tracking-wide">TOTAL</span>
                <span className="text-3xl font-bold text-black">
                  {total.toLocaleString()}L
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-600 p-6 flex gap-4">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">ERROR</h3>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {orderCreated && (
              <div className="bg-green-50 border-l-4 border-green-600 p-6 flex gap-4">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">ORDER CREATED</h3>
                  <p className="text-sm text-green-800">Redirecting to payment system...</p>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <button
              onClick={handleCardPayment}
              disabled={isLoading || orderCreated}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-black text-white font-semibold uppercase tracking-wide text-sm hover:bg-gray-800 transition-all duration-300 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {orderCreated && <CheckCircle className="w-5 h-5" />}
              {!isLoading && !orderCreated && (paymentMethod === 'paypal' ? <Wallet className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />)}
              {isLoading ? 'PROCESSING...' : orderCreated ? 'REDIRECTING...' : `PAY ${total.toLocaleString()}L`}
            </button>
          </div>

          {/* Security Info */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-black p-8">
              <h3 className="font-semibold text-black mb-6 uppercase text-sm tracking-wide">🔒 SECURITY</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold">✓</span>
                  <span>256-bit SSL Encryption</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">✓</span>
                  <span>3D Secure Authentication</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">✓</span>
                  <span>PCI DSS Certified</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">✓</span>
                  <span>Money-Back Guarantee</span>
                </li>
              </ul>
            </div>

            <Link
              href="/search"
              className="block text-center px-4 py-4 bg-white border-2 border-black text-black font-semibold uppercase tracking-wide text-sm hover:bg-black hover:text-white transition-all"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  )
}
