import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Music, Play, Users } from "lucide-react"
import { Appbar } from "./components/Appbar"
import { Redirect } from "./components/Redirect"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-200">
      <Appbar/>
      <Redirect/>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-gray-950 to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Let Your Fans Choose the Beat
                </h1>
                <p className="mx-auto max-w-[700px] text-xl text-gray-400">
                  FanTune revolutionizes music streaming by letting your audience pick the tracks. Create, connect, and
                  let the music flow.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-teal-500 text-gray-950 hover:bg-teal-400">Get Started</Button>
                <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-center mb-12 text-white">
              Key Features
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gray-800">
                <Users className="h-12 w-12 text-teal-500" />
                <h3 className="text-xl font-bold text-white">Fan-Driven Playlists</h3>
                <p className="text-sm text-gray-400 text-center">
                  Your audience chooses the tracks, creating a unique, interactive experience.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gray-800">
                <Play className="h-12 w-12 text-teal-500" />
                <h3 className="text-xl font-bold text-white">Live Streaming</h3>
                <p className="text-sm text-gray-400 text-center">
                  Broadcast your music sessions live with integrated chat and reactions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-gray-800">
                <Music className="h-12 w-12 text-teal-500" />
                <h3 className="text-xl font-bold text-white">Creator Tools</h3>
                <p className="text-sm text-gray-400 text-center">
                  Powerful analytics and monetization features to grow your audience and earnings.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-t from-gray-950 to-gray-900">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                  Ready to Transform Your Streams?
                </h2>
                <p className="mx-auto max-w-[600px] text-xl text-gray-400">
                  Join FanTune today and start creating unforgettable music experiences with your fans.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input
                    placeholder="Enter your email"
                    type="email"
                    className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500"
                  />
                  <Button type="submit" className="bg-teal-500 text-gray-950 hover:bg-teal-400">
                    Sign Up
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-500">© 2023 FanTune. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs text-gray-500 hover:text-teal-400 transition-colors" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs text-gray-500 hover:text-teal-400 transition-colors" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

