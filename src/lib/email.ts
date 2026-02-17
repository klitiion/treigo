import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.EMAIL_FROM || 'notify@treigo.eu'
const VERIFICATION_EMAIL = process.env.VERIFICATION_EMAIL || 'sales@treigo.eu'
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  verificationToken: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Trèigo <${FROM_EMAIL}>`,
      to: email,
      subject: `Verify your Trèigo account - Code: ${verificationToken}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account - Trèigo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border: 2px solid #000000; padding: 40px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #000000;">
                <h1 style="color: #000000; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Trèigo</h1>
                <p style="color: #666666; font-size: 12px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Second-Hand & Premium</p>
              </div>
              
              <!-- Content -->
              <h2 style="color: #000000; font-size: 24px; font-weight: 900; margin: 24px 0; text-transform: uppercase; letter-spacing: 0.5px;">Verify Your Account</h2>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                Hi ${firstName},
              </p>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                Thank you for signing up on Trèigo! To complete your registration, use the verification code below.
              </p>
              
              <!-- Verification Code -->
              <div style="text-align: center; margin: 32px 0;">
                <p style="color: #666666; font-size: 12px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Your Verification Code</p>
                <div style="background-color: #f5f5f5; border: 2px solid #000000; padding: 32px; margin: 0;">
                  <p style="font-size: 48px; font-weight: 900; color: #000000; margin: 0; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                    ${verificationToken}
                  </p>
                </div>
                <p style="color: #999999; font-size: 12px; margin-top: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Code expires in 10 minutes</p>
              </div>
              
              <div style="margin: 32px 0; padding: 24px; background: #f9f9f9; border-left: 4px solid #000000;">
                <p style="color: #333333; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>Didn't request this?</strong> If you didn't create a Trèigo account, you can safely ignore this email. Your account remains secure.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #000000; text-align: center; font-size: 12px; color: #999999;">
                <p style="margin: 0; line-height: 1.8;">
                  Trèigo - Second-Hand & Premium Marketplace<br/>
                  <a href="${APP_URL}/contact" style="color: #000000; text-decoration: underline;">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Email send error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Email service error:', error)
    return { success: false, error }
  }
}

