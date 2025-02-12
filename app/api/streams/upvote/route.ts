import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
import { getServerSession } from "next-auth";

import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/db";


const UpvoteSchema = z.object({
    streamId : z.string()
})

export async function POST(req:NextRequest){
    const session = await getServerSession(authOptions);

    const user =await prisma.user.findFirst({
        where:{
            email:session?.user?.email ??""
        }
    })
    if(!session?.user?.email){
        return NextResponse.json({
            message:"Unauthenticated"
        },{
            status:403
        })
    }

    try{
        const data = UpvoteSchema.parse(await req.json())
        await prisma.upvote.create({
            data:{
                userId:session.user.id,
                streamId:data.streamId
            }
        })
        return NextResponse.json({
            message:"done Upvote"
        })
    }catch(e){
        return NextResponse.json({
            message:"Error while upvoting"
        },{
            status:403
        })
    }
    
}