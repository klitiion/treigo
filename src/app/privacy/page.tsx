'use client'

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-12 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-5xl lg:text-6xl font-900 text-black mb-4 uppercase tracking-tight">PRIVACY POLICY</h1>
          <p className="text-gray-600 mb-12 uppercase text-sm tracking-wide font-semibold">How we protect your personal information</p>

          <div className="space-y-12">
            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">1. INFORMATION WE COLLECT</h2>
              <p className="text-gray-700 leading-relaxed mb-4">We collect the following information:</p>
              <ul className="text-gray-700 space-y-2 ml-6 list-disc">
                <li><strong>Account Information:</strong> Name, email, phone, password</li>
                <li><strong>Shipping Information:</strong> Address, city, country (for delivery only)</li>
                <li><strong>Payment Information:</strong> Payment method (not stored directly)</li>
                <li><strong>Transaction History:</strong> All buying and selling activity</li>
                <li><strong>Communication:</strong> Messages between users on our platform</li>
                <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
              </ul>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">2. HOW WE USE YOUR INFORMATION</h2>
              <p className="text-gray-700 leading-relaxed">We use your information to:</p>
              <ul className="text-gray-700 space-y-2 ml-6 list-disc">
                <li>Process transactions and deliver products</li>
                <li>Send order confirmations and updates</li>
                <li>Prevent fraud and verify authenticity</li>
                <li>Resolve disputes between users</li>
                <li>Improve our platform and services</li>
                <li>Send marketing emails (with your consent)</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">3. DATA PROTECTION</h2>
              <p className="text-gray-700 leading-relaxed">
                We protect your information using 256-bit SSL encryption. Payment information is processed by secure third-party payment providers. We do not store full credit card numbers on our servers.
              </p>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">4. SHARING YOUR INFORMATION</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We <strong>DO NOT sell</strong> your personal information to third parties. We only share information when:
              </p>
              <ul className="text-gray-700 space-y-2 ml-6 list-disc">
                <li>Required by law or court order</li>
                <li>Necessary to process your transactions</li>
                <li>With your explicit consent</li>
                <li>With shipping and payment partners (only what's necessary)</li>
              </ul>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">5. COOKIES</h2>
              <p className="text-gray-700 leading-relaxed">
                We use cookies to remember your preferences, keep you logged in, and improve your experience. You can disable cookies in your browser settings, but some features may not work properly.
              </p>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">6. YOUR RIGHTS</h2>
              <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
              <ul className="text-gray-700 space-y-2 ml-6 list-disc">
                <li>Access your personal data</li>
                <li>Request corrections to inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of marketing emails</li>
                <li>Request a copy of your data</li>
              </ul>
            </section>

            <section className="border-b-2 border-gray-300 pb-8">
              <h2 className="text-2xl font-bold text-black mb-4 uppercase tracking-tight">7. CONTACT US</h2>
              <p className="text-gray-700 leading-relaxed">
                For privacy questions or concerns, contact us at support@treigo.com or +355 69 208 4763.
              </p>
            </section>
          </div>
        </div>
      </main>
    )
  }
