import { authOptions } from "@/app/lib/auth-options";
import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Stream } from "stream";


export async function GET(){
    const session = await getServerSession(authOptions);
    
    try{
        if (!session?.user.id) {
            return NextResponse.json(
              {
                message: "Unauthenticated",
              },
              {
                status: 403,
              },
            );
          }
        const user = session.user
        const mostUpvotedStream = await prisma.stream.findFirst({
            where:{
                userId:user.id,
                played:false
            },
            orderBy:{
                upvotes:{
                    _count:'desc'
                }
            }
        });
     
        await Promise.all([prisma.currentStream.upsert({
            where:{
                userId:user.id
            },
            update:{
                streamId:mostUpvotedStream?.id
            },
            create:{
                userId:user.id,
                streamId:mostUpvotedStream?.id
            }
        }), prisma.stream.update({
            where:{
                id:mostUpvotedStream?.id ?? ""
            },
            data:{
                played:true,
                playedTs:new Date()
            }
        })])
        return NextResponse.json({
            Stream:mostUpvotedStream
        })
    }catch(e){
        console.error(e);
        
    }
    
}