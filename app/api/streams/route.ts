import { NextRequest, NextResponse } from "next/server";

import { promise, z } from "zod";
//@ts-expect-error
import youtubesearchapi from "youtube-search-api";
import { YT_REGEX } from "@/app/lib/utils";
import { getServerSession } from "next-auth";
import { prisma } from "@/app/lib/db";
import { authOptions } from "@/app/lib/auth-options";

const CreatStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});
const MAX_QUEUE_LEN = 20;
export async function POST(req: NextRequest) {
  try {
    console.log("Received request to create a stream");
    const data = await req.json();
    console.log(data); // Log incoming data

    const parsedData = CreatStreamSchema.parse(data);

    const isYt = parsedData.url.match(YT_REGEX);
    const videoId = parsedData.url ? parsedData.url.match(YT_REGEX)?.[1] : null;

    if (!isYt || !videoId) {
      return NextResponse.json(
        { message: "Invalid YouTube URL format" },
        { status: 411 }
      );
    }
    const session = await getServerSession(authOptions);
    if (!session?.user.id) {
      return NextResponse.json(
        {
          message: "Unauthenticated",
        },
        {
          status: 403,
        }
      );
    }
    const res = await youtubesearchapi.GetVideoDetails(videoId);

    console.log(res.title, "YASH TITLE ");
    console.log(res.thumbnail.thumbnails, "YASH THUMBNAILSS");
    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1
    );
    // const existingActiveStream = await prisma.stream.count({
    //   where: {
    //     addedById: data.creatorId,
    //   },
    // });
    // if (existingActiveStream >= MAX_QUEUE_LEN) {
    //   return NextResponse.json(
    //     {
    //       message: "Already at limit",
    //     },
    //     {
    //       status: 411,
    //     }
    //   );
    // }
    const stream = await prisma.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId: videoId,
        type: "Youtube",
        title: res.title ?? "can't find video",
        smallImg:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ??
          "https://www.shutterstock.com/image-photo/cute-american-shorthair-cat-kitten-600nw-2462996781.jpg",
        bigImg:
          thumbnails[thumbnails.length - 1].url ??
          "https://www.shutterstock.com/image-photo/cute-american-shorthair-cat-kitten-600nw-2462996781.jpg",
      },
    });
    console.log(stream, "YASH STREAM");

    return NextResponse.json({
      ...stream,
      haveUpvoted: false,
      upvotes: 0,
    });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while adding a stream",
      },
      {
        status: 500,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  const session = await getServerSession(authOptions);

  // Check for session validity
  if (!session?.user.id) {
    return NextResponse.json(
      {
        message: "Unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  // Check if creatorId is provided
  if (!creatorId) {
    return NextResponse.json(
      {
        message: "Error: Creator ID is required",
      },
      {
        status: 411,
      }
    );
  }

  try {
    console.log("stream before");

    const [streams, activeStream] = await Promise.all([
      prisma.stream.findMany({
        where: {
          userId: creatorId,
          played: false,
        },
        include: {
          _count: {
            select: {
              upvotes: true,
            },
          },
          upvotes: {
            where: {
              userId: session.user.id, // now safe to access session.user.id
            },
          },
        },
      }),
      prisma.currentStream.findFirst({
        where: {
          userId: creatorId,
        },
        include: {
          stream: true, // Ensure this includes the stream details
        },
      }),
    ]);

    // Log the activeStream result for debugging
    // console.log("Active Stream from DB:", activeStream);
    // console.log("Streams retrieved:", streams);
    // Transform stream data to include upvotes and haveUpvoted status
    return NextResponse.json({
      streams: streams.map(({ _count, ...rest }) => ({
        ...rest,
        upvotes: _count.upvotes,
        haveUpvoted: rest.upvotes.length > 0, // More concise check
      })),
      activeStream, // Return the stream details if found
    });
  } catch (e) {
    return NextResponse.json(
      { message: "Error fetching streams." },
      { status: 500 }
    );
  }
  // Fetch the streams for the given creatorId
}
