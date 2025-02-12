"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { SignInFlow } from "@/types/auth-types"
import { TriangleAlert, Github } from "lucide-react" // Added Github icon import
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import type React from "react"

interface SignupCardProps {
  setFormType: (state: SignInFlow) => void
}

export default function SignupCard({ setFormType: setState }: SignupCardProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const signInWithProvider = async (provider: "github" | "credentials") => {
    try {
      if (provider === "credentials") {
        const res = signIn(provider, {
          email,
          password,
          redirect: false,
          callbackUrl: "/dashboard",
        })
        res.then((res) => {
          if (res?.error) {
            setError(res.error)
          }
          if (!res?.error) {
            router.push("/")
          }
          setPending(false)
        })
      }
      if (provider === "github") {
        const res = signIn(provider, {
          redirect: false,
          callbackUrl: "/dashboard",
        })
        res.then((res) => {
          if (res?.error) {
            setError(res.error)
          }
          console.log(res, "yash res")
          setPending(false)
        })
      }
    } catch (error) {
      console.log(error, "login")
    }
  }

  const handlerCredentialSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setPending(true)
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setPending(false)
      return
    }
    signInWithProvider("credentials")
  }

  const handleGoogleSignup = (provider: "github") => {
    setError("")
    setPending(true)
    signInWithProvider(provider)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-200">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="container px-4 md:px-6">
            <Card className="w-full max-w-md mx-auto bg-gray-800 bg-opacity-50 p-8 rounded-lg">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                  Signup to Start Listening
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!!error && (
                  <div className="flex items-center gap-x-2 rounded-md bg-red-500 bg-opacity-10 p-3 text-sm text-red-500">
                    <TriangleAlert className="h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                <form className="space-y-4" onSubmit={handlerCredentialSignup}>
                  <Input
                    disabled={pending}
                    value={email}
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                    type="email"
                    required
                  />
                  <Input
                    disabled={pending}
                    value={password}
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                    type="password"
                    required
                  />
                  <Input
                    disabled={pending}
                    value={confirmPassword}
                    placeholder="Confirm Password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                    type="password"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-teal-500 text-gray-950 hover:bg-teal-400"
                    size="lg"
                    disabled={pending}
                  >
                    Continue
                  </Button>
                </form>
                <Separator className="bg-gray-700" />
                <div className="flex flex-col items-center gap-y-2.5">
                  <Button
                    disabled={pending}
                    onClick={() => handleGoogleSignup("github")}
                    size="lg"
                    className="w-full bg-gray-700 text-gray-200 hover:bg-gray-600 flex items-center justify-center gap-2"
                  >
                    <Github className="h-5 w-5" /> {/* Added GitHub icon */}
                    Continue with GitHub
                  </Button>
                  <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <span className="cursor-pointer text-teal-500 hover:underline" onClick={() => setState("signIn")}>
                      Sign in
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  )
}

