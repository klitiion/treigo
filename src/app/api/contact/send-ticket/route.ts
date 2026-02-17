import { sendSupportTicketEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, inquiryType, ticketCode } = body

    // Validate required fields
    if (!name || !email || !subject || !ticketCode) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Try to send support ticket email
    try {
      const result = await sendSupportTicketEmail(
        email,
        name,
        subject,
        ticketCode,
        inquiryType
      )

      if (!result.success) {
        console.warn('Email sending failed, but continuing with ticket creation')
      }
    } catch (emailError) {
      console.warn('Email service error:', emailError)
      // Continue anyway - ticket is still created
    }

    // Log the ticket (in a real app, save to database)
    console.log(`Support ticket created: #${ticketCode}`, {
      name,
      email,
      subject,
      inquiryType,
      message,
      timestamp: new Date().toISOString(),
    })

    return Response.json({
      success: true,
      ticketCode,
      message: 'Support ticket created successfully'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
