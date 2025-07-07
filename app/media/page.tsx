import MediaCard from "@/components/MediaCard";

export default function Page({}) {
  return (
    <div className="grid grid-cols-3 m-4 gap-2 h-fit">
      <MediaCard type="HEADER_LOGO" label="Header's Logo" />
      <MediaCard type="TERMS_LOGO" label="Terms's Logo" />
      <MediaCard type="SPONSORS_LOGOS" label="Sponsors Logos" />
      <MediaCard type="LANDING_VIDEO" label="Landing Video" />
      <MediaCard type="START_AUDIO" label="Start Audio" />
      <MediaCard type="END_AUDIO" label="End Audio" />
    </div>
  );
}
