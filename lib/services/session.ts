import { unstable_getServerSession } from "next-auth/next"
import { authOptions } from "@/core/auth"
import { User } from "@/core/types"

export async function getSession() {
  return await unstable_getServerSession(authOptions)
}

export async function getCurrentUser() {
  const session = await getSession()

  return session?.user as User
}


