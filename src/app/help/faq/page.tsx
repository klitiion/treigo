'use client'

export default function FAQPage() {
  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click the Register button in the top navigation, fill in your email and password, and verify your email address. You can then start buying or selling.'
    },
    {
      question: 'How do I list a product?',
      answer: 'Go to your Seller Dashboard and click "Add New Product". Fill in all required information including photos, description, price, and condition. Your product will be live immediately.'
    },
    {
      question: 'Is there a fee to sell?',
      answer: 'Trèigo charges a 5% commission on each successful sale. This is deducted from the payment you receive.'
    },
    {
      question: 'How do I know if a seller is trustworthy?',
      answer: 'Check the seller\'s rating, number of sales, and customer reviews. Sellers with Trèigo Verified badge have had their products authenticated.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by seller and location. Most items arrive within 5-7 business days within Albania.'
    },
    {
      question: 'Can I change my payment method?',
      answer: 'Yes, you can update your payment method in Account Settings. Changes apply to future transactions.'
    },
    {
      question: 'What if I receive a damaged item?',
      answer: 'Report it immediately in your orders. Provide photos of the damage, and we\'ll help resolve the issue with a refund or replacement.'
    },
    {
      question: 'How do I get the Verified badge?',
      answer: 'Request verification when listing a product. Provide required photos and documents. Our team reviews within 24-48 hours.'
    },
  ]

  return (
    <main className="min-h-screen py-12 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <h1 className="text-5xl lg:text-6xl font-900 text-black mb-4 uppercase tracking-tight">FREQUENTLY ASKED QUESTIONS</h1>
        <p className="text-gray-600 mb-12 uppercase text-sm tracking-wide font-semibold">Find answers to common questions</p>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group border-2 border-black p-6 hover:bg-gray-50 transition-colors">
              <summary className="flex items-center justify-between cursor-pointer font-bold text-black uppercase tracking-wide">
                {faq.question}
                <span className="ml-4 text-2xl group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="text-gray-700 mt-4 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 bg-gray-100 border-2 border-black p-8">
          <h2 className="text-lg font-bold text-black mb-4 uppercase tracking-wide">STILL HAVE QUESTIONS?</h2>
          <p className="text-gray-700 mb-4">Contact our support team:</p>
          <p className="text-gray-700"><a href="mailto:support@treigo.com" className="text-black hover:underline font-bold">support@treigo.com</a></p>
          <p className="text-gray-700 mt-2"><a href="https://wa.me/355692084763" target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-bold">Message on WhatsApp</a></p>
        </div>
      </div>
    </main>
  )
}
