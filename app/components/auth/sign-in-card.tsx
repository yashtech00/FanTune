"use client"

import type React from "react"
import { useState } from "react"
import { TriangleAlert,Github } from "lucide-react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { SignInFlow } from "@/types/auth-types"


interface SigninCardProps {
  setFormType: (state: SignInFlow) => void
}

export default function SigninCard({ setFormType: setState }: SigninCardProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)
  const [error, setError] = useState("")
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
          if (!res?.error) {
            router.push("/")
          }
          console.log(res)
          setPending(false)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handlerCredentialSignin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setPending(true)
    signInWithProvider("credentials")
  }

  const handleGoogleSignin = (provider: "github") => {
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
                  Login to FanTune
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {!!error && (
                  <div className="flex items-center gap-x-2 rounded-md bg-red-500 bg-opacity-10 p-3 text-sm text-red-500">
                    <TriangleAlert className="h-4 w-4 shrink-0" />
                    <p>{error}</p>
                  </div>
                )}
                <form onSubmit={handlerCredentialSignin} className="space-y-4">
                  <Input
                    disabled={pending}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                    type="email"
                    required
                  />
                  <Input
                    disabled={pending}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                    type="password"
                    required
                  />
                  <Button
                    disabled={pending}
                    type="submit"
                    className="w-full bg-teal-500 text-gray-950 hover:bg-teal-400"
                    size="lg"
                  >
                    Continue
                  </Button>
                </form>
                <Separator className="bg-gray-700" />
                <div className="flex flex-col items-center gap-y-2.5">
                  <Button
                    disabled={pending}
                    onClick={() => handleGoogleSignin("github")}
                    size="lg"
                    className="w-full bg-gray-700 text-gray-200 hover:bg-gray-600"
                  >
                     <Github className="h-5 w-5" />
                    Continue with GitHub
                  </Button>
                  <p className="text-sm text-gray-400">
                    Don't have an account?{" "}
                    <span className="cursor-pointer text-teal-500 hover:underline" onClick={() => setState("signUp")}>
                      Sign up
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

