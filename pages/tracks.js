import { useEffect, useState } from "react";
import TrackCard from "../components/TrackCard";

export default function TracksPage() {
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/tracks");
      setTracks(await r.json());
    })();
  }, []);

  return (
    <div style={{ maxWidth: 1000, margin: "36px auto", fontFamily: "Trubec" }}>
      <h1>Tracks</h1>
      <p style={{ marginBottom: 16 }}><a href="/upload">Upload a new track →</a></p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {tracks.map(t => (
          <TrackCard
            key={t.id}
            title={t.title || t.originalName}
            artist={t.artist || "Unknown"}
            artwork={t.artworkFile ? `/artworks/${t.artworkFile}` : null}
            src={`/uploads/${t.filename}`}
          />
        ))}
        {tracks.length === 0 && <div>No tracks yet.</div>}
      </div>
    </div>
  );
}
