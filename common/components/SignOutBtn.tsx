"use client"
import { signOut } from "next-auth/react"

function SignOutBtn() {
  return (
    <button className="w-full hover:text-gray-600 hover:bg-gray-50 p-2.5 rounded text-left" onClick={() => signOut()}>Sign out</button>
  )
}

export default SignOutBtn