import { NextRequest, NextResponse } from 'next/server'

// PokPay configuration
const POK_BASE_URL = process.env.NEXT_PUBLIC_POK_ENV === 'production' 
  ? 'https://api.pokpay.io' 
  : 'https://api-staging.pokpay.io'

const POK_KEY_ID = process.env.POK_KEY_ID
const POK_KEY_SECRET = process.env.POK_KEY_SECRET
const POK_MERCHANT_ID = process.env.POK_MERCHANT_ID

// Get access token from PokPay
async function getAccessToken() {
  try {
    const response = await fetch(`${POK_BASE_URL}/auth/sdk/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyId: POK_KEY_ID,
        keySecret: POK_KEY_SECRET,
      }),
    })

    const data = await response.json()
    
    if (data.statusCode !== 200) {
      throw new Error('Failed to authenticate with PokPay')
    }

    return data.data.accessToken
  } catch (error) {
    console.error('Error getting PokPay access token:', error)
    throw error
  }
}

// Create payment order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, description, products, redirectUrl, failRedirectUrl, shippingCost = 0 } = body

    if (!amount && !products) {
      return NextResponse.json(
        { error: 'Amount or products are required' },
        { status: 400 }
      )
    }

    if (!POK_KEY_ID || !POK_KEY_SECRET || !POK_MERCHANT_ID) {
      return NextResponse.json(
        { error: 'PokPay credentials not configured' },
        { status: 500 }
      )
    }

    // Get access token
    const accessToken = await getAccessToken()

    // Create order
    const orderResponse = await fetch(
      `${POK_BASE_URL}/merchants/${POK_MERCHANT_ID}/sdk-orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          amount: amount,
          currencyCode: 'ALL',
          autoCapture: true,
          description: description || 'Trèigo Order',
          shippingCost: shippingCost,
          products: products || [
            {
              name: 'Order',
              quantity: 1,
              price: amount,
            },
          ],
          webhookUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
          redirectUrl: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
          failRedirectUrl: failRedirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/payment/failed`,
          expiresAfterMinutes: 1440,
        }),
      }
    )

    const orderData = await orderResponse.json()

    if (orderData.statusCode !== 200) {
      return NextResponse.json(
        { error: orderData.message || 'Failed to create payment order' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      order: orderData.data.sdkOrder,
    })
  } catch (error) {
    console.error('Payment order error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    )
  }
}
