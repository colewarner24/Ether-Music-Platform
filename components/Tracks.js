import TrackCard from "./TrackCard";
import { artworkUrl, audioUrl } from "@/lib/media";

export default function Tracks({ tracks, onDelete, onEdit, editable = false }) {
  console.log("Rendering tracks:", tracks);

  return (
    <div className="flex flex-col gap-4">
      {tracks.map((t) => (
        <TrackCard
          key={t.id}
          title={t.title || t.originalName}
          artist={t.user?.artistName || "Unknown"}
          artwork={artworkUrl(t.imageKey)}
          localSrc={t.audioKey}
          srcKey={t.audioKey}
          onDelete={() => onDelete(t.id)}
          onEdit={() => onEdit(t.id, { title: t.title, artist: t.artist })}
          editable={editable}
        />
      ))}
      {tracks.length === 0 && (
        <div className="ether-feedback mx-auto max-w-xl py-8 text-center">
          No tracks yet.
        </div>
      )}
    </div>
  );
}
