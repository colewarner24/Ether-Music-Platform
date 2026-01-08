import TrackCard from "./TrackCard";

export default function Tracks({ tracks, onDelete, onEdit, editable = false }) {
  console.log("Rendering tracks:", tracks);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {tracks.map((t) => (
        <TrackCard
          key={t.id}
          title={t.title || t.originalName}
          artist={t.artist || "Unknown"}
          artwork={t.imageUrl ? `/uploads/${t.imageUrl}` : null}
          localSrc={t.filename}
          srcKey={t.audioKey}
          onDelete={() => onDelete(t.id)}
          onEdit={() => onEdit(t.id, { title: t.title, artist: t.artist })}
          editable={editable}
        />
      ))}
      {tracks.length === 0 && <div>No tracks yet.</div>}
    </div>
  );
}
