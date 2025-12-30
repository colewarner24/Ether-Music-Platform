import { useEffect, useState } from "react";
import Tracks from "@/components/Tracks";
import Loading from "@/components/Loading";
import { useTracks } from "@/hooks/useTracks";

export default function TracksPage() {
  const { tracks, setTracks, deleteTrack, updateTrack } = useTracks();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/tracks");
      setLoading(false);
      setTracks(await r.json());
    })();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: 1000, margin: "36px auto", textAlign: "center" }}>
        <h1>Tracks</h1>
        <div>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1000, margin: "36px auto" }}>
      <h1>Tracks</h1>
      <p style={{ marginBottom: 16 }}>
        <a href="/upload">Upload a new track →</a>
      </p>
      <Tracks tracks={tracks} onDelete={deleteTrack} onEdit={updateTrack} />
    </div>
  );
}
