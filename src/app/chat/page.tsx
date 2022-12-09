
import { authOptions } from '@/lib/auth'
import { unstable_getServerSession } from 'next-auth'
import React from 'react'

async function NoChatPage() {
  const session = await unstable_getServerSession(authOptions)
  return (
    <div>Hi { session?.user?.email}, You have no messages yet...</div>
  )
}

export default NoChatPage