import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmationEmail(
  email: string,
  orderCode: string,
  orderData: {
    firstName: string
    lastName: string
    total: number
    items: Array<{
      name: string
      quantity: number
      price: number
    }>
    shippingAddress: string
    shippingCity: string
  }
) {
  try {
    const itemsHtml = orderData.items
      .map(
        item => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.name}</strong><br>
            <span style="color: #6b7280; font-size: 14px;">Qty: ${item.quantity}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${(item.price * item.quantity).toLocaleString()} L
          </td>
        </tr>
      `
      )
      .join('')

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Order Confirmation</title>
          <style>
            body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background-color: #ffffff; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background-color: #ffffff; padding: 40px 20px; text-align: center; border-bottom: 2px solid #000000; }
            .header h1 { margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 2px; color: #000000; }
            .main { background: #ffffff; padding: 40px 20px; }
            .order-code { background: #f5f5f5; border: 2px solid #000000; padding: 30px 20px; margin: 30px 0; text-align: center; }
            .order-code-label { margin: 0 0 15px 0; color: #666666; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
            .order-code-value { margin: 0; font-size: 36px; font-weight: 900; color: #000000; font-family: 'Courier New', monospace; letter-spacing: 2px; }
            .order-code-note { margin: 15px 0 0 0; color: #666666; font-size: 12px; }
            .section-title { font-size: 16px; font-weight: 700; color: #000000; margin: 30px 0 15px 0; padding-bottom: 10px; border-bottom: 2px solid #000000; text-transform: uppercase; letter-spacing: 1px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table thead tr { background: #f5f5f5; }
            .items-table th { padding: 12px; text-align: left; color: #000000; font-weight: 700; border-bottom: 2px solid #000000; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
            .items-table td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .totals { border-top: 2px solid #000000; padding-top: 15px; margin-top: 20px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 14px; }
            .total-row.final { font-size: 18px; font-weight: 900; color: #000000; border-top: 2px solid #000000; padding-top: 10px; margin-top: 15px; }
            .shipping-info { background: #f5f5f5; padding: 20px; margin: 30px 0; border-left: 4px solid #000000; }
            .shipping-info h4 { margin: 0 0 15px 0; color: #000000; font-weight: 700; }
            .shipping-info p { margin: 5px 0; color: #333333; font-size: 14px; line-height: 1.6; }
            .action-buttons { text-align: center; margin: 40px 0; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap; }
            .btn { display: inline-block; padding: 14px 30px; background: #000000; color: white; text-decoration: none; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; transition: background 0.3s; }
            .btn:hover { background: #333333; }
            .btn-secondary { background: #f5f5f5; color: #000000; border: 2px solid #000000; }
            .btn-secondary:hover { background: #e8e8e8; }
            .info-box { background: #f5f5f5; padding: 20px; margin: 30px 0; border-left: 4px solid #000000; }
            .info-box h4 { margin: 0 0 10px 0; color: #000000; font-weight: 700; font-size: 14px; }
            .info-box ol { margin: 10px 0; padding-left: 20px; }
            .info-box li { margin-bottom: 8px; color: #333333; }
            .policies { background: #f5f5f5; padding: 20px; margin: 30px 0; }
            .policies h4 { margin: 0 0 15px 0; color: #000000; font-weight: 700; font-size: 14px; }
            .policy-link { display: inline-block; margin-right: 20px; margin-bottom: 10px; }
            .policy-link a { color: #000000; text-decoration: underline; font-size: 12px; }
            .cancel-notice { background: #fff5f5; border-left: 4px solid #ff6b6b; padding: 20px; margin: 30px 0; }
            .cancel-notice p { margin: 0; color: #333333; font-size: 14px; line-height: 1.6; }
            .cancel-notice strong { color: #000000; }
            .support-section { text-align: center; margin: 30px 0; padding: 20px; background: #f5f5f5; }
            .support-section p { margin: 5px 0; color: #333333; font-size: 14px; }
            .support-link { color: #000000; text-decoration: underline; font-weight: 700; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; color: #666666; font-size: 11px; border-top: 2px solid #000000; }
            .footer p { margin: 5px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <!-- Header with Logo/Name -->
            <div class="header">
              <h1>TRÈIGO</h1>
            </div>

            <!-- Main Content -->
            <div class="main">
              <p style="font-size: 14px; color: #333333; margin-bottom: 20px;">Hello ${orderData.firstName} ${orderData.lastName},</p>
              
              <p style="font-size: 14px; color: #333333; line-height: 1.6; margin-bottom: 10px;">Thank you for your purchase at Trèigo! Your order has been received and is being prepared for shipment.</p>

              <!-- Order Code -->
              <div class="order-code">
                <p class="order-code-label">🎉 Order Code</p>
                <p class="order-code-value">${orderCode}</p>
                <p class="order-code-note">Save this code to track your order</p>
              </div>

              <!-- Order Details -->
              <h3 class="section-title">Order Details</h3>
              
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th style="text-align: right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <div class="totals">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <strong>${(orderData.total - 500).toLocaleString()} L</strong>
                </div>
                <div class="total-row">
                  <span>Shipping:</span>
                  <strong>500 L</strong>
                </div>
                <div class="total-row final">
                  <span>Total:</span>
                  <strong>${orderData.total.toLocaleString()} L</strong>
                </div>
              </div>

              <!-- Shipping Info -->
              <div class="shipping-info">
                <h4>📦 Delivery Address</h4>
                <p>
                  <strong>${orderData.firstName} ${orderData.lastName}</strong><br>
                  ${orderData.shippingAddress}<br>
                  ${orderData.shippingCity}, Albania
                </p>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <a href="http://localhost:3000/track/${orderCode}" class="btn">🔍 Track Order</a>
                <a href="http://localhost:3000/contact" class="btn btn-secondary">📞 Contact Support</a>
              </div>

              <!-- Next Steps -->
              <div class="info-box">
                <h4>What Happens Next?</h4>
                <ol>
                  <li>Seller will confirm your order (within 24 hours)</li>
                  <li>Your order will be prepared and packaged</li>
                  <li>You'll receive shipping notifications for each step</li>
                </ol>
              </div>

              <!-- Policies Section -->
              <div class="policies">
                <h4>📋 Important Policies</h4>
                <p style="margin: 0 0 15px 0; color: #333333; font-size: 13px; line-height: 1.6;">
                  Please review our important policies:
                </p>
                <div class="policy-link">
                  <a href="http://localhost:3000/privacy">Privacy Policy</a>
                </div>
                <div class="policy-link">
                  <a href="http://localhost:3000/returns">Return Policy (30 Days)</a>
                </div>
                <p style="margin: 15px 0 0 0; color: #666666; font-size: 12px;">
                  You have the right to return products in good condition within 30 days of receiving your order.
                </p>
              </div>

              <!-- Cancellation Notice -->
              <div class="cancel-notice">
                <p><strong>Want to cancel your order?</strong></p>
                <p>If you wish to cancel, please contact our support team within 24 hours. After this period, your order will be prepared for shipment and cannot be cancelled.</p>
              </div>

              <!-- Support Section -->
              <div class="support-section">
                <p><strong>Need Assistance?</strong></p>
                <p>Contact us at:</p>
                <p>
                  <a href="mailto:support@treigo.eu" class="support-link">📧 support@treigo.eu</a><br>
                  <a href="http://localhost:3000/contact" class="support-link">💬 Chat Support</a>
                </p>
              </div>
            </div>

            <!-- Footer -->
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
      to: email,
      subject: `Order Confirmation - ${orderCode}`,
      html,
    })

    return result
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    throw error
  }
}

export async function sendShippingConfirmationEmail(
  email: string,
  orderCode: string,
  trackingInfo?: {
    carrier?: string
    trackingNumber?: string
  }
) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Shipping Confirmation</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; background: #f9faf8;">
            <!-- Header -->
            <div style="background: #000000; color: white; padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">🚚 Your Order Is On The Way</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Order ${orderCode} has been shipped</p>
            </div>

            <!-- Main Content -->
            <div style="background: white; padding: 40px 20px;">
              <p style="margin-top: 0;">Hello,</p>
              
              <p>Your order <strong>${orderCode}</strong> has been shipped and is on its way to you.</p>

              ${trackingInfo?.trackingNumber ? `
                <div style="background: #f5f5f5; border: 2px solid #000000; padding: 20px; margin: 30px 0;">
                  <p style="margin: 0 0 10px 0; color: #666666; font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Tracking Number</p>
                  <p style="margin: 0; font-size: 24px; font-weight: 900; color: #000000; font-family: 'Courier New', monospace; letter-spacing: 2px;">${trackingInfo.trackingNumber}</p>
                  ${trackingInfo.carrier ? `<p style="margin: 10px 0 0 0; color: #666666; font-size: 12px;">Carrier: ${trackingInfo.carrier}</p>` : ''}
                </div>
              ` : ''}

              <p>You will receive further notifications when your order has arrived.</p>

              <p style="text-align: center; margin: 30px 0 10px; color: #666666;">
                If you have any questions, please contact us at
                <a href="mailto:support@treigo.eu" style="color: #000000; text-decoration: underline; font-weight: 700;">
                  support@treigo.eu
                </a>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f5f5f5; padding: 20px; text-align: center; color: #666666; font-size: 12px; border-top: 2px solid #000000;">
              <p style="margin: 0;">© 2024 Trèigo. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'noreply@treigo.eu',
      to: email,
      subject: `Your Order Has Shipped - ${orderCode}`,
      html,
    })

    return result
  } catch (error) {
    console.error('Error sending shipping confirmation email:', error)
    throw error
  }
}
