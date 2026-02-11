import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Dropzone from "react-dropzone";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const r = await fetch("/api/auth/me", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!r.ok) router.push("/login");
    }

    checkAuth();
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return alert("Choose an audio file");

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // ============================================================
      //  DEVELOPMENT → LOCAL API UPLOAD
      // ============================================================
      if (process.env.NODE_ENV === "development" && false) {
        console.log("Uploading via local API");
        const form = new FormData();
        form.append("file", file);
        if (artwork) form.append("artwork", artwork);
        form.append("title", title);
        form.append("visibility", visibility);

        const r = await fetch("/api/upload", {
          method: "POST",
          body: form,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!r.ok) throw new Error(await r.text());
        router.push("/tracks");
        return;
      }

      // ============================================================
      //  PRODUCTION → DIRECT R2 UPLOAD
      // ============================================================
      console.log("Uploading via direct R2 upload");
      const r = await fetch("/api/upload/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          visibility,
          audioType: file.type,
          artworkType: artwork?.type,
          size: file.size,
        }),
      });

      if (!r.ok) throw new Error(await r.text());

      const { audioUploadUrl, artworkUploadUrl } = await r.json();

      if (!audioUploadUrl) throw new Error("Missing audio upload URL");

      await fetch(audioUploadUrl, {
        method: "PUT",
        body: file,
      });

      if (artwork && artworkUploadUrl) {
        await fetch(artworkUploadUrl, {
          method: "PUT",
          body: artwork,
        });
      }

      router.push("/tracks");
    } catch (err) {
      console.error(err);
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

        <Dropzone onDrop={(files) => setFile(files[0])}>
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              style={{ border: "1px dashed #aaa", padding: 20 }}
            >
              <input {...getInputProps()} />
              <p>Drag & drop audio, or click to select</p>
              {file && <div>Selected: {file.name}</div>}
            </div>
          )}
        </Dropzone>

        <label>
          <div>Artwork (optional)</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setArtwork(e.target.files?.[0] || null)}
          />
        </label>

        <label>
          <div>Visibility</div>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>

        <button disabled={loading || !file}>
          {loading ? "Uploading..." : "Upload"}
        </button>

        <a href="/tracks">Back to tracks</a>
      </form>
    </div>
  );
}
