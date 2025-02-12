"use client";

import { Appbar } from "./Appbar";
import { useEffect, useRef, useState } from "react";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
// @ts-ignore
import YouTubePlayer from 'youtube-player'
import {
  ChevronUp,
  ChevronDown,
  Share2,
  Play,
  MessageCircle,
  Instagram,
  Twitter,
} from "lucide-react";
import { YT_REGEX } from "../lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const REFRESH_INTERVAL_MS = 10 * 1000;
export interface Video {
  id: string;
  type: string;
  url: string;
  extractedId: string;
  title: string;
  smallImg: string;
  bigImg: string;
  active: boolean;
  userId: string;
  upvotes: number;
  haveUpvoted: boolean;
  spaceId: string;
}
export default function StreamView({
  creatorId,
  playVideo = false,
}: {
  creatorId: string;
  playVideo: boolean;
}) {
  const [queue, setQueue] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [playNextLoader, setPlayNextLoader] = useState(false);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const videoPlayerref = useRef<HTMLDivElement>(null)
  async function refreshStreams() {
    try {
      const res = await fetch(`/api/streams/?creatorId=${creatorId}`, {
        credentials: "include",
      });
      
      const json = await res.json();
      console.log(json.streams, "yashwwwwww");
      if (json.streams && Array.isArray(json.streams)) {
        setQueue(
          json.streams.length > 0
            ? json.streams.sort((a: any, b: any) => b.upvotes - a.upvotes)
            : []
        );
      } else {
        setQueue([]);
      }
      setCurrentVideo(json.activeStream.stream)
      
   
      
      // setCurrentVideo((video) => {
      //   if (video?.id == json.activeStream) {
      //     // console.log(video?.id,"YASH ID");
      //     // console.log(json.activeStream.stream.id,"YASH 2ID");
      //     return video;
      //   }
      //   return json.activeStream.stream || null;
      // });
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!videoPlayerref.current || !currentVideo) return;

    const player = YouTubePlayer(videoPlayerref.current);
    player.loadVideoById(currentVideo.extractedId);
    player.playVideo();

    const eventHandler = (event: { data: number }) => {
      if (event.data === 0) {
        playNext();
      }
    };
    player.on("stateChange", eventHandler);

    return () => {
      player.destroy();
    };
  }, [currentVideo, videoPlayerref]);

  const handleVote = (id: string, isUpvote: boolean) => {
    setQueue(
      queue
        .map((video) =>
          video.id === id
            ? {
                ...video,
                upvotes: isUpvote ? video.upvotes + 1 : video.upvotes - 1,
                haveUpvoted: !video.haveUpvoted,
              }
            : video
        )
        .sort((a, b) => b.upvotes - a.upvotes)
    );

    fetch(`/api/streams/${isUpvote ? "upvote" : "downvote"}`, {
      method: "POST",
      body: JSON.stringify({
        streamId: id,
      }),
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const res = await fetch("/api/streams/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creatorId,
          url: url,
        }),
      });
      const data = await res.json();
      console.log(data, "yash data");

      if (!res.ok) {
        throw new Error(data.message || "An error occurred");
      }
      setQueue([...queue, data]);
      setUrl("");
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  const playNext = async () => {
    if (queue.length > 0) {
      try {
        setPlayNextLoader(true);
        const data = await fetch(`/api/streams/next`, {
          method: "GET",
        });
        const json = await data.json();
        setCurrentVideo(json.stream);
        setQueue((q) => q.filter((x) => x.id !== json.stream?.extractedId));
      } catch (e) {
        console.error("Error playing next song:", e);
      } finally {
        setPlayNextLoader(false);
      }
    }
  };
  const handleShare = (
    platform: "whatsapp" | "twitter" | "instagram" | "clipboard"
  ) => {
    const shareableLink = `${window.location.hostname}/creator/${creatorId}`;

    if (platform === "clipboard") {
      navigator.clipboard
        .writeText(shareableLink)
        .then(() => {
          toast.success("Link copied to clipboard!");
        })
        .catch((err) => {
          console.error("Could not copy text: ", err);
          toast.error("Failed to copy link. Please try again.");
        });
    } else {
      let url;
      switch (platform) {
        case "whatsapp":
          url = `https://wa.me/?text=${encodeURIComponent(shareableLink)}`;
          break;
        case "twitter":
          url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareableLink
          )}`;
          break;
        case "instagram":
          // Instagram doesn't allow direct URL sharing, so we copy the link instead
          navigator.clipboard.writeText(shareableLink);
          toast.success("Link copied for Instagram sharing!");
          return;
        default:
          return;
      }
      window.open(url, "_blank");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-200">
      <Appbar />
      <main className="container mx-auto p-10 flex-grow">
        <div className="flex justify-between">
        <h1 className="text-4xl font-bold mb-6  text-teal-500">
        Song Poll
        </h1>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  onClick={() => setIsOpen(true)}
                  className="bg-teal-500 hover:bg-teal-400 text-gray-950"
                >
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-48 sm:max-w-md">
                <DropdownMenuLabel>Share to Social Media</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                    <span>WhatsApp</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleShare("twitter")}>
                  <div className="flex items-center space-x-2">
                    <Twitter className="h-6 w-6 text-blue-400" />
                    <span>Twitter</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleShare("instagram")}>
                  <div className="flex items-center space-x-2">
                    <Instagram className="h-6 w-6 text-pink-500" />
                    <span>Instagram</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => handleShare("clipboard")}>
                  <div className="flex items-center space-x-2">
                    <span>Copy Link to Clipboard</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
          <Card className="bg-gray-800 border-gray-700 shadow-lg">
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold text-teal-500">Add a song</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    type="text"
                    placeholder="Paste YouTube link here"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                  />
                  <Button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-400 text-gray-950"
                  >
                    {loading ? "Loading..." : "Add to Queue"}
                  </Button>
                  {url && url.match(YT_REGEX) && !loading && (
                  <div className="mt-4">
                    <LiteYouTubeEmbed title="" id={url.split("?v=")[1]}  />
                  </div>
                )}
                </form>
               
              </CardContent>
            </Card>
            <div>
              <Card className="bg-gray-800 border-gray-700 shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold text-teal-500">Now Playing</h2>
                  {currentVideo ? (
                    <div>
                      {playVideo ? (
                        <>
                        <div
                        ref={videoPlayerref}
                        className="w-full"
                        />

                      
                          {/* <iframe
                            src={`https://www.youtube.com/embed/${currentVideo.extractedId}?autoplay=1`}
                            allow="autoplay"
                            className=" flex items-center"
                            width={660} // Specify the width
                            height={320}
                          ></iframe> */}
                        </>
                      ) : (
                        <>
                          <Image
                            src={currentVideo.bigImg}
                            width={1280} // Specify the width
                            height={720} // Specify the height
                            className="w-full aspect-video object-cover rounded-md"
                            alt={currentVideo.title}
                          />
                          <p className="mt-2 text-center font-semibold text-white">
                            {currentVideo.title}
                          </p>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-400">
                      No video playing
                    </p>
                  )}
                  {playVideo && (
                    <Button
                      disabled={playNextLoader}
                      onClick={playNext}
                      className="w-full bg-teal-500 hover:bg-teal-400 text-gray-950"
                    >
                      <Play className="mr-2 h-4 w-4" />
                      {playNextLoader ? "Loading..." : "Play next"}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
            
          </div>
          <Card className="bg-gray-800 border-gray-700 p-4">
            <h2 className="text-2xl font-bold mb-4 text-teal-500">
              Upcoming Songs
            </h2>
            {queue.length === 0 ? (
              <Card className="bg-gray-800 border-gray-700 shadow-lg">
                <CardContent className="p-4 flex flex-col md:flex-row md:space-x-3">
                  <p className="text-center py-8 text-gray-400">
                    No videos in queue
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {queue.map((video) => (
                  <Card
                    key={video.id}
                    className="bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <CardContent className="p-4 flex flex-col md:flex-row md:space-x-3">
                      <Image
                      width={160}
                      height={160}
                        src={video.smallImg}
                        alt={`Thumbnail for ${video.title}`}
                        className="md:w-40 mb-5 md:mb-0 object-cover rounded-md"
                      />
                      <div className="flex-grow">
                        <h3 className="font-semibold text-white text-lg mb-2">
                          {video.title}
                        </h3>
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">
                            {video.title}
                          </span>
                          <div className="flex items-center space-x-2 mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleVote(
                                  video.id,
                                  video.haveUpvoted ? false : true,
                                )
                              }
                              className="flex items-center space-x-1 bg-gray-800 text-white border-gray-700 hover:bg-gray-700"
                            >
                              {video.haveUpvoted ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronUp className="h-4 w-4" />
                              )}
                              <span>{video.upvotes}</span>
                            </Button>
                            
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
      <footer className="text-center py-4 bg-gray-800">
        <p>&copy; 2023 Stream Song Voter. All rights reserved.</p>
      </footer>
    </div>
  );
}
