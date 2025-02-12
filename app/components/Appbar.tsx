"use client";
import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/navigation";


import Link from "next/link";
import { Button } from "../../components/ui/button";


export function Appbar() {
  const session = useSession();
  const router = useRouter();

  return (
    <div className="flex justify-between px-5 py-4 md:px-10 xl:px-20">
      <div
        onClick={() => {
          router.push("/home");
        }}
        className={`flex flex-col justify-center text-lg font-bold hover:cursor-pointer  text-white}`}
      >
        Muzer
      </div>
      <div className="flex items-center gap-x-2">
     
        {session.data?.user && (
          <Button
            className="bg-teal-500 text-gray-950 hover:bg-teal-400"
            onClick={() =>
              signOut({
                callbackUrl: "/",
              })
            }
          >
            Logout
          </Button>
        )}
        {!session.data?.user && (
          <div className="space-x-3">
            <Button
              className="bg-teal-500 text-gray-950 hover:bg-teal-400"
              onClick={() => router.push("/auth")}
            >
              Signin
            </Button>
            <Link
              href={{
                pathname: "/auth",
                query: {
                  authType: "signUp",
                },
              }}
            >
              <Button
                variant={"ghost"}
                className="text-white hover:bg-white/10"
              >
                Signup
              </Button>
            </Link>
          </div>
        )}
        

      </div>
    </div>
  );
}
