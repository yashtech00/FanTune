"use client";  

import StreamView from "../components/Streamview";

const creatorId = "0b743b96-e9f1-4645-bf70-333fd15677da";  
const REFRESH_INTERVAL_MS = 10 * 1000;  

export default function Home() {  
  return <StreamView creatorId={creatorId} playVideo={true} />
}