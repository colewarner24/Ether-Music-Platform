import TrackCard from "./TrackCard";

export default function Tracks({ tracks }) {
    return (    
        console.log('Rendering Tracks with tracks:', tracks) ||
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {tracks.map(t => (
                    <TrackCard
                        key={t.id}
                        title={t.title || t.originalName}
                        artist={t.artist || "Unknown"}
                        artwork={t.imageUrl ? `/uploads/${t.imageUrl}` : null}
                        src={`/uploads/${t.filename}`}
                    />
                ))}
                {tracks.length === 0 && <div>No tracks yet.</div>}
            </div>
        );
    }