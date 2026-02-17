import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Upload/Update store profile photo
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.split(' ')[1]
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let decoded: any
    try {
      decoded = verify(token, JWT_SECRET)
    } catch {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = decoded.userId || decoded.id

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get user to check if seller
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }
    })

    if (user?.role !== 'SELLER') {
      return NextResponse.json(
        { error: 'Only sellers can upload store photo' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('photo') as File
    const photoUrl = formData.get('photoUrl') as string

    if (!file && !photoUrl) {
      return NextResponse.json(
        { error: 'No photo provided' },
        { status: 400 }
      )
    }

    let storePhotoUrl = photoUrl

    // If file is provided, convert to base64
    if (file) {
      try {
        const buffer = await file.arrayBuffer()
        const base64 = Buffer.from(buffer).toString('base64')
        const mimeType = file.type || 'image/jpeg'
        storePhotoUrl = `data:${mimeType};base64,${base64}`
      } catch (error) {
        console.error('File conversion error:', error)
        return NextResponse.json(
          { error: 'Failed to process file' },
          { status: 400 }
        )
      }
    }

    // Validate image size (max 5MB for base64)
    if (storePhotoUrl && storePhotoUrl.length > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size too large (max 5MB)' },
        { status: 400 }
      )
    }

    // Update store with new photo
    const store = await prisma.shop.update({
      where: { userId },
      data: {
        storePhotoUrl,
        storePhotoUploadedAt: new Date()
      }
    })

    return NextResponse.json({
      message: 'Store photo uploaded successfully',
      storePhotoUrl: store.storePhotoUrl
    })
  } catch (error) {
    console.error('Upload store photo error:', error)
    return NextResponse.json(
      { error: 'Failed to upload store photo' },
      { status: 500 }
    )
  }
}
