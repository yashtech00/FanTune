import StreamView from "@/app/components/Streamview";


export default function creator({
  params: { creatorId },
}: {
  params: {
    creatorId: string;
  };
}) {
  return (
    <div>
      <StreamView creatorId={creatorId} playVideo={false} />
    </div>
  );
}
