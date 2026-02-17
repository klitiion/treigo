import { NextRequest, NextResponse } from 'next/server'
import { sendOrderConfirmationEmail } from '@/lib/emails'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email') || 'test@example.com'
    
    const result = await sendOrderConfirmationEmail(email, 'TRG-TEST-EMAIL', {
      firstName: 'Test',
      lastName: 'User',
      total: 50000,
      items: [
        {
          name: 'Test Product',
          quantity: 1,
          price: 50000,
        },
      ],
      shippingAddress: 'Test Address 123',
      shippingCity: 'Tirana',
    })

    return NextResponse.json({
      success: true,
      message: 'Email test sent',
      result,
    })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
