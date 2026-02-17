import { Resend } from 'resend'
import { storeToken } from '@/lib/tokenStore'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { newEmail, oldEmail } = await request.json()

    if (!newEmail || !oldEmail) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate verification token
    const verificationToken = Math.random().toString(36).substring(2, 15) + 
                              Math.random().toString(36).substring(2, 15)
    
    // Store token on server side
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    storeToken(verificationToken, {
      oldEmail,
      newEmail,
      expiresAt,
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const verificationLink = `${appUrl}/auth/verify-email?token=${verificationToken}`

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #ffffff; padding: 40px 20px; text-align: center; border-bottom: 2px solid #000000; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 2px; color: #000000; }
            .main { background: #ffffff; padding: 40px 20px; }
            .button { display: inline-block; background: #000000; color: white; padding: 16px 40px; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; font-size: 12px; margin: 30px 0; }
            .button:hover { background: #333333; }
            .section-title { font-size: 16px; font-weight: 700; color: #000000; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #000000; text-transform: uppercase; letter-spacing: 1px; }
            .info-box { background: #f5f5f5; padding: 20px; margin: 30px 0; border-left: 4px solid #000000; }
            .info-box p { margin: 0; font-size: 12px; color: #333333; line-height: 1.6; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666666; font-size: 11px; border-top: 2px solid #000000; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>TRÈIGO</h1>
            </div>

            <div class="main">
              <p style="font-size: 14px; color: #333333; margin-bottom: 20px;">Hello,</p>
              
              <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 10px;">
                We received a request to change the email address associated with your Trèigo account.
              </p>

              <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                <strong>New Email:</strong> ${newEmail}<br>
                <strong>Current Email:</strong> ${oldEmail}
              </p>

              <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 20px;">
                Click the button below to verify your new email address:
              </p>

              <div style="text-align: center;">
                <a href="${verificationLink}" class="button">Verify Email Address</a>
              </div>

              <div class="info-box">
                <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>
                <p style="word-break: break-all; margin-top: 10px; font-family: 'Courier New', monospace; font-size: 11px;">${verificationLink}</p>
              </div>

              <h3 class="section-title">What happens next?</h3>
              <p style="font-size: 14px; color: #333333; line-height: 1.6; margin: 0;">
                Once you click the verification button, your email address will be updated in your account. Your old email (${oldEmail}) will no longer be associated with your account.
              </p>

              <p style="font-size: 14px; color: #333333; line-height: 1.6; margin: 20px 0 0 0;">
                <strong>Important:</strong> This link expires in 24 hours. If you did not request this change, please ignore this email and your current email address will remain active.
              </p>

              <div style="background: #f5f5f5; padding: 20px; margin: 30px 0; border-left: 4px solid #000000;">
                <p style="margin: 0; color: #333333; font-size: 14px; font-weight: 700;">Need Help?</p>
                <p style="margin: 5px 0 0 0; color: #666666; font-size: 12px;">
                  If you have any questions, contact us at <a href="mailto:support@treigo.eu" style="color: #000000; text-decoration: underline;">support@treigo.eu</a>
                </p>
              </div>
            </div>

            <div class="footer">
              <p>© 2024 Trèigo - Second-Hand & Premium Marketplace. All rights reserved.</p>
              <p>This is an automated message, please do not reply.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'noreply@treigo.eu',
      to: newEmail,
      subject: 'Verify Your Email Address - Trèigo',
      html,
    })

    if (!result.data?.id) {
      throw new Error('Failed to send email')
    }

    return Response.json({
      success: true,
      message: 'Verification email sent',
      expiresAt: expiresAt,
    })
  } catch (error) {
    console.error('Error sending verification email:', error)
    return Response.json(
      { error: 'Failed to send verification email' },
      { status: 500 }
    )
  }
}

