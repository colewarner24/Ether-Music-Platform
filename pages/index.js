import { useEffect, useState } from "react";

export default function Home() {
  const [file, setFile] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    const r = await fetch("/api/tracks");
    const data = await r.json();
    setTracks(data);
  }

  useEffect(() => { load(); }, []);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const r = await fetch("/api/upload", { method: "POST", body: form });
      if (!r.ok) throw new Error("upload failed");
      await load();
      setFile(null);
      e.target.reset();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "36px auto", fontFamily: "system-ui,Segoe UI,Roboto" }}>
      <h1>the ether</h1>

      <form onSubmit={onSubmit} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 24 }}>
        <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        <button disabled={!file || loading} style={{ padding: "8px 12px" }}>{loading ? "Uploading..." : "Upload"}</button>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {tracks.map(t => (
          <div key={t.id} style={{ padding: 12, border: "1px solid #eee", borderRadius: 8 }}>
            <div style={{ fontWeight: 600 }}>{t.originalName}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{Math.round(t.size / 1024)} KB • {new Date(t.createdAt).toLocaleString()}</div>
            <audio controls style={{ width: "100%", marginTop: 8 }} src={`/uploads/${t.filename}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
