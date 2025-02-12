"use client";  

import { useSession } from "next-auth/react";  
import { useRouter } from "next/navigation";  
import { useSearchParams } from "next/navigation"; // Import the useSearchParams hook  

import { SignInFlow } from "@/types/auth-types";  
import AuthScreen from "../components/auth/auth-screen";  

export default function AuthPage() {  
  const searchParams = useSearchParams(); // Use the useSearchParams hook  
  const formType = searchParams.get("authType") as SignInFlow; // Access authType from searchParams  
  const session = useSession();  
  const router = useRouter();  

  if (session.status === "authenticated") {  
    router.push("/"); // Use router.push without return  
  }  

  return <AuthScreen authType={formType} />;  
}