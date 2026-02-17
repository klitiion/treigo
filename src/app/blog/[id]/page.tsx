'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react'

interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  date: string
  image: string
  content: string
  readTime: number
}

// Mock blog posts data
const blogPosts: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'The Future of E-Commerce in 2024: Trends and Predictions',
    excerpt: 'Explore the emerging trends that are shaping the future of online shopping.',
    category: 'TRENDS',
    author: 'Sarah Anderson',
    date: 'December 15, 2024',
    image: 'https://images.unsplash.com/photo-1460925895917-adf4e565d4ee?w=1200&h=600&fit=crop',
    readTime: 8,
    content: `The e-commerce landscape continues to evolve at a rapid pace. As we look ahead to 2024 and beyond, several key trends are emerging that will shape the future of online shopping.

## 1. AI-Powered Personalization

Artificial intelligence is revolutionizing how online retailers understand and serve their customers. Machine learning algorithms can now predict customer preferences with remarkable accuracy, enabling personalized product recommendations, dynamic pricing, and customized shopping experiences.

## 2. Sustainability and Eco-Conscious Shopping

Consumers are increasingly concerned about environmental impact. Brands that embrace sustainable practices—from eco-friendly packaging to carbon-neutral shipping—are gaining a competitive advantage. Expect to see more transparency in supply chains and certifications that verify sustainability claims.

## 3. Social Commerce Integration

The line between social media and e-commerce is blurring. Platforms like Instagram and TikTok are becoming shopping destinations, with features like live shopping events and shoppable posts. Sellers who master social commerce will have a significant advantage.

## 4. Mobile-First Shopping Experience

Mobile commerce continues to dominate. Retailers are investing heavily in mobile apps and responsive design, with features like one-click checkout and mobile payment integration becoming standard.

## 5. Voice and Visual Search

Voice-activated shopping and visual search technology are becoming mainstream. Customers can now search for products by taking photos or using voice commands, making the shopping experience more intuitive and hands-free.

## What This Means for Sellers

For sellers on platforms like Treigo, these trends present opportunities to:
- Invest in technology that enables personalization
- Communicate your sustainability efforts
- Leverage social media channels for sales
- Optimize for mobile commerce
- Implement modern search technologies

The future of e-commerce belongs to sellers who adapt quickly to these trends and embrace technology to enhance the customer experience.`
  },
  '2': {
    id: '2',
    title: 'Building Your First Online Store: A Seller\'s Guide',
    excerpt: 'Everything you need to know to launch your first online store.',
    category: 'GUIDES',
    author: 'Marcus Chen',
    date: 'December 10, 2024',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    readTime: 12,
    content: `Starting your online store can feel overwhelming, but with the right approach and strategy, you can successfully launch and grow your business. Here's a comprehensive guide to get you started.

## Step 1: Define Your Niche and Products

Before you build your store, you need to know what you're selling and who you're selling to.

- Research market opportunities
- Identify your target audience
- Choose products you're passionate about
- Validate demand through customer research

## Step 2: Plan Your Business Model

Consider how you'll operate:
- Will you handle fulfillment yourself or use dropshipping?
- What will your pricing strategy be?
- How will you handle returns and customer service?

## Step 3: Create Compelling Product Content

Great product photos and descriptions are essential.

- Invest in quality product photography
- Write clear, detailed product descriptions
- Use multiple angles and lifestyle photos
- Include size guides and specifications

## Step 4: Set Up Your Payment and Shipping

- Choose reliable payment gateways
- Establish shipping rates and policies
- Consider offering multiple shipping options
- Build in time for handling and processing

## Step 5: Launch and Market

Your store is ready to launch!

- Create a tight launch plan
- Build an email list
- Leverage social media
- Monitor analytics and adjust

Remember: Building a successful store takes time. Focus on delivering exceptional customer service and quality products, and growth will follow.`
  },
  '3': {
    id: '3',
    title: 'Customer Service Excellence: How Top Sellers Succeed',
    excerpt: 'Learn the strategies that top-performing sellers use to deliver exceptional customer service.',
    category: 'GUIDES',
    author: 'Emma Rodriguez',
    date: 'December 5, 2024',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
    readTime: 6,
    content: `Customer service is the backbone of any successful e-commerce business. Top sellers know that exceptional service leads to loyal customers and positive reviews. Here's how to achieve excellence.

## Respond Quickly

Customers appreciate fast responses. Aim to reply to messages within hours, not days.

## Be Proactive

Don't wait for customers to complain. Follow up after purchases to ensure satisfaction.

## Solve Problems Creatively

When issues arise, think of solutions that go beyond policy. Sometimes the best customer service means going the extra mile.

## Train Your Team

If you have a team, invest in training. Consistency in service quality depends on having well-trained staff.

## Gather Feedback

Ask customers for feedback and act on it. This shows you care about improvement.

## Use Technology Wisely

Chatbots and automation can help with routine inquiries, freeing you to handle complex issues.

## Build Relationships

Remember regular customers and personalize their experience. This creates loyalty that transcends price.`
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const postId = params.id as string
  const post = blogPosts[postId]

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-black uppercase tracking-wide mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-black font-bold hover:text-gray-600">
            Return to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/blog" className="flex items-center gap-2 text-black font-bold uppercase text-xs tracking-wide hover:text-gray-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          BACK TO BLOG
        </Link>
      </div>

      {/* Hero Image */}
      <div className="w-full h-96 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Meta Information */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-black text-black uppercase tracking-widest bg-gray-100 px-3 py-1">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-black">{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime} MIN READ
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none mb-12">
          {post.content.split('\n\n').map((paragraph, index) => {
            // Handle headings
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={index} className="text-2xl font-bold text-black uppercase tracking-tight mt-8 mb-4">
                  {paragraph.replace('## ', '')}
                </h2>
              )
            }
            
            // Handle lists
            if (paragraph.includes('- ')) {
              const items = paragraph.split('\n').filter(line => line.startsWith('- '))
              return (
                <ul key={index} className="list-disc list-inside space-y-2 my-4 text-gray-700">
                  {items.map((item, i) => (
                    <li key={i}>{item.replace('- ', '')}</li>
                  ))}
                </ul>
              )
            }

            // Regular paragraphs
            return (
              <p key={index} className="text-gray-700 leading-relaxed my-4">
                {paragraph}
              </p>
            )
          })}
        </div>

        {/* Share Section */}
        <div className="border-t border-gray-200 pt-8">
          <h3 className="text-lg font-bold text-black uppercase tracking-wide mb-4">SHARE THIS ARTICLE</h3>
          <div className="flex gap-4">
            <button className="px-6 py-3 border-2 border-black text-black font-bold uppercase text-xs tracking-wide hover:bg-black hover:text-white transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              SHARE ON SOCIAL
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-black font-bold uppercase text-xs tracking-wide hover:border-black transition-colors">
              EMAIL TO FRIEND
            </button>
          </div>
        </div>
      </article>

      {/* Related Articles Section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-black uppercase tracking-tight mb-12">MORE FROM THE BLOG</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Object.values(blogPosts).slice(0, 3).map((relatedPost) => (
              relatedPost.id !== post.id && (
                <Link 
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.id}`}
                  className="group border border-gray-200 hover:border-black transition-colors overflow-hidden"
                >
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-black text-black uppercase tracking-widest bg-gray-100 px-2 py-1">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-lg font-bold text-black uppercase tracking-tight mt-3 mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-xs text-gray-500">{relatedPost.date}</p>
                  </div>
                </Link>
              )
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