export async function sendProductVerificationRequest(
  productData: {
    productId: string
    productTitle: string
    brand: string
    category: string
    sellerName: string
    sellerEmail: string
    sellerPhone: string
    shopName: string
    verificationLevel: string
    proofDocuments: string[]
    photoUrls: string[]
    serialCode?: string
    batchCode?: string
    purchaseYear?: string
    purchasePlace?: string
    saleReason?: string
    condition: string
    defects?: string
  }
) {
  const {
    productId,
    productTitle,
    brand,
    category,
    sellerName,
    sellerEmail,
    sellerPhone,
    shopName,
    verificationLevel,
    proofDocuments,
    photoUrls,
    serialCode,
    batchCode,
    purchaseYear,
    purchasePlace,
    saleReason,
    condition,
    defects,
  } = productData

  try {
    const { data, error } = await resend.emails.send({
      from: `Trèigo Verifikimi <${FROM_EMAIL}>`,
      to: VERIFICATION_EMAIL,
      subject: `[Verifikim] ${brand} - ${productTitle} (${verificationLevel})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Kërkesë Verifikimi - Trèigo</title>
        </head>
        <body style="font-family: 'Poppins', Arial, sans-serif; background-color: #F6F0D7; margin: 0; padding: 20px;">
          <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(137, 152, 109, 0.15);">
            <h1 style="color: #89986D; margin-bottom: 8px;">🔍 Kërkesë Verifikimi</h1>
            <p style="color: #9CAB84; margin-bottom: 24px;">Nivel: <strong>${verificationLevel}</strong></p>
            
            <hr style="border: none; border-top: 2px solid #C5D89D; margin: 24px 0;">
            
            <h2 style="color: #2D3A1F;">📦 Informacion Produkti</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A; width: 150px;">ID Produkti:</td>
                <td style="padding: 8px 0; color: #2D3A1F; font-weight: 500;">${productId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Titulli:</td>
                <td style="padding: 8px 0; color: #2D3A1F; font-weight: 500;">${productTitle}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Marka:</td>
                <td style="padding: 8px 0; color: #2D3A1F; font-weight: 500;">${brand}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Category:</td>
                <td style="padding: 8px 0; color: #2D3A1F;">${category}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Gjendja:</td>
                <td style="padding: 8px 0; color: #2D3A1F;">${condition}</td>
              </tr>
              ${defects ? `
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Defekte:</td>
                <td style="padding: 8px 0; color: #DC2626;">${defects}</td>
              </tr>
              ` : ''}
              ${serialCode ? `
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Serial Code:</td>
                <td style="padding: 8px 0; color: #2D3A1F; font-family: monospace;">${serialCode}</td>
              </tr>
              ` : ''}
              ${batchCode ? `
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Batch Code:</td>
                <td style="padding: 8px 0; color: #2D3A1F; font-family: monospace;">${batchCode}</td>
              </tr>
              ` : ''}
              ${purchaseYear ? `
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Viti i blerjes:</td>
                <td style="padding: 8px 0; color: #2D3A1F;">${purchaseYear}</td>
              </tr>
              ` : ''}
              ${purchasePlace ? `
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Vendi i blerjes:</td>
                <td style="padding: 8px 0; color: #2D3A1F;">${purchasePlace}</td>
              </tr>
              ` : ''}
              ${saleReason ? `
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Arsyeja e shitjes:</td>
                <td style="padding: 8px 0; color: #2D3A1F;">${saleReason}</td>
              </tr>
              ` : ''}
            </table>
            
            <hr style="border: none; border-top: 2px solid #C5D89D; margin: 24px 0;">
            
            <h2 style="color: #2D3A1F;">👤 Informacion Shitësi</h2>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A; width: 150px;">Emri:</td>
                <td style="padding: 8px 0; color: #2D3A1F; font-weight: 500;">${sellerName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Dyqani:</td>
                <td style="padding: 8px 0; color: #2D3A1F;">${shopName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Email:</td>
                <td style="padding: 8px 0; color: #2D3A1F;"><a href="mailto:${sellerEmail}">${sellerEmail}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7A5A;">Telefon:</td>
                <td style="padding: 8px 0; color: #2D3A1F;"><a href="tel:${sellerPhone}">${sellerPhone}</a></td>
              </tr>
            </table>
            
            <hr style="border: none; border-top: 2px solid #C5D89D; margin: 24px 0;">
            
            <h2 style="color: #2D3A1F;">📸 Foto (${photoUrls.length})</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
              ${photoUrls.map((url, i) => `
                <a href="${url}" target="_blank" style="display: inline-block; padding: 8px 16px; background: #C5D89D; color: #2D3A1F; text-decoration: none; border-radius: 8px; font-size: 14px;">
                  Foto ${i + 1}
                </a>
              `).join('')}
            </div>
            
            ${proofDocuments.length > 0 ? `
            <h2 style="color: #2D3A1F;">📄 Dokumente (${proofDocuments.length})</h2>
            <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
              ${proofDocuments.map((url, i) => `
                <a href="${url}" target="_blank" style="display: inline-block; padding: 8px 16px; background: #89986D; color: white; text-decoration: none; border-radius: 8px; font-size: 14px;">
                  Dokument ${i + 1}
                </a>
              `).join('')}
            </div>
            ` : ''}
            
            <hr style="border: none; border-top: 2px solid #C5D89D; margin: 24px 0;">
            
            <div style="text-align: center;">
              <a href="${APP_URL}/admin/verification/${productId}" style="display: inline-block; background: #89986D; color: white; padding: 16px 32px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 12px; margin-right: 12px;">
                ✓ Aprovo
              </a>
              <a href="${APP_URL}/admin/verification/${productId}?action=reject" style="display: inline-block; background: #DC2626; color: white; padding: 16px 32px; font-size: 16px; font-weight: 600; text-decoration: none; border-radius: 12px;">
                ✗ Refuzo
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Verification email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Verification email service error:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, firstName: string, role: 'BUYER' | 'SELLER') {
  const roleText = role === 'SELLER' ? 'seller' : 'buyer'
  
  try {
    const { data, error } = await resend.emails.send({
      from: `Trèigo <${FROM_EMAIL}>`,
      to: email,
      subject: `Welcome to Trèigo, ${firstName}! 🎉`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Welcome to Trèigo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border: 2px solid #000000; padding: 40px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #000000;">
                <h1 style="color: #000000; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Trèigo</h1>
              </div>
              
              <h2 style="color: #000000; text-align: center; font-size: 24px; font-weight: 900; margin: 24px 0; text-transform: uppercase; letter-spacing: 0.5px;">Welcome, ${firstName}!</h2>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; text-align: left; margin: 24px 0;">
                Your account has been successfully created. You're now ready to get started as a <strong>${roleText}</strong> on Trèigo.
              </p>
              
              ${role === 'SELLER' ? `
              <div style="background: #f5f5f5; border: 2px solid #000000; padding: 24px; margin: 24px 0;">
                <h3 style="color: #000000; margin: 0 0 16px 0; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">AS A SELLER, YOU CAN:</h3>
                <ul style="color: #333333; line-height: 2; margin: 0; padding-left: 24px;">
                  <li>Create your personal store</li>
                  <li>List products with verification</li>
                  <li>Get the "Trèigo Verified" badge</li>
                  <li>Manage orders and inventory</li>
                  <li>Track your sales performance</li>
                </ul>
              </div>
              ` : `
              <div style="background: #f5f5f5; border: 2px solid #000000; padding: 24px; margin: 24px 0;">
                <h3 style="color: #000000; margin: 0 0 16px 0; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px;">AS A BUYER, YOU CAN:</h3>
                <ul style="color: #333333; line-height: 2; margin: 0; padding-left: 24px;">
                  <li>Browse verified products</li>
                  <li>Save items to your wishlist</li>
                  <li>Communicate with sellers</li>
                  <li>Leave reviews for purchases</li>
                  <li>Track your orders in real-time</li>
                </ul>
              </div>
              `}
              
              <div style="margin: 32px 0; padding: 24px; background: #f9f9f9; border-left: 4px solid #000000;">
                <p style="color: #666666; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>Need help?</strong> If you have any questions, visit our <a href="${APP_URL}/help/faq" style="color: #000000; text-decoration: underline;">Help Center</a> or <a href="${APP_URL}/contact" style="color: #000000; text-decoration: underline;">contact us</a>.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${APP_URL}" style="display: inline-block; background-color: #000000; color: white; padding: 16px 48px; font-size: 16px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                  Start Shopping
                </a>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #000000; text-align: center; font-size: 12px; color: #999999;">
                <p style="margin: 0;">
                  Trèigo - Second-Hand & Premium Marketplace<br/>
                  <a href="${APP_URL}/contact" style="color: #000000; text-decoration: underline;">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Welcome email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Welcome email service error:', error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(
  email: string,
  firstName: string,
  resetToken: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Trèigo <${FROM_EMAIL}>`,
      to: email,
      subject: `Reset Your Password - Code: ${resetToken}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - Trèigo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border: 2px solid #000000; padding: 40px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #000000;">
                <h1 style="color: #000000; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Trèigo</h1>
                <p style="color: #666666; font-size: 12px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Security & Privacy</p>
              </div>
              
              <!-- Content -->
              <h2 style="color: #000000; font-size: 24px; font-weight: 900; margin: 24px 0; text-transform: uppercase; letter-spacing: 0.5px;">Reset Your Password</h2>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                Hi ${firstName},
              </p>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                We received a request to reset your account password. Use the verification code below to create a new password.
              </p>
              
              <!-- Verification Code -->
              <div style="text-align: center; margin: 32px 0;">
                <p style="color: #666666; font-size: 12px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Your Password Reset Code</p>
                <div style="background-color: #f5f5f5; border: 2px solid #000000; padding: 32px; margin: 0;">
                  <p style="font-size: 48px; font-weight: 900; color: #000000; margin: 0; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                    ${resetToken}
                  </p>
                </div>
                <p style="color: #999999; font-size: 12px; margin-top: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Code expires in 10 minutes</p>
              </div>
              
              <div style="margin: 32px 0; padding: 24px; background: #fff3cd; border-left: 4px solid #000000;">
                <p style="color: #333333; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>⚠️ Security Notice:</strong> This code expires in 10 minutes. If you didn't request a password reset, you can safely ignore this email. Your account remains secure.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #000000; text-align: center; font-size: 12px; color: #999999;">
                <p style="margin: 0; line-height: 1.8;">
                  Trèigo - Second-Hand & Premium Marketplace<br/>
                  <a href="${APP_URL}/contact" style="color: #000000; text-decoration: underline;">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Password reset email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Password reset email service error:', error)
    return { success: false, error }
  }
}

export async function sendDeleteAccountEmail(
  email: string,
  firstName: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Trèigo <${FROM_EMAIL}>`,
      to: email,
      subject: 'Your Trèigo account has been deleted',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Deleted - Trèigo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border: 2px solid #000000; padding: 40px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #000000;">
                <h1 style="color: #000000; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Trèigo</h1>
                <p style="color: #666666; font-size: 12px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Account Management</p>
              </div>
              
              <!-- Content -->
              <h2 style="color: #000000; font-size: 24px; font-weight: 900; margin: 24px 0; text-transform: uppercase; letter-spacing: 0.5px;">Your Account Has Been Deleted</h2>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                Hi ${firstName},
              </p>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                We received your account deletion request and it has been successfully processed. Your account data will be retained for 30 days for security and privacy reasons, then permanently deleted.
              </p>
              
              <div style="margin: 32px 0; padding: 24px; background: #f0f0f0; border: 2px solid #000000;">
                <p style="color: #333333; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>Important Information:</strong> You will not be able to create a new account with the same email address for 5 days. This is to protect your account security.
                </p>
              </div>
              
              <p style="color: #666666; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                If you have any questions or need further assistance, please contact our support team.
              </p>
              
              <!-- Footer -->
              <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #000000; text-align: center; font-size: 12px; color: #999999;">
                <p style="margin: 0; line-height: 1.8;">
                  Trèigo - Second-Hand & Premium Marketplace<br/>
                  <a href="${APP_URL}/contact" style="color: #000000; text-decoration: underline;">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Delete account email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Delete account email service error:', error)
    return { success: false, error }
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderData: {
    code: string
    amount: number
    products: Array<{ name: string; quantity: number; price: number }>
    shippingInfo: any
    buyer: any
  }
) {
  try {
    const trackingUrl = `${APP_URL}/track/${orderData.code}`
    
    const productsList = orderData.products
      .map(p => `<tr><td style="padding: 12px; border-bottom: 1px solid #E8E4D4;">${p.name}</td><td style="padding: 12px; border-bottom: 1px solid #E8E4D4; text-align: center;">${p.quantity}</td><td style="padding: 12px; border-bottom: 1px solid #E8E4D4; text-align: right;">${(p.price * p.quantity).toLocaleString()} L</td></tr>`)
      .join('')

    const { data, error } = await resend.emails.send({
      from: `Trèigo <${FROM_EMAIL}>`,
      to: email,
      subject: `Porosia Juaj Konfirmuar - ${orderData.code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Konfirmim Porosise - Trèigo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Poppins', Arial, sans-serif; background-color: #F6F0D7;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(137, 152, 109, 0.15);">
              <!-- Logo -->
              <div style="text-align: center; margin-bottom: 32px;">
                <h1 style="color: #89986D; font-size: 32px; font-weight: 700; margin: 0;">Trèigo</h1>
              </div>
              
              <!-- Content -->
              <h2 style="color: #2D3A1F; font-size: 24px; font-weight: 600; margin-bottom: 16px;">
                🎉 Hooray! Porosia Juaj u Pranu!
              </h2>
              
              <p style="color: #6B7A5A; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Faleminderit për blerjen tuaj në Trèigo! Porosia juaj është në pritje të përgatitjes dhe do të dërgohet së shpejti.
              </p>
              
              <!-- Order Code -->
              <div style="background-color: #F6F0D7; border: 2px solid #89986D; border-radius: 12px; padding: 24px; margin: 24px 0; text-align: center;">
                <p style="color: #9CAB84; font-size: 13px; margin: 0 0 12px 0;">Kodi i Porosise:</p>
                <p style="font-size: 28px; font-weight: 700; color: #89986D; margin: 0; font-family: 'Courier New', monospace;">
                  ${orderData.code}
                </p>
                <p style="color: #9CAB84; font-size: 12px; margin: 12px 0 0 0;">Ruajeni këtë kod për të gjurmuar porositjen</p>
              </div>
              
              <!-- Order Details -->
              <h3 style="color: #2D3A1F; font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">Detajet e Porosise:</h3>
              <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
                <thead>
                  <tr style="background-color: #F6F0D7;">
                    <th style="padding: 12px; text-align: left; color: #89986D; font-weight: 600;">Produkti</th>
                    <th style="padding: 12px; text-align: center; color: #89986D; font-weight: 600;">Sasia</th>
                    <th style="padding: 12px; text-align: right; color: #89986D; font-weight: 600;">Çmimi</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsList}
                </tbody>
              </table>
              
              <div style="background-color: #F6F0D7; border-radius: 8px; padding: 16px; margin: 24px 0;">
                <div style="display: flex; justify-content: space-between; color: #2D3A1F; font-size: 16px; font-weight: 600;">
                  <span>Totali:</span>
                  <span>${orderData.amount.toLocaleString()} L</span>
                </div>
              </div>
              
              <!-- Shipping Info -->
              <h3 style="color: #2D3A1F; font-size: 16px; font-weight: 600; margin: 24px 0 12px 0;">📍 Destinacioni i Dërgimit:</h3>
              <p style="color: #6B7A5A; font-size: 14px; line-height: 1.8; margin: 0;">
                ${orderData.shippingInfo.firstName} ${orderData.shippingInfo.lastName}<br>
                ${orderData.shippingInfo.address}<br>
                ${orderData.shippingInfo.postalCode} ${orderData.shippingInfo.city}<br>
                📞 ${orderData.shippingInfo.phone}<br>
                ✉️ ${orderData.shippingInfo.email}
              </p>
              
              <!-- Tracking Link -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${trackingUrl}" style="display: inline-block; background-color: #89986D; color: white; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                  🔍 Gjurmoni Porositjen
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #E8E4D4; margin: 32px 0;">
              
              <p style="color: #9CAB84; font-size: 13px; line-height: 1.6;">
                <strong>Çfarë ndodh tani?</strong><br>
                1️⃣ Porosia juaj po përgatitet<br>
                2₣ You will receive an update email when it ships<br>
                3️⃣ You can track your order using the code above<br>
              </p>
              
              <p style="color: #9CAB84; font-size: 13px; text-align: center; margin: 24px 0 0 0;">
                Nëse keni ndonjë pyetje, kontaktoni shitësin përmes platformës.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 24px;">
              <p style="color: #9CAB84; font-size: 12px;">
                © 2024 Trèigo. Të gjitha të drejtat e rezervuara.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Order confirmation email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Order confirmation email service error:', error)
    return { success: false, error }
  }
}

export async function sendSupportTicketEmail(
  email: string,
  name: string,
  subject: string,
  ticketCode: string,
  inquiryType: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Trèigo Support <${FROM_EMAIL}>`,
      to: email,
      subject: `Support Ticket #${ticketCode} - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Support Ticket Confirmation</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border: 2px solid #000000; padding: 40px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #000000;">
                <h1 style="color: #000000; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Trèigo</h1>
                <p style="color: #666666; font-size: 12px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Support Team</p>
              </div>
              
              <h2 style="color: #000000; font-size: 24px; font-weight: 900; margin: 24px 0; text-transform: uppercase; letter-spacing: 0.5px;">Ticket Received</h2>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                Hi ${name},
              </p>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                Thank you for contacting Trèigo Support. We have received your inquiry and created a support ticket for you. Our team will review your request and respond as soon as possible.
              </p>
              
              <!-- Ticket Details -->
              <div style="background: #f5f5f5; border: 2px solid #000000; padding: 24px; margin: 24px 0;">
                <h3 style="color: #000000; margin: 0 0 16px 0; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; font-size: 14px;">TICKET DETAILS</h3>
                <div style="border-bottom: 1px solid #dddddd; padding-bottom: 12px; margin-bottom: 12px;">
                  <p style="color: #666666; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">TICKET NUMBER</p>
                  <p style="color: #000000; font-size: 18px; margin: 0; font-weight: 900; letter-spacing: 1px;">#${ticketCode}</p>
                </div>
                <div style="border-bottom: 1px solid #dddddd; padding-bottom: 12px; margin-bottom: 12px;">
                  <p style="color: #666666; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">SUBJECT</p>
                  <p style="color: #333333; font-size: 16px; margin: 0; font-weight: 600;">${subject}</p>
                </div>
                <div>
                  <p style="color: #666666; font-size: 12px; margin: 0 0 4px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">TYPE</p>
                  <p style="color: #333333; font-size: 16px; margin: 0; font-weight: 600; text-transform: capitalize;">${inquiryType}</p>
                </div>
              </div>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                <strong>Expected Response Time:</strong> We aim to respond to all support tickets within 24-48 hours during business days (Monday - Saturday, 09:00 - 18:00 EET).
              </p>
              
              <div style="margin: 32px 0; padding: 24px; background: #f9f9f9; border-left: 4px solid #000000;">
                <p style="color: #333333; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>Keep your ticket number safe.</strong> You can use it to check the status of your request or provide additional information.
                </p>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${APP_URL}/contact" style="display: inline-block; background-color: #000000; color: white; padding: 16px 48px; font-size: 16px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                  View Ticket Status
                </a>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #000000; text-align: center; font-size: 12px; color: #999999;">
                <p style="margin: 0; line-height: 1.8;">
                  Trèigo Support Team<br/>
                  <a href="${APP_URL}/contact" style="color: #000000; text-decoration: underline;">support@treigo.eu</a><br/>
                  Monday - Saturday, 09:00 - 18:00 EET
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Support ticket email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Support ticket email service error:', error)
    return { success: false, error }
  }
}

export async function sendMessageNotificationEmail(
  recipientEmail: string,
  recipientName: string,
  senderName: string,
  messagePreview: string,
  conversationId: string,
  recipientId?: string
) {
  try {
    // Check notification preferences if recipientId is provided
    if (recipientId) {
      try {
        const { prisma } = require('./prisma')
        const preferences = await prisma.notificationPreference.findUnique({
          where: { userId: recipientId }
        })
        
        // If user has disabled chat notifications, don't send email
        if (preferences && !preferences.emailChatMessages) {
          console.log(`[EMAIL] Skipping message notification for ${recipientEmail} (disabled by user preference)`)
          return { success: true, skipped: true, reason: 'User disabled email notifications for chat messages' }
        }
      } catch (prefsError) {
        console.warn('Error checking notification preferences:', prefsError)
        // Continue with sending email if preference check fails
      }
    }

    const { data, error } = await resend.emails.send({
      from: `Trèigo <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `New message from ${senderName} - Trèigo`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Message - Trèigo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border: 2px solid #000000; padding: 40px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #000000;">
                <h1 style="color: #000000; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Trèigo</h1>
                <p style="color: #666666; font-size: 12px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Second-Hand & Premium</p>
              </div>
              
              <!-- Content -->
              <h2 style="color: #000000; font-size: 24px; font-weight: 900; margin: 24px 0; text-transform: uppercase; letter-spacing: 0.5px;">New Message</h2>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                Hi ${recipientName},
              </p>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                You have received a new message from <strong>${senderName}</strong> on Trèigo.
              </p>
              
              <!-- Message Preview -->
              <div style="background-color: #f5f5f5; border-left: 4px solid #000000; padding: 20px; margin: 32px 0;">
                <p style="color: #666666; font-size: 12px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Message Preview</p>
                <p style="color: #333333; font-size: 16px; margin: 0; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">
                  ${messagePreview.substring(0, 200)}${messagePreview.length > 200 ? '...' : ''}
                </p>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${APP_URL}/buyer/inbox" style="display: inline-block; background-color: #000000; color: white; padding: 16px 48px; font-size: 16px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                  View Message
                </a>
              </div>
              
              <div style="margin: 32px 0; padding: 24px; background: #f9f9f9; border-left: 4px solid #000000;">
                <p style="color: #333333; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>Manage your preferences:</strong> You can change how often you receive email notifications in your account settings.
                </p>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #000000; text-align: center; font-size: 12px; color: #999999;">
                <p style="margin: 0; line-height: 1.8;">
                  Trèigo - Second-Hand & Premium Marketplace<br/>
                  <a href="${APP_URL}/contact" style="color: #000000; text-decoration: underline;">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Message notification email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Message notification email service error:', error)
    return { success: false, error }
  }
}

export async function sendProductVerificationConfirmationEmail(
  email: string,
  firstName: string,
  orderCode: string,
  productNames: string[],
  verificationFee: number
) {
  try {
    const { data, error } = await resend.emails.send({
      from: `Trèigo <${FROM_EMAIL}>`,
      to: email,
      subject: `Product Verification Ordered - Order ${orderCode}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Product Verification - Trèigo</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #ffffff; border: 2px solid #000000; padding: 40px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #000000;">
                <h1 style="color: #000000; font-size: 32px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 1px;">Trèigo</h1>
                <p style="color: #666666; font-size: 12px; margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 0.5px;">Second-Hand & Premium</p>
              </div>
              
              <!-- Content -->
              <h2 style="color: #000000; font-size: 24px; font-weight: 900; margin: 24px 0; text-transform: uppercase; letter-spacing: 0.5px;">✓ Verification Ordered</h2>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                Hi ${firstName},
              </p>
              
              <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 24px 0;">
                Thank you for choosing Trèigo's product verification service! Your verification request has been received and will be processed within 24-48 hours.
              </p>
              
              <!-- Verification Details -->
              <div style="background-color: #f5f5f5; border: 2px solid #000000; padding: 24px; margin: 32px 0;">
                <h3 style="color: #000000; font-size: 14px; font-weight: 900; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;">Verification Details</h3>
                
                <p style="color: #666666; font-size: 12px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">ORDER CODE</p>
                <p style="color: #000000; font-size: 18px; font-weight: 900; margin: 0 0 24px 0; font-family: 'Courier New', monospace;">${orderCode}</p>
                
                <p style="color: #666666; font-size: 12px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">PRODUCTS TO VERIFY</p>
                <ul style="color: #333333; font-size: 14px; margin: 0 0 24px 0; padding-left: 20px; line-height: 1.8;">
                  ${productNames.map(name => `<li>${name}</li>`).join('')}
                </ul>
                
                <p style="color: #666666; font-size: 12px; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">VERIFICATION FEE</p>
                <p style="color: #000000; font-size: 18px; font-weight: 900; margin: 0;">${verificationFee.toLocaleString()} L</p>
              </div>
              
              <!-- What happens next -->
              <div style="margin: 32px 0;">
                <h3 style="color: #000000; font-size: 14px; font-weight: 900; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.5px;">What Happens Next?</h3>
                <ol style="color: #333333; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li style="margin-bottom: 8px;">Our verification experts will examine your product(s)</li>
                  <li style="margin-bottom: 8px;">You'll receive an email with detailed verification results</li>
                  <li style="margin-bottom: 8px;">Verified products get the Trèigo Verified badge</li>
                  <li>Build trust with buyers on the marketplace</li>
                </ol>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="${APP_URL}/buyer/orders" style="display: inline-block; background-color: #000000; color: white; padding: 16px 48px; font-size: 14px; font-weight: 900; text-decoration: none; text-transform: uppercase; letter-spacing: 1px;">
                  View Order
                </a>
              </div>
              
              <div style="margin: 32px 0; padding: 24px; background: #f9f9f9; border-left: 4px solid #000000;">
                <p style="color: #333333; font-size: 14px; margin: 0; line-height: 1.6;">
                  <strong>Questions?</strong> Our support team is here to help. Contact us at <a href="mailto:${VERIFICATION_EMAIL}" style="color: #000000; text-decoration: underline;">${VERIFICATION_EMAIL}</a>
                </p>
              </div>
              
              <!-- Footer -->
              <div style="margin-top: 48px; padding-top: 24px; border-top: 2px solid #000000; text-align: center; font-size: 12px; color: #999999;">
                <p style="margin: 0; line-height: 1.8;">
                  Trèigo - Second-Hand & Premium Marketplace<br/>
                  <a href="${APP_URL}/contact" style="color: #000000; text-decoration: underline;">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Product verification confirmation email error:', error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    console.error('Product verification confirmation email service error:', error)
    return { success: false, error }
  }
}