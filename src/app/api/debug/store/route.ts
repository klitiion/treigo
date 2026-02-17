import { NextRequest, NextResponse } from 'next/server'
import { verificationStore } from '@/lib/verificationStore'

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      resetCodes: verificationStore.resetCodes,
      resetTokens: Object.keys(verificationStore.resetTokens),
      registrationCodes: Object.keys(verificationStore.registrationCodes),
    },
    { status: 200 }
  )
}
