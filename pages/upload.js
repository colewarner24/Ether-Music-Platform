import { useState } from "react";
import { useRouter } from "next/router";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return alert("Choose an audio file");
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    if (artwork) form.append("artwork", artwork);
    form.append("title", title);
    form.append("artist", artist);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: form });
      if (!r.ok) throw new Error(await r.text());
      await router.push("/tracks");
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "36px auto", fontFamily: "Trubec" }}>
      <h1>Upload a Track</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
        <label>
          <div>Track title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label>
          <div>Artist</div>
          <input value={artist} onChange={(e) => setArtist(e.target.value)} />
        </label>
        <label>
          <div>Audio file</div>
          <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
        <label>
          <div>Artwork (optional)</div>
          <input type="file" accept="image/*" onChange={(e) => setArtwork(e.target.files?.[0] || null)} />
        </label>
        <button disabled={loading || !file} style={{ padding: "10px 14px" }}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        <div><a href="/tracks">Back to tracks</a></div>
      </form>
    </div>
  );
}
